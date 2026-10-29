/**
 * Fragment ids for a document's headings, so every section has a link.
 *
 * One slugger per rendered document: the ids are unique within it, and the
 * same markdown always yields the same ids, so a shared link keeps working.
 */

/** Used when a heading has no letters or digits to build an id from. */
const FALLBACK = 'section';

/**
 * A URL-safe id from heading text: lower case, accents dropped, anything but
 * letters, digits, spaces and hyphens removed, runs of spaces and hyphens
 * collapsed into one hyphen.
 */
export const slugify = (text: string) => {
    const slug = text
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/[\s-]+/g, '-')
        .replace(/^-|-$/g, '');

    return slug || FALLBACK;
};

/**
 * Returns a function that slugs each heading it is given, numbering repeats
 * (`faq`, `faq-2`, `faq-3`) so no two headings in the document share an id.
 */
export const createSlugger = () => {
    const seen = new Set<string>();

    return (text: string) => {
        const base = slugify(text);
        let id = base;

        for (let suffix = 2; seen.has(id); suffix++) {
            id = `${base}-${suffix}`;
        }
        seen.add(id);

        return id;
    };
};
