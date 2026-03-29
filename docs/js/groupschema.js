import * as SporeGroupSchema from "./SporeGroupSchema.js";

const ID2NAME_ID_INPUT = document.getElementById("ID");
const ID2NAME_NAME_INPUT = document.getElementById("Name");
const ID2NAME_HIDE_DEFAULT_VARIANT_CHECKBOX = document.getElementById("HideDefaultVariant");
const ID2NAME_HIDE_DEFAULT_KIND_CHECKBOX = document.getElementById("HideDefaultKind");

const COMBINE_ENTITY_COMBOBOX = document.getElementById("Entity");
const COMBINE_VARIANT_COMBOBOX = document.getElementById("Variant");
const COMBINE_KIND_COMBOBOX = document.getElementById("Kind");
const COMBINE_NUMBER_INPUT = document.getElementById("Number");
const COMBINE_ID_INPUT = document.getElementById("CombinedID");

// ID2Name

function updateNameFromID() {
    ID2NAME_NAME_INPUT.value = SporeGroupSchema.getGroupName(
        parseInt(ID2NAME_ID_INPUT.value, 16),
        !ID2NAME_HIDE_DEFAULT_VARIANT_CHECKBOX.checked,
        !ID2NAME_HIDE_DEFAULT_KIND_CHECKBOX.checked
    );
}

ID2NAME_ID_INPUT.addEventListener("input", () => {
    if (ID2NAME_ID_INPUT.value.startsWith("0x")) {
        ID2NAME_ID_INPUT.value = ID2NAME_ID_INPUT.value.replace("0x", "");
    }
    ID2NAME_ID_INPUT.value = ID2NAME_ID_INPUT.value.replace(/[^0-9a-fA-F]/g, "");
    updateNameFromID();
});
ID2NAME_HIDE_DEFAULT_VARIANT_CHECKBOX.addEventListener("change", updateNameFromID);
ID2NAME_HIDE_DEFAULT_KIND_CHECKBOX.addEventListener("change", updateNameFromID);

// Combine

function toHexString(num) {
    return (num >>> 0).toString(16).toUpperCase();
}

function updateCombinedID() {
    COMBINE_ID_INPUT.value = toHexString(SporeGroupSchema.combineGroupID(
        parseInt(COMBINE_ENTITY_COMBOBOX.value, 10),
        parseInt(COMBINE_VARIANT_COMBOBOX.value, 10),
        parseInt(COMBINE_KIND_COMBOBOX.value, 10),
        parseInt(COMBINE_NUMBER_INPUT.value, 10)
    ));
    if (COMBINE_ID_INPUT.value == "0") {
        COMBINE_ID_INPUT.value = "";
    }
}

function createOption(name, value) {
    const option = document.createElement("option");
    option.textContent = name;
    option.value = value;
    return option;
}

function updateCombineVariantCB() {
    COMBINE_VARIANT_COMBOBOX.innerHTML = "";
    COMBINE_VARIANT_COMBOBOX.selectedIndex = 0;

    const entity = parseInt(COMBINE_ENTITY_COMBOBOX.value, 10);
    const entityEntry = SporeGroupSchema.GROUP_ENTITIES[entity];
    const variants = entityEntry ? entityEntry[1] : [];

    if (variants.length === 0) {
        COMBINE_VARIANT_COMBOBOX.disabled = true;
    } else {
        COMBINE_VARIANT_COMBOBOX.disabled = false;
        COMBINE_VARIANT_COMBOBOX.appendChild(createOption("", 0));
        variants.forEach((variantName, index) => {
            COMBINE_VARIANT_COMBOBOX.appendChild(createOption(variantName, index.toString()));
        });
    }
}

for (const [value, [name]] of Object.entries(SporeGroupSchema.GROUP_ENTITIES)) {
    COMBINE_ENTITY_COMBOBOX.appendChild(createOption(name, value));
}
COMBINE_KIND_COMBOBOX.appendChild(createOption("", 0));
for (const [value, name] of Object.entries(SporeGroupSchema.GROUP_KINDS)) {
    COMBINE_KIND_COMBOBOX.appendChild(createOption(name, value));
}
updateCombineVariantCB();

COMBINE_ENTITY_COMBOBOX.addEventListener("change", () => {
    updateCombineVariantCB();
    updateCombinedID();
});
COMBINE_VARIANT_COMBOBOX.addEventListener("change", updateCombinedID);
COMBINE_KIND_COMBOBOX.addEventListener("change", updateCombinedID);
COMBINE_NUMBER_INPUT.addEventListener("input", () => {
    COMBINE_NUMBER_INPUT.value = COMBINE_NUMBER_INPUT.value.replace(/[^0-9]/g, "");
    const num = parseInt(COMBINE_NUMBER_INPUT.value, 10);
    COMBINE_NUMBER_INPUT.value = (num > 255) ? 255 : num.toString();
    updateCombinedID();
});

