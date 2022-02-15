import * as SporeHash from "./SporeHash.js";
const NAME_INPUT = document.getElementById("Name");
const HASH_INPUT = document.getElementById("Hash");
NAME_INPUT.addEventListener("input", () => {
    HASH_INPUT.value = SporeHash.calculateHashString(NAME_INPUT.value);
});
