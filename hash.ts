import * as SporeHash from "./SporeHash.js";

const NAME_INPUT = document.getElementById("Name") as HTMLInputElement;
const HASH_INPUT = document.getElementById("Hash") as HTMLInputElement;

NAME_INPUT.addEventListener("input", () => {
    HASH_INPUT.value = SporeHash.calculateHashString(NAME_INPUT.value);
});