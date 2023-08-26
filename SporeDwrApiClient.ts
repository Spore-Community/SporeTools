/** The default base URL to use for the DWR API. */
const API_URL = "https://spore-web-api.kade.workers.dev/jsserv/";

/**
 * Options for the Spore DWR API client.
 */
interface ApiOptions {
    /** The base URL of the DWR API. This is normally https://www.spore.com/jsserv/. */
    apiUrl?: string,
    /** The session-specific ID used to authenticate to the DWR API. */
    sessionId?: string,
    /** Unknown value. */
    callCount?: string,
    /** Unknown value. */
    batchId?: string,
    /** Unknown value. */
    c0_id?: string,
    /** The HTTP user agent to use when making requests to the API. */
    userAgent?: string
}

export type AssetType = "CREATURE" | "BUILDING" | "VEHICLE" | "UFO" | "ADVENTURE";

export type CreatureFunction = "CREATURE" | "TRIBE_CREATURE" | "CIV_CREATURE" | "SPACE_CREATURE" | "ADVENTURE_CREATURE";
export type BuildingFunction = "CITY_HALL" | "HOUSE" | "INDUSTRY" | "ENTERTAINMENT";
export type VehicleFunction = "MILITARY_LAND" | "MILITARY_WATER" | "MILITARY_AIR" | "ECONOMIC_LAND" | "ECONOMIC_WATER" | "ECONOMIC_AIR" | "CULTURAL_LAND" | "CULTURAL_WATER" | "CULTURAL_AIR" | "COLONY_LAND" | "COLONY_WATER" | "COLONY_AIR";
export type UfoFunction = "UFO";
export type AdventureFunction = "ADV_UNSET" | "ADV_TEMPLATE" | "ADV_ATTACK" | "ADV_DEFEND" | "ADV_SOCIALIZE" | "ADV_EXPLORE" | "ADV_QUEST" | "ADV_STORY" | "ADV_COLLECT" | "ADV_PUZZLE";
export type AssetFunction = CreatureFunction | BuildingFunction | VehicleFunction | UfoFunction | AdventureFunction;

export type AssetView = "NEWEST" | "OLDEST" | "TOP_RATED" | "TOP_RATED_NEW" | "TOP_RATED_AUTHOR" | "FEATURED" | "FEATURED_ADMIN" | "MAXIS_MADE" | "CUTE_AND_CREEPY" | "RANDOM" | "THERESA_VISION" | "ALL";

export type Locale = "en_US" | string;

export type Products = "SPORE_CORE" | "CUTE_AND_CREEPY" | "INSECT_LIMBS" | "EXPANSION_PACK1" | "DR_PEPPER_PARTS";

export type AssetStatus = "CLASSIFIED" | "INVALID" | "PURGED" | "DELETED";

/** Represents an item in the Spore Pollinator database. Includes users, assets, Sporecasts. */
export interface SporeItem {
    /** The ID number of this item. This will normally be a 12-digit Spore server ID. */
    id: number
}

/** Represents a Spore user/player/persona. */
export interface User extends SporeItem {
    /** The number of creations that have been shared by this user. */
    assetCount: number,
    /** The relative URL of this user's avatar image. */
    avatarImage: string,
    /** True if this user is using a custom avatar image instead of a creation. */
    avatarImageCustom: boolean
    /** The date and time that this user registered this Spore persona. */
    dateCreated: Date,
    /** Needs to be confirmed: True if this the the default Spore persona/screen name on this EA nucleus account. False if this is an alternate persona/screen name (alt). */
    default: boolean
    /** The ID number of this user. This will normally be a 12-digit Spore server ID, unless this user was created prior to the game's launch, in which case it will match the EA nucleus ID. */
    id: number
    /** The date and time that this user last logged in. May be undefined if this user has never logged in. */
    lastLogin: Date | undefined,
    /** The screen name of this user. */
    name: string,
    /** The date and time of this user's most recent creation. May be undefined if this user has never uploaded a creation. */
    newestAssetCreated: Date | undefined,
    /** The ID number of this user's EA account (nucleus account). This number will be the same for all personas/screen names (alts) attached to this EA account. */
    nucleusUserId: number,
    /** The ID number of this persona/screen name in EA's persona (game-specific ientities) system. */
    personaId: number,
    /** The screen name of this user. Duplicate of name. */
    screenName: string,
    /** The number of other users who have subscribed to this user. */
    subscriptionCount: number,
    /** The tagline of this user. */
    tagline: string | undefined,
    /** Needs to be confirmed: The date and time that this user last edited their profile details or shared a creation. */
    updated: Date,
    /** The ID number of this user. Duplicate of id. */
    userId: number
}

/** Represents a users public data, including their profile data, creations, achievements, buddies, Sporecasts, and adventure data. */
export interface MySporePublicData {
    /** The three most-recent adventures shared by this user. */
    adventuresCreated: unknown[],
    /** An array containing a single adventure where this user is #1 on the leaderboard. */
    firstPlaceAdventures: unknown[],
    highestRankedCaptain: unknown | undefined,
    mostRecentAchievement: unknown | undefined,
    /** Up to four users (sorted by lowest ID) which this user has subscribed to (added as buddy). */
    myBuddies: User[],
    /** The six most-recent creations shared by this user. */
    myCreations: Asset[],
    mySporecasts: Sporecast[],
    /** The user that this data is for. */
    ownerOfData: User,
    /** An array containing a single adventure where this user is #2 on the leaderboard. */
    secondPlaceAdventures: unknown[],
    /** An array containing a single adventure where this user is #3 on the leaderboard. */
    thirdPlaceAdventures: unknown[],
    /** The number of adventures where this user is #3 on the leaderboard. */
    totalBronzeCups: number,
    /** The number of buddies that this user has subscribed to, equivalent to myBuddies.length. */
    totalBuddyCount: number,
    /** The number of creations that this user has shared, equivalent to myCreations.length. */
    totalCreationCount: number,
    /** The number of adventures where this user is #1 on the leaderboard. */
    totalGoldCups: number,
    /** The number of adventures where this user is #2 on the leaderboard. */
    totalSilverCups: number,
    /** The total number of Sporepoints that this user has earned from completing adventures. */
    totalSporePoints: number
}

/** Represents a creation/asset. */
export interface Asset extends SporeItem {
    adventureStat: unknown | undefined,
    /** The subtype (function) of this creation. */
    assetFunction: AssetFunction,
    /** The ID number of this creation. Duplicate of id. */
    assetId: number,
    auditTrail: unknown | undefined,
    /** The user who made this creation. */
    author: User,
    /** The date and time that this creation was created. */
    created: Date,
    /** The description of this creation. If the description has been edited on Spore.com, this will reflect the updated description, not the one in the creation's PNG data. */
    description: string | undefined,
    /** If this creation has been featured by Maxis, this is the date and time it is scheduled to appear on the features view. Will be undefined if this creation is not scheduled to be featured. */
    featured: Date | undefined,
    id: number,
    imageCount: number,
    /** The locale that this creation was uploaded from. */
    localeString: Locale,
    /** The name of this creation. */
    name: string,
    /** The ID of the oldest creation in this creation's linage. If this is an original creation, this will be the ID of this creation. Lineage may be glitchy. */
    originalId: number,
    /** The ID of the immediate parent creation in this creation's lineage. If this is an original creation, this will be undefined. Lineage may be glitchy. */
    parentId: number | undefined,
    quality: boolean,
    rating: number,
    /** The Spore products required to view this creation in-game. */
    requiredProducts: Products[],
    /** The IP address from which this creation was uploaded. */
    sourceIp: string,
    /** The status of this creation. See name property. Only CLASSIFIED creations are visible on Spore.com. */
    status: {
        /** Java inner class data, not relevant. */
        declaringClass: { name: "com.ea.sp.pollinator.db.Asset$Status" },
        /** The status of this creation. Only CLASSIFIED creations are visible on Spore.com. */
        name: AssetStatus,
        nameKey: string,
    },
    /** The tags on this creation. If the tags have been edited on Spore.com, this will reflect the updated tags, not the ones in the creation's PNG data. */
    tags: string,
    thumbnailSize: number,
    /** The general type of this creation. */
    type: AssetType,
    /** The date and time that this creation was last updated. */
    updated: Date
}

/** This sporecast object is only used in `profileService.getMySporePublicData`. */
export interface Sporecast extends SporeItem {
    /** The user who created this Sporecast. */
    author: User,
    /** The date and time that the creations (entries) in this Sporecast were last updated. */
    contentUpdated: Date,
    /** The creations in this Sporecast. May not include all creations. */
    entries: Asset[],
    /** The total number of creations in this Sporecast. */
    entryCount: number,
    id: number,
    /** The locale that this Sporecast was created from. */
    locale: Locale,
    /** The name of this Sporecast. */
    name: string,
    /** The number of users subscribed to this Sporecast. */
    subscriptionCount: number,
    /** The tags on this Sporecast. */
    tags: string[],
    /** The name of this Sporecast. Duplicate of name. */
    title: string,
    type: "aggregator",
    /** The date and time that the details of this Sporecast were last updated. */
    updated: Date
}

/** Represents info about a Sporecast or buddy, as returned by methods in `sporecastService`. */
export interface SporecastOrBuddyInfo extends SporeItem {
    /** Not always included, and null when it is, purpose unknown. */
    assetIds: unknown | undefined,
    /** Not always included, and null when it is, purpose unknown. */
    assets: unknown | undefined,
    /** The user who created this Sporecast. */
    author: User,
    /** The total number of creations in this Sporecast. */
    count: number,
    id: number,
    /** The locale that this Sporecast was created from. */
    locale: Locale,
    sporecastId: {
        /** The ID of this Sporecast or user. Duplicate of parent object. */
        id: number,
        /** Whether this is a Sporecast (theme) or user (buddy). */
        type: "THEME" | "BUDDY"
    },
    /** Whether the current user is subscribed to this Sporecast. False if unauthenticated. */
    subscribed: boolean,
    /** The number of users subscribed to this Sporecast. */
    subscriptionCount: number,
    /** The name of this Sporecast. */
    title: string,
    /** Whether this is a Sporecast (theme) or user (buddy). */
    type: "THEME" | "BUDDY",
}

export interface SporecastInfo extends SporecastOrBuddyInfo {
    /** The description of this Sporecast. May be undefined if a description is not set. */
    description: string,
    /** The date and time that this Sporecast was last updated. */
    lastUpdated: Date,
    rating: number,
    sporecastId: {
        /** The ID of this Sporecast. Duplicate of parent object. */
        id: number,
        /** Whether this is a Sporecast (theme) or user (buddy). */
        type: "THEME"
    },
    /** The tags on this Sporecast. */
    tags: string,
    /** Whether this is a Sporecast (theme) or user (buddy). */
    type: "THEME"
}

export interface BuddyInfo extends SporecastOrBuddyInfo {
    /** The user that is buddied. */
    author: User,
    /** The total number of creations shared by this buddy. */
    count: number,
    sporecastId: {
        /** The ID of this user. Duplicate of parent object. */
        id: number,
        /** Whether this is a Sporecast (theme) or user (buddy). */
        type: "BUDDY"
    },
    /** Whether the current user is subscribed to this user. False if unauthenticated. */
    subscribed: boolean,
    /** Always 0. Use `author.subscriptionCount` instead. */
    subscriptionCount: number,
    /** The name of this user. */
    title: string,
    /** Whether this is a Sporecast (theme) or user (buddy). */
    type: "BUDDY"
}

/** Represents the lineage for a creation. */
export interface AssetAuthors {
    /** The original creation in lineage (oldest parent). */
    original: Asset,
    /** The immediate parent creation in lineage. */
    parent: Asset
}

/** Represents an uprate or downrate on an item. This object does not exist for unrated creations. */
export interface Rating {
    /** The chosen rating. 1 for uprate, 0 for downrate. */
    rating: number,
    /** The ID of the creation that was rated. */
    targetId: number,
    /** The ID of the user that rated the creation. */
    userId: number,
    /** The ID of this rating. This will normally be a 12-digit Spore sever ID. */
    userRatingId: number
}

/** Represents a comment on a creation. */
export interface Comment extends SporeItem {
    /** The asset that was commented on. */
    asset: Asset,
    /** The user that posted this comment. */
    author: User,
    /** The comment text. */
    comment: string,
    id: number,
    /** The comment text. Duplicate of comment. */
    name: string,
    /** Whether the comment has been approved. */
    status: "APPROVED" | string,
    /** The date and time that this comment was approved or rejected. */
    statusUpdated: Date,
    /** The date and time that this comment was posted. */
    submitted: Date,
    /** A nicely formatted date and time to be displayed in the UI. Matches submitted date. Example format: "Wed May 10, 2023" */
    submittedShortString: string,
    /** The user that posted this comment. Duplicate of author. */
    user: User
}

/** Used by `assetService.listAssets` and `assetService.countAssets` to query creations in the Spore Pollinator database. */
export interface AssetQuery {
    /** Restricts results to a specific user ID. */
    userId?: number,
    /** @deprecated Restricts results to a specific user name, however, appears to be ignored. */
    username?: string,
    /** The index to begin listing assets from, used to paginate results. */
    index?: number,
    /** The maximum number of assets to retrieve. While there is no actual limit, values over 2000 are slow and unreliable. Do not abuse. */
    count?: number,
    /** The type of asset to retrieve. */
    type?: AssetType,
    /** The subtype (function) of asset to retrieve. */
    assetFunction?: AssetFunction,
    /** Excludes assets with this type. */
    excludeType?: AssetType,
    /** The view/feed of assets to look in. ALL looks through all assets, but may be slow. Other views may not be able to retrieve all assets. */
    view?: AssetView,
    /** Restricts results to a single asset ID. When specified, most other options are ignored, and the results will contain one or zero assets. */
    assetId?: number,
    [key: string]: string | number | boolean | undefined
}

/** Used by `sporecastService.listSporecastInfos`, `countSporecastInfo`, and `listSporecastInfosSubscribedToByUser` to query sporecasts in the Spore Pollinator database. */
export interface SporecastQuery {
    /** Restricts results to a specific user ID. */
    userId?: number,
    /** The index to begin listing sporecasts from, used to paginate results. */
    index?: number,
    /** The maximum number of sporecasts to retrieve. */
    count?: number,
    /** Whether to include empty sporecasts. */
    showEmpty?: boolean,
    /** Always "THEME". */
    type?: "THEME",
    /** Restricts results to a specific sporecast ID. When specified, most other options are ignored, and the results will contain one or zero sporecasts. */
    sporecastId?: number,
    [key: string]: string | number | boolean | undefined
}

/**
 * A client for the Spore DWR API. Used to access the official Spore Pollinator database. Used by Spore.com, but not the game. No official documentation.
 * 
 * DWR is a system for accessing whitelisted Java methods from JavaScript. The methods are made available via an HTTP API, and results are returned as JS code.
 * 
 * This API client is a wrapper around this DWR API to make it easy to use from any TypeScript/JavaScript project.
 * 
 * Useful references:
 * - https://www.developer.com/design/a-field-guide-to-java-direct-web-remoting-dwr/
 * - https://github.com/LEv145/sporepedia.py
 * - https://web.archive.org/web/* /https://www.spore.com/jsserv* (note: remove space, limitation of JSDoc)
 */
export default class SporeDwrApiClient {
    /** The base URL of the DWR API. */
    apiUrl: string;

    /** The session-specific ID used to authenticate to the DWR API. */
    sessionId: string;
    /** Unknown value. */
    callCount: string;
    /** Unknown value. */
    batchId: string;
    /** Unknown value. */
    c0_id: string;

    /** The user agent to use when making requests to the DWR API. */
    userAgent?: string;

    constructor(options?: ApiOptions) {
        this.apiUrl = options?.apiUrl ?? API_URL;

        this.sessionId = options?.sessionId ?? Math.floor(Math.random() * 1000).toString();
        this.callCount = options?.callCount ?? "1";
        this.batchId = options?.batchId ?? "1";
        this.c0_id = options?.c0_id ?? "0";

        this.userAgent = options?.userAgent;
    }

    /** Gets an HTTP resource, relative to the API base URL. */
    async getHttp(path: string) {
        const headers = new Headers();
        if (this.userAgent) headers.append("User-Agent", this.userAgent);

        return (await fetch(API_URL + path, {
            method: "GET",
            headers: headers
        })).text();
    }

    async postHttp(path: string, body: string, contentType?: string) {
        const headers = new Headers();
        if (this.userAgent) headers.append("User-Agent", this.userAgent);
        if (contentType) headers.append("Content-Type", contentType);

        return (await fetch(API_URL + path, {
            method: "POST",
            headers: headers,
            body: body
        })).text();
    }

    /**
     * Executes a method on the DWR API.
     * 
     * The class and method correspond to a Java method that has been whitelisted for use in the DWR API.
     * 
     * The parameters are passed to the method. They can be strings, numbers, or objects containing strings/numbers.
     */
    async execute(className: string, methodName: string, ...parameters: (string | number | boolean | { [key: string]: string | number | boolean | undefined })[]) {
        const path = "call/plaincall/";
        const contentType = "text/plain";

        // Basic requirements for DWR request body
        let body = `scriptSessionId=${this.sessionId}\ncallCount=${this.callCount}\nbatchId=${this.batchId}\nc0-id=${this.c0_id}\n`;

        // Java class and method to call
        body += `c0-scriptName=${className}\nc0-methodName=${methodName}\n`;

        // Format the parameters for the request body
        for (let i = 0; i < parameters.length; i++) {
            const currentParameter = parameters[i];

            if (typeof currentParameter === "object") {
                body += `c0-param${i}=Object_Object:{`;
                for (const key in currentParameter) {
                    if (currentParameter[key]) {
                        body += `${key}:${currentParameter[key]}, `;
                    }
                }
                body = body.slice(0, -2);
                body += "}\n";
            } else {
                body += `c0-param${i}=${currentParameter}\n`;
            }
        }

        // Execute the HTTP request
        let response = await this.postHttp(path, body, contentType);

        // Make sure first three lines match expected format
        const DWR_EXPECTED_HEADER = "throw 'allowScriptTagRemoting is false.';\n//#DWR-INSERT\n//#DWR-REPLY\n";
        if (!response.startsWith(DWR_EXPECTED_HEADER)) {
            // TODO: error handling
            console.error("Spore DWR response header did not match expected format. This may be caused by an invalid request, or a server error.");
            //return {};
        }
        response = response.slice(DWR_EXPECTED_HEADER.length);

        // Split the response into individual JS statements
        const responseStatements = splitResponseToJsStatements(response);

        // Parse the JS statements into a single object
        return parseJsStatementsToObject(responseStatements);
    }

    /** Queries creations in the database. This can retrieve any creation that is valid/classified (not modded, purged, or deleted). */
    async listAssets(query: AssetQuery) {
        return await this.execute("assetService", "listAssets", query) as Asset[];
    }

    /** Retrieves data for a single creation, using its asset ID. */
    async getAsset(assetId: number) {
        let assets = await this.listAssets({ assetId: assetId });
        return assets[0];
    }

    /** @deprecated Use listAssets instead. Retrieves up to 2000 assets shared by the specified user. */
    async listUserAssets(userId: number, view?: AssetView) {
        return await this.listAssets({ userId: userId, count: 2000, view: view ?? "ALL" });
    }

    /** Counts the total number of creations that match the specified query. */
    async countAssets(query: AssetQuery) {
        return await this.execute("assetService", "countAssets", query) as number;
    }

    /** Counts the total number of creations of each type. */
    async countAvailableAssets() {
        const all = await this.countAssets({ view: "ALL" });
        const creatures = await this.countAssets({ view: "ALL", type: "CREATURE" });
        const buildings = await this.countAssets({ view: "ALL", type: "BUILDING" });
        const vehicles = await this.countAssets({ view: "ALL", type: "VEHICLE" });
        const ufos = await this.countAssets({ view: "ALL", type: "UFO" });
        const adventures = await this.countAssets({ view: "ALL", type: "ADVENTURE" });

        return {
            all: all,
            creatures: creatures,
            buildings: buildings,
            vehicles: vehicles,
            ufos: ufos,
            adventures: adventures
        };
    }

    /** Returns the total number of creations ever shared on Spore.com. This count includes creations that are not available. */
    async countTotalAssets() {
        return await this.execute("assetService", "countTotalAssets") as number;
    }

    /** Gets whether a user has uprated or downrated a creation. */
    async getUserAssetRating(assetId: number, userId: number) {
        let rating = await this.execute("assetService", "findUserAssetRating", assetId, userId) as Rating | undefined;
        if (rating) {
            return rating.rating === 1 ? "UPRATED" : "DOWNRATED";
        } else return undefined;
    }

    /** Gets all comments on a creation. */
    async getComments(assetId: number) {
        return await this.execute("assetService", "fetchComments", assetId) as Comment[];
    }

    /** Gets the parent creation and original (oldest) creation in the lineage for the specified creation. */
    async getAssetLineage(assetId: number) {
        return await this.execute("assetAuthorshipAdapter", "fetchAssetAuthors", assetId) as AssetAuthors;
    }

    /** Gets data for the specified user, using their ID. */
    async getUser(userId: number) {
        return await this.execute("profileService", "getMySporePublicData", userId) as User;
    }

    /** Queries Sporecasts in the database. Does not include assets in the Sporecast. */
    async listSporecasts(query: SporecastQuery) {
        return await this.execute("sporecastService", "listSporecastInfos", query) as SporecastInfo[];
    }

    /** Retrieves data for a single Sporecast, using its ID. */
    async getSporecast(sporecastId: number) {
        let sporecasts = await this.listSporecasts({ sporecastId: sporecastId });
        return sporecasts[0];
    }

    /** Counts the total number of Sporecasts that match the specified query. */
    async countSporecasts(query: SporecastQuery) {
        return await this.execute("sporecastService", "countSporecastInfo", query) as number;
    }

    /** Gets the Sporecasts and buddies that the specified user is subscribed to. */
    async listSporecastsSubscribedToByUser(userId: number) {
        return await this.execute("sporecastService", "listSporecastInfosSubscribedToByUser", userId) as SporecastOrBuddyInfo[];
    }

    /** Gets the assets in the specified Sporecast. */
    async getSporecastAssets(sporecastId: number, count?: number, index?: number) {
        return await this.execute("sporecastService", "findSporecastAssets", sporecastId, index ?? 0, count ?? 2000) as Asset[];
    }

}

/**
 * Splits a string containing multiple JS statements into an array of individual statements.
 * 
 * More specifically, splits around semicolons, but ignores semicolons inside strings/quotes.
 * New lines (CR and LF) are also ignored.
 * 
 * Semicolons will not be included in the returned statements.
 */
function splitResponseToJsStatements(responseBody: string): string[] {
    const responseStatements: string[] = [];

    // Split around semicolons, but ignore semicolons inside strings/quotes
    let currentStatement = "";
    let isInsideString = false;
    for (const char of responseBody) {
        // Ignore newlines
        if (char === "\n" || char === "\r") continue;

        // If we're not inside a string, semicolon marks end of a statement
        if (char === ";" && !isInsideString) {
            responseStatements.push(currentStatement);
            currentStatement = "";
            continue;
        }

        // If we encounter a quote that is not escaped (prefixed with \), toggle whether we're inside a string
        if (char === '"' && !currentStatement.endsWith("\\")) {
            isInsideString = !isInsideString;
        }
        // Add this character to the current statement
        currentStatement += char;
    }

    return responseStatements;
}

/**
 * Parses a series of JS statements, and returns the value of the final statement.
 * 
 * This is not a general purpose JS parser, and only supports a subset of JS that is used by the Spore DWR API.
 */
function parseJsStatementsToObject(jsStatements: string[]): object | string | number | boolean {
    const responseVariables: { [variableName: string]: any } = {};

    for (const statement of jsStatements) {
        // Final statement
        if (statement.startsWith("dwr.engine._remoteHandleCallback(")) {
            // Remove first two arguments
            const response = statement.slice(33, -1).split(",").slice(2).join(",");

            const finalResponse = parseJsVariableAsType(response);

            // Substitute referenced variables into the final response
            const finalObject = substituteVariables(finalResponse, responseVariables);

            return finalObject;
        }

        // Variable declaration
        else if (statement.startsWith("var")) {
            const [variableName, variableValue] = statement.slice(4).split("=");
            if (variableName) {
                responseVariables[variableName] = variableValue === "{}" ? {} : variableValue === "[]" ? [] : variableValue;
            } else {
                console.error("Invalid DWR variable declaration statement: " + statement);
            }
        }

        // General variable assignment
        else {
            let [variableName, variableValue] = statement.split("=");

            // Determine correct path to set variable
            let childVariableName: string | undefined;
            // Variable is an object property
            if (variableName?.includes(".")) {
                const [objectName, propertyName] = variableName.split(".");
                variableName = objectName;
                childVariableName = propertyName;
            }
            // Variable is an object property using bracket notation
            else if (variableName?.includes("['")) {
                const [objectName, propertyName] = variableName.split("['");
                variableName = objectName;
                childVariableName = propertyName?.slice(0, -2);
            }
            // Variable is an array element
            else if (variableName?.includes("[")) {
                const [arrayName, arrayIndex] = variableName.split("[");
                variableName = arrayName;
                childVariableName = arrayIndex?.slice(0, -1);
            }

            if (!variableName) {
                console.error("Invalid DWR variable name: " + statement);
                continue;
            }
            if (!variableValue) {
                console.error("Invalid DWR variable value: " + statement);
                continue;
            }

            // Parse the variable value as the correct type
            const parsedValue = parseJsVariableAsType(variableValue);

            // If the path has two parts, verify the first part exists
            if (childVariableName) {
                if (!responseVariables[variableName]) {
                    console.error("Could not assign DWR variable, path does not exist: " + statement);
                    continue;
                }
                // Set the variable
                responseVariables[variableName][childVariableName] = parsedValue;
            } else {
                // Set the variable
                // Probably unused - top-level variables don't seem to appear in Spore DWR
                responseVariables[variableName] = parsedValue;
            }
        }
    }

    // This should never happen
    console.error("Could not parse Spore DWR response, no final statement found.");
    return {};
}

/**
 * Parses the value of a JS variable, and returns it as its correct type.
 * 
 * This is not a general purpose JS parser, and only supports a subset of JS types that are used by the Spore DWR API.
 */
function parseJsVariableAsType(value: string): any {
    // Undefined values are null
    if (value === "null") {
        return undefined;
    }

    // Booleans are simply true or false
    else if (value === "true") {
        return true;
    }
    else if (value === "false") {
        return false;
    }

    // Objects start and end with curly braces
    else if (value.startsWith("{") && value.endsWith("}")) {
        // Remove braces
        value = value.slice(1, -1);

        // Split object into individual properties
        const properties = value.split(",");

        const object: { [propertyName: string]: any } = {};

        // Split each property into key and value
        for (const property of properties) {
            const [key, value] = property.split(":");

            if (!key) {
                console.error("Invalid DWR property name: " + property);
                continue;
            }
            if (!value) {
                console.error("Invalid DWR property value: " + property);
                continue;
            }

            // Parse the value as the correct type
            object[key] = parseJsVariableAsType(value);
        }

        return object;
    }

    // Arrays start and end with square brackets
    else if (value.startsWith("[") && value.endsWith("]")) {
        // Remove brackets
        value = value.slice(1, -1);

        // Split array into individual elements
        const elements = value.split(",");

        const array: any[] = [];

        // Parse each element as the correct type
        for (const element of elements) {
            array.push(parseJsVariableAsType(element));
        }

        return array;
    }

    // Strings start and end with double quotes
    else if (value.startsWith('"') && value.endsWith('"')) {
        return value.slice(1, -1);
    }

    // Enums start and end with single quotes
    else if (value.startsWith("'") && value.endsWith("'")) {
        return value.slice(1, -1);
    }

    // Numbers are just numbers
    else if (!isNaN(Number(value))) {
        return Number(value);
    }

    // Dates
    else if (value.startsWith("new Date(") && value.endsWith(")")) {
        // Remove "new Date(" and ")"
        value = value.slice(9, -1);
        return new Date(Number(value));
    }

    // Objects and arrays are variable names
    else {
        // Return an object describing the referenced variable, so we can merge into a single object later
        return { referencedVariable: value }
    }
}

/**
 * Replaces { referencedVariable: "variableName" } with the value of the referenced variable.
 */
function substituteVariables(holder: { [index: string]: any } | any[] | { referencedVariable: string }, availableVariables: { [variableName: string]: any }) {
    // Base case, object is a variable reference
    if (typeof holder === "object" && "referencedVariable" in holder) {
        holder = availableVariables[holder.referencedVariable];
    }

    // If array, look one level deep for variable references
    else if (Array.isArray(holder)) {
        // Look for objects in the array that are variable references
        for (let i = 0; i < holder.length; i++) {
            if (typeof holder[i] === "object" && "referencedVariable" in holder[i]) {
                // Get the value of the referenced variable
                let variableValue = availableVariables[holder[i].referencedVariable];

                // Perform substitutions one level deeper
                variableValue = substituteVariables(variableValue, availableVariables);

                // Substitute the variable value into the array
                holder[i] = variableValue;
            }
        }
    }

    // If object, look one level deep for variable references
    else {
        // Look for properties that are variable references
        for (const key in holder) {
            if (typeof holder[key] === "object" && "referencedVariable" in holder[key]) {
                // Get the value of the referenced variable
                let variableValue = availableVariables[holder[key].referencedVariable];

                // Perform substitutions one level deeper
                variableValue = substituteVariables(variableValue, availableVariables);

                // Substitute the variable value into the object
                holder[key] = variableValue;
            }
        }
    }

    return holder;
}

//const sporeServer = new SporeDwrApiClient();
//const response = await sporeServer.execute("assetService", "fetchComments", 501065382447);
//console.log(JSON.stringify(response));

/*// Get all of a user's creations
let userCreations = await sporeServer.listAssets({ userId: 500203290213 });

let creationsToDownload: Asset[] = [];

userCreations.forEach(async asset => {
    
    // Download each creation
    creationsToDownload.push(asset);
    
    // Check if creation has a parent
    if (asset.parentId) {
        let parentCreation = await sporeServer.getAsset(asset.parentId);
        
        // If parent creation exists, download it
        if (parentCreation) {
            creationsToDownload.push(parentCreation);
        }
    }
});

// List all creations to be downloaded
creationsToDownload.forEach(creation => {
    console.log(`[${creation.id}] ${creation.name} by ${creation.author.name}`);
});
console.log("Found " + creationsToDownload.length + " creations to download");*/