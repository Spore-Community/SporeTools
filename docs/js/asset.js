import * as SporeApi from "./SporeWebApiClient.js";
import SporePng from "./SporePngDecoder.js";
// Load an example asset or query param initially
if (window.location.search.startsWith("?assetId=")) {
    const assetId = parseInt(window.location.search.substring(9));
    updateServerData(assetId);
}
else {
    updateServerData(501054100093);
}
// Picking asset using server ID
const ASSET_ID_INPUT = document.getElementById("AssetIdInput");
ASSET_ID_INPUT.addEventListener("change", (e) => {
    if (ASSET_ID_INPUT.validity.valid) {
        updateServerData(parseInt(ASSET_ID_INPUT.value));
    }
});
ASSET_ID_INPUT.addEventListener("input", () => document.getElementById("AssetIdInputError").innerText = ASSET_ID_INPUT.validationMessage);
// Picking asset using PNG
const PNG_INPUT = document.getElementById("PngInput");
PNG_INPUT.addEventListener("change", async () => {
    const file = PNG_INPUT.files[0];
    if (file) {
        const SMALL_PNG_URL = URL.createObjectURL(file);
        const pngData = updatePngData(await file.arrayBuffer());
        updateAssetCard(pngData.name, pngData.username, SMALL_PNG_URL, undefined, pngData.assetId);
        updateServerData(pngData.assetId, false);
    }
});
/**
 * Updates the "Sporepedia Card" UI with the specified data.
 */
function updateAssetCard(name, author, smallPngUrl, largePngUrl, id) {
    // Main data
    document.getElementById("AssetName").innerText = name;
    document.getElementById("AssetAuthor").innerText = author;
    document.getElementById("AssetId").innerText = id?.toString() ?? "Not shared";
    // Link to Sporepedia website
    if (id) {
        document.getElementById("SpdLink").href = "https://www.spore.com/sporepedia#qry=ast-" + id + ":sast-" + id;
        document.getElementById("AssetCardFooter").style.display = "initial";
    }
    else {
        document.getElementById("AssetCardFooter").style.display = "none";
    }
    // PNGs
    const smallCanvas = document.getElementById("SmallPng").getContext("2d");
    smallCanvas?.clearRect(0, 0, 128, 128);
    if (smallPngUrl) {
        const smallImage = new Image();
        smallImage.crossOrigin = "Anonymous";
        smallImage.addEventListener("load", () => {
            smallCanvas?.drawImage(smallImage, 0, 0);
            // updatePngData(smallCanvas?.getImageData(0, 0, 128, 128)!);
        });
        smallImage.src = smallPngUrl;
    }
    const largeCanvas = document.getElementById("LargePng").getContext("2d");
    largeCanvas?.clearRect(0, 0, 256, 256);
    if (largePngUrl) {
        const largeImage = new Image();
        largeImage.addEventListener("load", () => largeCanvas?.drawImage(largeImage, 0, 0));
        largeImage.src = largePngUrl;
    }
}
/**
 * Updates the UI with data from the Spore Web API, using the specified ID.
 */
async function updateServerData(assetId, analyzePng = true) {
    if (assetId && assetId > 0) {
        // Retrieve data from Spore Web API
        const assetInfo = await SporeApi.getAssetInfo(assetId);
        const creatureStats = await SporeApi.getCreatureStats(assetId);
        const comments = await SporeApi.getAssetComments(assetId);
        const xmlModel = await SporeApi.getXmlModel(assetId);
        // Parse out asset name and author
        const isAssetValid = assetInfo.includes("<status>1</status>");
        if (isAssetValid) {
            const name = assetInfo.substring(assetInfo.indexOf("<name>") + 6, assetInfo.indexOf("</name>"));
            const author = assetInfo.substring(assetInfo.indexOf("<author>") + 8, assetInfo.indexOf("</author>"));
            // Update asset card UI
            updateAssetCard(name, author, SporeApi.getSmallPngUrl(assetId), SporeApi.getLargePngUrl(assetId), assetId);
        }
        else {
            updateAssetCard("Invalid asset", "...", SporeApi.getSmallPngUrl(assetId), SporeApi.getLargePngUrl(assetId), assetId);
        }
        // Update asset details UI
        document.getElementById("ServerAssetInfoData").innerText = assetInfo.replaceAll("><", ">\n<");
        document.getElementById("ServerCreatureStatsData").innerText = creatureStats.replaceAll("><", ">\n<");
        document.getElementById("ServerCommentsData").innerText = comments.replaceAll("><", ">\n<");
        document.getElementById("ServerXmlModelData").innerText = xmlModel;
        // Decode PNG data
        if (analyzePng) {
            updatePngData(await (await fetch(SporeApi.getSmallPngUrl(assetId))).arrayBuffer());
        }
    }
    // If asset ID is missing or invalid
    else {
        const message = "This creation has not been shared to Spore.com.";
        document.getElementById("ServerAssetInfoData").innerText = message;
        document.getElementById("ServerCreatureStatsData").innerText = message;
        document.getElementById("ServerCommentsData").innerText = message;
        document.getElementById("ServerXmlModelData").innerText = message;
    }
}
/**
 * Updates the UI with data obtained from decoding the specified PNG image data.
 */
function updatePngData(png) {
    const pngData = new SporePng(png);
    // Metadata
    let metadataText = `Raw metadata header: ${pngData.metadataHeader}\n\n`;
    metadataText += `Resource key: ${pngData.resourceKey.group}!${pngData.resourceKey.instance}.${pngData.resourceKey.type}\n`;
    metadataText += `Machine ID: ${pngData.machineId}\n`;
    metadataText += `Asset ID: ${pngData.assetId}\n`;
    metadataText += `Parent asset ID: ${pngData.parentAssetId}\n`;
    metadataText += `Time created: ${pngData.timestamp} seconds since AD 1\n`;
    metadataText += `Author: ${pngData.username} (${pngData.userId})\n`;
    metadataText += `Name: ${pngData.name}\n`;
    metadataText += `Description: ${pngData.description}\n`;
    metadataText += `Tags: ${pngData.tags}\n`;
    metadataText += `Consequence traits: ${pngData.consequenceTraits}\n\n`;
    metadataText += `Total data size: ${pngData.rawCompressedData.length} bytes compressed, ${pngData.rawData.length} bytes uncompressed`;
    document.getElementById("PngMetadataData").innerText = metadataText;
    // XML model
    document.getElementById("PngXmlModelData").innerText = pngData.xmlModel;
    // Raw data
    let rawText = `Raw encrypted and compressed data\n`;
    rawText += `The raw pixel data, in the BGRA order, from left to right, top to bottom. Needs to be decrypted and decompressed.\n`;
    rawText += `${pngData.rawEncryptedCompressedData}\n\n`;
    rawText += `Raw compressed data\n`;
    rawText += `The decrypted data, which is deflated. Needs to be decompressed.\n`;
    rawText += `${pngData.rawCompressedData}\n\n`;
    rawText += `Raw data\n`;
    rawText += `${pngData.rawData}`;
    document.getElementById("PngRawData").innerText = rawText;
    return pngData;
}
// Copying asset ID to clipboard
document.getElementById("CopyAssetId").addEventListener("click", () => {
    const ASSET_ID = document.getElementById("AssetId");
    // Copy to clipboard
    navigator.clipboard.writeText(ASSET_ID.innerText);
    // Flash the ID for visual feedback
    ASSET_ID.style.color = "var(--spore-accent-orange)";
    setTimeout(() => {
        ASSET_ID.style.color = "";
    }, 100);
});
