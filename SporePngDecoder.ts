import * as UPNG from "./UPNG.js";
import * as pako from "./pako.js";

class PngDecodingError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "PngDecodingError";

    }
}

/**
 * Decrypts the data found in the PNG.
 * Not sure how this code works, basing it off https://github.com/Spore-Community/PNG-Decoder-Python and https://github.com/Spore-Community/PNG-Decoder-NetCore
 */
class Decoder {
    data: Uint8ClampedArray;
    hash: number;
    nextPos: number;

    constructor(data: Uint8ClampedArray) {
        this.data = data;
        this.hash = 0x811c9dc5;
        this.nextPos = 0x0b400;
    }

    decode(dataOut: Uint8ClampedArray): number {
        for (let j = 0; j < dataOut.length; ++j) {
            let b = 0;
            for (let i = 0; i < 8; ++i) {
                let n = this.nextPos;
                let d = this.data[n]!;
                let possiblyBigE = BigInt(this.hash) * 0x1000193n; // without this, e is too big for JS to handle reliably
                let e = Number(possiblyBigE & 0xffffffffn);
                this.hash = e ^ ((n & 7) | (d & 0xf8));
                e = ((d & 1) << 7) ^ ((this.hash & 0x8000) >> 8);
                b = (b >>> 1) | e;
                this.nextPos = (n >> 1) ^ (0x0b400 & -(n & 1));

                if (this.nextPos === 0x0b400) {
                    return j;
                }
            }
            dataOut[j] = b;
        }
        return dataOut.length;
    }
}

export default class SporePng {

    /** The raw pixel data, in the BGRA order, from left to right, top to bottom. Needs to be decrypted and decompressed. */
    readonly rawEncryptedCompressedData: Uint8ClampedArray;

    /** The decrypted data, which is deflated. Needs to be decompressed. */
    readonly rawCompressedData: Uint8ClampedArray;

    /** The full PNG data. */
    readonly rawData: string;

    /** The raw pollen metadata header. */
    readonly metadataHeader: string;


    /** The XML model for the creation. */
    readonly xmlModel: string;


    /** The resource key for this asset, defining its location inside the game's package files. */
    readonly resourceKey: {
        /** The type of asset, such as crt, bld, vcl, ufo, flr... */
        type: string,
        /** The group ID (folder) that contains this asset, corresponding to its type. */
        group: string,
        /** The ID (filename) of this asset. */
        instance: string
    };

    /** Constant for user/machine where the asset was made? Purpose unknown. */
    readonly machineId: string;

    /** The unique ID of this asset on the server. If undefined, this asset was not shared. */
    readonly assetId: number | undefined;

    /** The asset ID of the parent asset, if this asset was edited. Used for lineage. */
    readonly parentAssetId: number | undefined;

    /** The time when this asset was created, in seconds since AD 1. */
    readonly timestamp: number;

    /** The author's username. May be computer username if this asset was created offline. */
    readonly username: string;

    /** The author's user ID, uniquely identifying them on the server. May be undefined if this asset was created offline. */
    readonly userId: number | undefined;

    /** The name of this asset. */
    readonly name: string;

    /** The description, as set in the editor. NOT updated if the description is changed on Spore.com. */
    readonly description: string;

    /** The tags, as set in the editor. NOT updated if the tags are changed on Spore.com. */
    readonly tags: string;

    /** The IDs of consequence traits this creature has obtained. Will be empty for non-creatures. The length corresponds to the number of stages completed. */
    readonly consequenceTraits: string[];


    constructor(png: ImageData | ArrayBuffer) {
        let bgraData = new Uint8ClampedArray(65536);

        if ("data" in png) {
            // Make sure size is correct
            if (png.height !== 128 || png.width !== 128) {
                throw new PngDecodingError(`Invalid PNG size (${png.width}x${png.height}), must be 128x128`);
            }

            // Read data and convert from RGBA to BGRA
            //let bgraData = new Uint8ClampedArray(png.data.length);
            // Get one pixel at a time
            for (let i = 0; i < png.data.length; i += 4) {
                // Retrieve from RGBA format
                const R = png.data[i + 0]!;
                const G = png.data[i + 1]!;
                const B = png.data[i + 2]!;
                const A = png.data[i + 3]!;

                // Store in BGRA format
                bgraData[i + 0] = B;
                bgraData[i + 1] = G;
                bgraData[i + 2] = R;
                bgraData[i + 3] = A;
            }
        } else {
            let img = UPNG.decode(png);
            let rgbaBuffer = UPNG.toRGBA8(img)[0] as ArrayBuffer;
            let rgbaData = new Uint8ClampedArray(rgbaBuffer);

            // Read data and convert from RGBA to BGRA
            // Get one pixel at a time
            for (let i = 0; i < rgbaData.length; i += 4) {
                // Retrieve from RGBA format
                const R = rgbaData[i + 0]!;
                const G = rgbaData[i + 1]!;
                const B = rgbaData[i + 2]!;
                const A = rgbaData[i + 3]!;

                // Store in BGRA format
                bgraData[i + 0] = B;
                bgraData[i + 1] = G;
                bgraData[i + 2] = R;
                bgraData[i + 3] = A;
            }
        }

        this.rawEncryptedCompressedData = bgraData;

        // Set up decoder to decrypt the image data
        let decoder = new Decoder(bgraData);

        // Get the length of the data
        let lengthData = new Uint8ClampedArray(8);
        decoder.decode(lengthData);
        let decodedLength = new DataView(lengthData.buffer).getInt32(4, true);

        // If decoded length is >8183, the data was too large to fit in the PNG
        if (decodedLength > 8183) {
            let errorMsg = `This creation is too complex to fit in a PNG. Some data may be missing or invalid. ${decodedLength} bytes, max 8183 bytes.`;
            console.error(errorMsg);
            alert(errorMsg);
            decodedLength = 8183;
        }

        // Decode the data
        let decodedData = new Uint8ClampedArray(decodedLength);
        let realLength = decoder.decode(decodedData);
        this.rawCompressedData = decodedData;

        // If decoded length and real length do not match, something went wrong
        // (probably an overcomplex creation where the data didn't fit in the PNG)
        if (decodedLength !== realLength) {
            console.error(`The Spore PNG is invalid. Expected ${decodedLength} bytes, got ${realLength} bytes. Data may be missing or broken. This could be caused by creation that was too complex to fit in a PNG.`)
        }

        // Decompress the data
        let decompressedData = pako.inflate(new Uint8Array(decodedData));

        // Convert to string
        let data = new TextDecoder().decode(decompressedData);
        this.rawData = data;

        // Parse the metadata header
        let currentPosition = 0;
        const read = (length: number) => {
            let data = this.rawData.substring(currentPosition, currentPosition + length);

            // If character is non-ASCII, Spore counts it as two, so need to subtract
            for (let char of data) {
                if (char.charCodeAt(0) > 127) {
                    //console.log(`The Spore PNG metadata header has unicode character ${char} (${char.charCodeAt(0)})`);
                    length--;
                    if (char.charCodeAt(0) > 2047) {
                        length--;
                    }
                }
            }
            data = this.rawData.substring(currentPosition, currentPosition + length);

            currentPosition += length;
            return data;
        }
        if (read(5) !== "spore") {
            console.error(`The Spore PNG is invalid. Invalid metadata header. Note that adventures are not currently supported.`)
        }
        let headerVersion = parseInt(read(4));
        if (headerVersion !== 4 && headerVersion !== 5 && headerVersion !== 6) {
            console.error(`The Spore PNG is invalid. Invalid metadata version: ${headerVersion}`)
        }

        // Resource key and machine ID
        this.resourceKey = {
            type: read(8),
            group: read(8),
            instance: read(8)
        };
        this.machineId = read(8);

        // Asset IDs (cap at 502000000000 since JS doesn't parse negatives)
        this.assetId = parseInt(read(16), 16);
        if (this.assetId > 502000000000) this.assetId = undefined;
        if (headerVersion === 6) {
            this.parentAssetId = parseInt(read(16), 16);
            if (this.parentAssetId > 502000000000) this.parentAssetId = undefined;
        }

        // Timestamp
        this.timestamp = parseInt(read(16), 16);

        // Username and ID
        let usernameLength = parseInt(read(2), 16);
        this.username = read(usernameLength);
        this.userId = parseInt(read(16), 16);
        if (this.userId > 502000000000) this.userId = undefined;

        // Name, description, tags
        let nameLength = parseInt(read(2), 16);
        this.name = read(nameLength);
        let descriptionLength = parseInt(read(3), 16);
        this.description = read(descriptionLength);
        let tagsLength = parseInt(read(2), 16);
        this.tags = read(tagsLength);

        // Consequence traits
        this.consequenceTraits = [];
        if (headerVersion >= 5) {
            let traitCount = parseInt(read(2), 16);
            for (let i = 0; i < traitCount; i++) {
                this.consequenceTraits.push(read(8));
            }
        }

        // Remaining data is the model data
        this.metadataHeader = this.rawData.substring(0, currentPosition);
        this.xmlModel = this.rawData.substring(currentPosition);
    }

}