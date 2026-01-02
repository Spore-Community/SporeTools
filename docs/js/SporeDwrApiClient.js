/** The default base URL to use for the DWR API. */
const API_URL = "https://spore-web-api.kade.workers.dev/jsserv/";
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
    apiUrl;
    /** The session-specific ID used to authenticate to the DWR API. */
    sessionId;
    /** Unknown value. */
    callCount;
    /** Unknown value. */
    batchId;
    /** Unknown value. */
    c0_id;
    /** The user agent to use when making requests to the DWR API. */
    userAgent;
    constructor(options) {
        this.apiUrl = options?.apiUrl ?? API_URL;
        this.sessionId = options?.sessionId ?? Math.floor(Math.random() * 1000).toString();
        this.callCount = options?.callCount ?? "1";
        this.batchId = options?.batchId ?? "1";
        this.c0_id = options?.c0_id ?? "0";
        this.userAgent = options?.userAgent;
    }
    /** Gets an HTTP resource, relative to the API base URL. */
    async getHttp(path) {
        const headers = new Headers();
        if (this.userAgent)
            headers.append("User-Agent", this.userAgent);
        return (await fetch(API_URL + path, {
            method: "GET",
            headers: headers
        })).text();
    }
    async postHttp(path, body, contentType) {
        const headers = new Headers();
        if (this.userAgent)
            headers.append("User-Agent", this.userAgent);
        if (contentType)
            headers.append("Content-Type", contentType);
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
    async execute(className, methodName, ...parameters) {
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
            }
            else {
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
    async listAssets(query) {
        return await this.execute("assetService", "listAssets", query);
    }
    /** Retrieves data for a single creation, using its asset ID. */
    async getAsset(assetId) {
        let assets = await this.listAssets({ assetId: assetId });
        return assets[0];
    }
    /** @deprecated Use listAssets instead. Retrieves up to 2000 assets shared by the specified user. */
    async listUserAssets(userId, view) {
        return await this.listAssets({ userId: userId, count: 2000, view: view ?? "ALL" });
    }
    /** Counts the total number of creations that match the specified query. */
    async countAssets(query) {
        return await this.execute("assetService", "countAssets", query);
    }
    /** Counts the total number of creations of each type. */
    async countAvailableAssets() {
        const all = await this.countAssets({ view: "ALL" });
        const creatures = await this.countAssets({ view: "ALL", type: "CREATURE" });
        const buildings = await this.countAssets({ view: "ALL", type: "BUILDING" });
        const vehicles = await this.countAssets({ view: "ALL", type: "VEHICLE" });
        const ufos = await this.countAssets({ view: "ALL", type: "UFO" });
        const adventures = await this.countAssets({ view: "ALL", type: "ADVENTURE" });
        const sporecasts = await this.countSporecasts({ type: "THEME" });
        return {
            all: all,
            creatures: creatures,
            buildings: buildings,
            vehicles: vehicles,
            ufos: ufos,
            adventures: adventures,
            sporecasts: sporecasts
        };
    }
    /** Returns the total number of creations ever shared on Spore.com. This count includes creations that are not available. */
    async countTotalAssets() {
        return await this.execute("assetService", "countTotalAssets");
    }
    /** Gets whether a user has uprated or downrated a creation. */
    async getUserAssetRating(assetId, userId) {
        let rating = await this.execute("assetService", "findUserAssetRating", assetId, userId);
        if (rating) {
            return rating.rating === 1 ? "UPRATED" : "DOWNRATED";
        }
        else
            return undefined;
    }
    /** Gets all comments on a creation. */
    async getComments(assetId) {
        return await this.execute("assetService", "fetchComments", assetId);
    }
    /** Gets the parent creation and original (oldest) creation in the lineage for the specified creation. */
    async getAssetLineage(assetId) {
        return await this.execute("assetAuthorshipAdapter", "fetchAssetAuthors", assetId);
    }
    /** Gets data for the specified user, using their ID. */
    async getUser(userId) {
        return await this.execute("profileService", "getMySporePublicData", userId);
    }
    /** Queries Sporecasts in the database. Does not include assets in the Sporecast. */
    async listSporecasts(query) {
        return await this.execute("sporecastService", "listSporecastInfos", query);
    }
    /** Retrieves data for a single Sporecast, using its ID. */
    async getSporecast(sporecastId) {
        let sporecasts = await this.listSporecasts({ sporecastId: sporecastId });
        return sporecasts[0];
    }
    /** Counts the total number of Sporecasts that match the specified query. */
    async countSporecasts(query) {
        return await this.execute("sporecastService", "countSporecastInfo", query);
    }
    /** Gets the Sporecasts and buddies that the specified user is subscribed to. */
    async listSporecastsSubscribedToByUser(userId) {
        return await this.execute("sporecastService", "listSporecastInfosSubscribedToByUser", userId);
    }
    /** Gets the assets in the specified Sporecast. */
    async getSporecastAssets(sporecastId, count, index) {
        return await this.execute("sporecastService", "findSporecastAssets", sporecastId, index ?? 0, count ?? 2000);
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
function splitResponseToJsStatements(responseBody) {
    const responseStatements = [];
    // Split around semicolons, but ignore semicolons inside strings/quotes
    let currentStatement = "";
    let isInsideString = false;
    for (const char of responseBody) {
        // Ignore newlines
        if (char === "\n" || char === "\r")
            continue;
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
function parseJsStatementsToObject(jsStatements) {
    const responseVariables = {};
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
            }
            else {
                console.error("Invalid DWR variable declaration statement: " + statement);
            }
        }
        // General variable assignment
        else {
            let [variableName, variableValue] = statement.split("=");
            // Determine correct path to set variable
            let childVariableName;
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
            }
            else {
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
function parseJsVariableAsType(value) {
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
        const object = {};
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
        const array = [];
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
        return { referencedVariable: value };
    }
}
/**
 * Replaces { referencedVariable: "variableName" } with the value of the referenced variable.
 */
function substituteVariables(holder, availableVariables) {
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
/*const sporecasts = await sporeServer.listSporecasts({ type: "THEME", fetchAssetIdCount: 1, index: 0, count: 1000, sort: "RATING" });
sporecasts.forEach(s => {
    console.log(s.id + " | " + s.title + " | " + s.author.name + " | " + s.count + " creations");
});*/
