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
    async execute(className: string, methodName: string, ...parameters: (string | number | { [key: string]: string | number })[]) {
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
                    body += `${key}:${currentParameter[key]}, `;
                }
                body = body.slice(0, -2);
                body += "}\n";
            } else {
                body += `c0-param${i}=${currentParameter}\n`;
            }
        }

        // Execute the HTTP request
        let response = await this.postHttp(path, body, contentType);
        //// @ts-expect-error - TODO: remove this
        //let response = await Deno.readTextFile("DWR_API_Response_Samples/assetService.countTotalAssets");

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

// CLI testing
/*if (Deno.args.length === 2) {
    const response = await new SporeDwrApiClient().execute(Deno.args[0], Deno.args[1]);
    console.log(response);
} else {
    // Sample request
    const response = await new SporeDwrApiClient().execute("assetService", "listAssets", { userId: 500203290213, assetId: 501105456207, index: 0, count: 20, view: "OLDEST" });
    console.log(response);
}*/

//new SporeDwrApiClient().execute("profileService", "getMySporePublicData", "500203290213");
//new SporeDwrApiClient().execute("assetService", "listAssets", { userId: 500203290213, assetId: 501105456207, index: 0, count: 20, view: "OLDEST" });