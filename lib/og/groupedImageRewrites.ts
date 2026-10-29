/**
 * Keeps the English share-card URLs working since the English routes moved
 * into the `app/(en)` route group.
 *
 * Next gives an `opengraph-image` or `twitter-image` file under a route group
 * a six-character suffix, so `/work/x/opengraph-image` is now served at
 * `/work/x/opengraph-image-j99tbg` (next/dist/lib/metadata/get-metadata-route.js).
 * The pages' own meta tags follow on their own, but anything that wrote the
 * old URL down does not: the case studies' JSON-LD (lib/caseStudySchema.ts)
 * and every share card a network cached before the move. A rewrite serves the
 * old URL from the new route, so both keep working.
 */

/** The route group the English pages live in. */
const ENGLISH_GROUP = '(en)';

/**
 * Each English directory with its own share cards, as its path inside the
 * group, in Next's `[param]` form. ./groupedImageRewrites.test.ts checks
 * this list against the files.
 */
export const ENGLISH_IMAGE_DIRS = ['', '/blog', '/contact', '/privacy', '/services', '/work/[slug]'];

const IMAGES = ['opengraph-image', 'twitter-image'];

/** The rewrites from each card's old URL to the one Next serves it at now. */
export const groupedImageRewrites = () => ENGLISH_IMAGE_DIRS.flatMap((dir) => {
    const suffix = metadataRouteSuffix(`/${ENGLISH_GROUP}${dir}`);
    const urlDir = dir.replace(/\[(\w+)\]/g, ':$1');

    return IMAGES.map(image => ({
        source: `${urlDir}/${image}`,
        destination: `${urlDir}/${image}-${suffix}`,
    }));
});

/**
 * Next's suffix for a metadata image in `parentPath`: the 32-bit djb2 hash of
 * that path in base 36, first six digits (next/dist/shared/lib/hash.js).
 */
export function metadataRouteSuffix(parentPath: string) {
    let hash = 5381;

    for (let index = 0; index < parentPath.length; index++) {
        hash = ((hash << 5) + hash + parentPath.charCodeAt(index)) & 0xffffffff;
    }

    return (hash >>> 0).toString(36).slice(0, 6);
}
