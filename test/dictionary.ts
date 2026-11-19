/**
 * Walks a copy dictionary for the per-language checks: the paths of its keys,
 * and every string it holds or builds. A function entry is called with
 * sample arguments, so the words a template adds are checked too.
 */

const SAMPLE_ARGS = [7, 'Stefan Knoch'];

interface DictionaryString {
    path: string;
    text: string;
}

/** Every key path in `value`, e.g. `author.bio.german`; arrays count by index. */
export const keyPaths = (value: unknown, prefix = ''): string[] => {
    if (typeof value !== 'object' || value === null) {
        return [prefix];
    }

    return Object.entries(value)
        .flatMap(([key, entry]) => keyPaths(entry, prefix ? `${prefix}.${key}` : key))
        .sort();
};

/** Every string in `value`, with where it sits. */
export const dictionaryStrings = (value: unknown, path = ''): DictionaryString[] => {
    if (typeof value === 'string') {
        return [{ path, text: value }];
    }

    if (typeof value === 'function') {
        return dictionaryStrings(Reflect.apply(value, undefined, SAMPLE_ARGS), `${path}()`);
    }

    if (typeof value !== 'object' || value === null) {
        return [];
    }

    return Object.entries(value).flatMap(([key, entry]) => dictionaryStrings(entry, path ? `${path}.${key}` : key));
};

/** The informal address ("du", "dich", "dir", "dein…"), which German copy never uses. */
export const INFORMAL_ADDRESS = /(?<!\p{L})(du|dich|dir|dein\p{L}*)(?!\p{L})/iu;
