import * as WebApi from "./SporeWebApiClient.js";
import DwrClient from "./SporeDwrApiClient.js";
const DwrApi = new DwrClient();
/** Returns a list of asset IDs that are used in the specified adventure. */
export async function getAdventureAssets(adventureAssetId) {
    const xmlModel = await WebApi.getXmlModel(adventureAssetId);
    const assets = [];
    // Trim out just the contents of assets tag
    const assetsString = xmlModel.split("<assets><asset>")[1]?.split("</asset></assets>")[0];
    assetsString?.split("</asset><asset>").forEach(element => {
        assets.push(parseInt(element));
    });
    return assets;
}
/** Returns a list of assets in the specified asset's lineage. The list will be sorted newest to oldest, and will not include the specified asset. */
export async function getParentAssets(assetId) {
    const asset = await DwrApi.getAsset(assetId);
    const parentIds = [];
    const parentId = asset?.parentId;
    if (parentId) {
        parentIds.push(parentId);
        parentIds.push(...await getParentAssets(parentId));
    }
    return parentIds;
}
