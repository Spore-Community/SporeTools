/**
 * Spore group entity with its variants (two first bytes of a group ID).
 * @param name the entity name
 * @param variants the list of variants 
 */
export type GroupEntity = [name: string, variants: string[]];

/**
 * Spore group entities schema gathered from different sources (mostly the Feb2008 build).
 */
export const GROUP_ENTITIES: Record<number, GroupEntity> = {
    // Feb2008: kLibEntityNames
    0x00: ['system', []],
    0x01: ['local', []],
    
    // Feb2008: kGraphicsEntityNames
    0x20: ['lighting', []],
    0x21: ['materials', []],
    
    // Feb2008: kAppEntityNames
    0x40: ['app', []],
    0x41: ['cameras', []],
    0x42: ['appModes', []],
    0x43: ['localization', []],
    0x44: ['viewer', []],
    0x45: ['effects', []],
    0x46: ['ui', [
        'default',
        'assetBrowser'
    ]], // Feb2008: kLayoutVariantNames
    0x47: ['options', []],
    
    // Feb2008: kEditorEntityNames
    0x60: ['editor', [
        'standard',
        'animation'
    ]], // Feb2008: kRigblockVariantNames
    0x61: ['cell', []],
    0x62: ['creature', [
        'adult',
        'baby'
    ]], // Feb2008: kCreatureVariantNames
    0x63: ['building', [
        'standard',
        'cityHall',
        'house',
        'farm',
        'industry',
        'market',
        'entertainment',
        'defense',
        'military',
        'culture',
        'diplomacy'
    ]], // Feb2008: kBuildingVariantNames
    0x64: ['vehicle', [
        'standard',
        'militaryLand',
        'militaryWater',
        'militaryAir',
        'economicLand',
        'economicWater',
        'economicAir',
        'culturalLand',
        'culturalWater',
        'culturalAir',
        'harvester'
    ]], // Feb2008: kVehicleVariantNames
    0x65: ['ufo', []],
    0x66: ['flora', [
        'small',
        'medium',
        'large'
    ]], // Feb2008: kFloraVariantNames
    0x67: ['hut', []],
    0x68: ['tool', []],
    0x6a: ['skinPaint', []],
    0x6b: ['palette', []],
    
    // Feb2008: kGameEntityNames
    0x80: ['game', []],
    0x81: ['tribe', []],
    0x82: ['city', []],
    0x83: ['civilization', []],
    0x84: ['planet', [
        'main',
        'templates',
        'themes',
        'spec',
        'norm',
        'scatter',
        'atmosphere'
    ]], // Feb2008: kPlanetVariantNames
    0x85: ['solarSystem', []],
    0x86: ['interstellar', []],
    0x87: ['galaxy', []],
    0x88: ['arcade', []],
    0x89: ['cinematics', []],

    // Spore_EP1_Data: 0x0!plugins.pfx
    0x8a: ['scenario', []],
    
    // Feb2008: kTerrainEntityNames
    0xa0: ['terrainSystem', []],
    
    // Feb2008: kAudioEntityNames
    0xc0: ['audio', []]
};

/**
 * Spore group kinds schema gathered from different sources (mostly the Feb2008 build).
 */
export const GROUP_KINDS: Record<number, string> = {
    // Feb2008: kLibKindNames
    0x00: 'base',
    0x01: 'config',
    0x02: 'script',
    
    // Feb2008: kGraphicsKindNames
    0x20: 'asset',
    0x21: 'texture',
    0x22: 'gameAsset',
    0x24: 'thumbnail',
    0x25: 'sourceMeshes',
    0x26: 'modelLOD',
    0x27: 'builtin',
    0x28: 'imposter',
    0x29: 'gameTexture',
    0x2a: 'renderTarget',
    0x2b: 'photo',
    0x2c: 'imposterNMap',
    
    // Feb2008: kAppKindNames
    0x40: 'pack',
    0x41: 'layout',
    0x42: 'packedLayout',

    // Spore_EP1_Data: 0x0!plugins.pfx
    0x43: 'effects',
    
    // Feb2008: EditorKindNames
    0x60: 'rigblock',
    0x61: 'runtimeRigblock',
    0x62: 'editorModel',
    0x63: 'animation',
    0x64: 'hair',
    0x65: 'limbTuning',
    0x66: 'muscles',
    0x67: 'paints',
    0x68: 'palettes',
    0x69: 'stats',
    
    // Feb2008: kPaletteKindNames
    0x6a: 'definition',
    0x6b: 'definitionpart',
    0x6c: 'page',
    0x6d: 'pagepart',
    0x6e: 'category',
    0x6f: 'filter',
    0x70: 'playmodeBG',
    0x71: 'editorModelHi',
    0x72: 'editorModelMax',
    0x73: 'playmodeMisc',
    0x74: 'block',
    0x75: 'blockassembly',
    0x76: 'skinpaint',
    0x77: 'skinpainttheme',
    0x78: 'blockpaint',
    0x79: 'blockpainttheme',
    0x7a: 'animButton',
    0x7b: 'manifest',
    0x7c: 'scaleSet',
    0x7d: 'rigblockTemplate',
    0x7e: 'rubbleModel',
    0x7f: 'playmodemodels',
    
    // Feb2008: kGameKindNames
    0x80: 'planetInfo',
    0x81: 'walls',
    0x82: 'terrariuminventory',
    0x83: 'terrariummodels',
    0x84: 'terrariummodules',
    0x85: 'terrariumactiontrees',
    0x86: 'terrariumbadges',
    0x87: 'combatmodels',
    
    // Feb2008: kTerrainKindNames
    0xa0: 'manual',
    0xa1: 'gameplay',
    0xa2: 'artDirected',
    0xa3: 'spaceT0A0',
    0xa4: 'spaceT0A1',
    0xa5: 'spaceT0A2',
    0xa6: 'spaceT1A0',
    0xa7: 'spaceT1A1',
    0xa8: 'spaceT1A2',
    0xa9: 'spaceT2A0',
    0xaa: 'spaceT2A1',
    0xab: 'spaceT2A2',
    0xac: 'prototype',
    0xad: 'spacePrototype',
    0xae: 'artDirectedPrototype',
    0xaf: 'specialUse',
    0xb0: 'terraform0',
    0xb1: 'terraform1',
    0xb2: 'terraform2',
    0xb3: 'terraform3',
    0xb8: 'rockSet',
    
    // Feb2008: kAudioKindNames
    0xc0: 'symbollist',
    0xc1: 'mouthmap',
    0xc2: 'citymusic',
    
    // Feb2008: kEditorKindNames2
    0xe0: 'playmodepanels',
    0xe1: 'playmodeanims',
    0xe2: 'paintmap',
};

/**
 * Spore uses the '@' prefix, while most Spore modding tools use the '~' suffix.
 * @param groupName the raw/unformatted group name
 * @returns the formatted group name
 */
function formatGroupName(groupName: string) {
	return `@${groupName}`;
}

/**
 * Returns Spore group name according to the schema.
 * Keep in mind that an unknown kind and the same number with kind 0x00 may collide if writeDefaultKind is set to false.
 * @param groupId the group id
 * @param writeDefaultVariant should the default entity variant be added, or stripped like in Spore
 * @param writeDefaultKind should the default kind be added, or stripped like in Spore
 * @returns the human-readable group name 
 */
export function getGroupName(
    groupId: number,
    writeDefaultVariant: boolean = false,
    writeDefaultKind: boolean = false
): string | null {
	/**
	 * Feb2008: SP::GetNameFromGroupID
	 * (two MSBs must be 0b01, the ID is treated like an instance ID / FNV hash otherwise)
	 */
    if (((groupId >>> 30) & 0b00000011) !== 1) {
        return null;
    }

    const variant: number = (groupId >>> 24) & 0b00111111;
    const entity: number = (groupId >>> 16) & 0b11111111;
    const kind: number = (groupId >>> 8) & 0b11111111;
    const num: number = groupId & 0b11111111;

    let entityName: string;
    let entityVariants: string[] = [];

    let groupName: string; 

	// Entity
	const entityEntry = GROUP_ENTITIES[entity];
    if (entityEntry !== undefined) {
        [entityName, entityVariants] = entityEntry;
        groupName = entityName;
    } else {
        groupName = entity.toString();
    }
	// Variant
	if (variant !== 0 || writeDefaultVariant) {
		groupName += '+';
		groupName += (variant < entityVariants.length)
			? entityVariants[variant]
			: variant.toString();
    }
	// Kind
    if (kind in GROUP_KINDS) {
        if (kind > 0 || writeDefaultKind) {
            groupName += '_' + GROUP_KINDS[kind];
        }
    } else {
        groupName += '_' + kind.toString();
    }
	// Number
    if (num > 0) {
        groupName += '_' + num.toString();
    }

    return formatGroupName(groupName);
}

/**
 * Combines parts of a Spore group ID into a single 4-byte number.
 * @param entity the group entity (0-255) 
 * @param variant the group entity variant (0-63) 
 * @param kind the group kind (0-255)
 * @param num the additional group number/index (0-255)
 */
export function combineGroupID(
    entity: number,
    variant: number,
    kind: number,
    num: number = 0
): number | null {
	if (
		entity < 0 || entity > 0b11111111
		|| variant < 0 || variant > 0b00111111
		|| kind < 0 || kind > 0b11111111
		|| num < 0 || num > 0b11111111
	) {
		return null;
	}
	return (((1 << 30) | (variant << 24) | (entity << 16) | (kind << 8) | num) >>> 0);
}
