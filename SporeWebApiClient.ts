const API_URL = "https://spore-web-api.kade.workers.dev";

async function get(path: string) {
    return (await fetch(API_URL + path)).text();
}

/**
 * Get daily stats about Spore.com
 */
export function getStats() {
    return get("/rest/stats");
}

/**
 * Get various stats like height, diet, abilities etc. for a creature, if you know it's asset Id
 */
export function getCreatureStats(assetId: number) {
    return get("/rest/creature/" + assetId);
}

/**
 * For a given asset id, get name, description, tags, 10 latest comments, type, parent, rating, creation date and author name/id
 */
export function getAssetInfo(assetId: number) {
    return get("/rest/asset/" + assetId);
}

/**
 * For a given asset id, get a list of comments, sender names and comment dates
 */
export function getAssetComments(assetId: number, startIndex = 0, length = 1000) {
    return get(`/rest/comments/${assetId}/${startIndex}/${length}`);
}


/**
 * Get the XML sporemodel file for an asset
 */
export function getXmlModel(assetId: number) {
    const id = assetId.toString();
    return get(`/static/model/${id.substring(0, 3)}/${id.substring(3, 6)}/${id.substring(6, 9)}/${id}.xml`);
}

/**
 * Get the URL for the small PNG for an asset
 */
export function getSmallPngUrl(assetId: number) {
    const id = assetId.toString();
    return `${API_URL}/static/thumb/${id.substring(0, 3)}/${id.substring(3, 6)}/${id.substring(6, 9)}/${id}.png`;
}

/**
 * Get the URL for the large PNG for an asset
 */
export function getLargePngUrl(assetId: number) {
    const id = assetId.toString();
    return `${API_URL}/static/image/${id.substring(0, 3)}/${id.substring(3, 6)}/${id.substring(6, 9)}/${id}_lrg.png`;
}