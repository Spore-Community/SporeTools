// tslint:disable: no-bitwise
/**
 * Calculates the Spore FNV hash for the specified string.
 * @param text the string to calculate a hash for
 * @returns the hash
 */
export function calculateHash(text) {
    let hash = 0x811C9DC5;
    [...text].forEach(letter => {
        hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
        hash ^= letter.toLowerCase().charCodeAt(0);
    });
    return hash;
}
/**
 * Calculates the Spore FNV hash for the specified string, and returns it as a hex string.
 * @param text the string to calculate a hash for
 * @returns the hash as a hex string
 */
export function calculateHashString(text) {
    const hash = calculateHash(text);
    return (hash >>> 0).toString(16).toUpperCase();
}
