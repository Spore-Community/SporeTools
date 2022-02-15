import * as SporeAPI from "./SporeWebApiClient.js";

document.getElementById("Content")!.innerText = await SporeAPI.getCreatureStats(500267423060);