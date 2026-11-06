/**
 * The URL map between the two languages.
 *
 * English pages live at the root; each German twin lives under `/de`, with a
 * German first segment where the English one is a word (`/services` is
 * `/de/leistungen`). Everything after the first segment — article and case
 * study slugs, query, hash — is shared. Internal links are written as English
 * paths and passed through `localizedPath`.
 */

import type { Locale } from './locale';

/** The German first segment of each English one that differs. `blog` stays `blog`. */
export const DE_SEGMENTS = {
    services: 'leistungen',
    contact: 'kontakt',
    privacy: 'datenschutz',
    imprint: 'impressum',
    work: 'referenzen',
} as const;

const GERMAN_PREFIX = '/de';

const toGerman = new Map<string, string>(Object.entries(DE_SEGMENTS));
const toEnglish = new Map<string, string>(Object.entries(DE_SEGMENTS).map(([en, de]) => [de, en]));

/** `enPath` (an English path, optionally with query or hash) as the page in `locale`. */
export const localizedPath = (locale: Locale, enPath: string) => {
    if (locale === 'en') {
        return enPath;
    }

    const [path, suffix] = splitSuffix(enPath);
    const mapped = mapFirstSegment(path, toGerman);

    return `${GERMAN_PREFIX}${mapped === '/' ? '' : mapped}${suffix}`;
};

/** The language of the page at `pathname`: German under `/de`, English everywhere else. */
export const localeFromPath = (pathname: string): Locale => /^\/de(?=$|[/?#])/.test(pathname) ? 'de' : 'en';

/** The same page as `pathname` in `target`, which is `pathname` itself when it already is in `target`. */
export const twinPath = (pathname: string, target: Locale) => {
    if (localeFromPath(pathname) === target) {
        return pathname;
    }

    return target === 'de' ? localizedPath('de', pathname) : englishPath(pathname);
};

/**
 * `alternates.languages` for the page pair whose English path is `enPath`.
 * Both pages carry the same map, so each names the other back; `x-default`
 * is the English one.
 */
export const pageAlternates = (enPath: string) => ({
    'en': enPath,
    'de': localizedPath('de', enPath),
    'x-default': enPath,
});

/** The English path of the German page at `dePath`. */
function englishPath(dePath: string) {
    const [path, suffix] = splitSuffix(dePath);
    // One leading slash, so `/de//host` never becomes the protocol-relative `//host`.
    const rest = path.slice(GERMAN_PREFIX.length).replace(/^\/+/, '/');

    return `${rest === '' ? '/' : mapFirstSegment(rest, toEnglish)}${suffix}`;
}

/** A path split ahead of its query or hash, which pass through untouched. */
function splitSuffix(href: string): [string, string] {
    const index = href.search(/[?#]/);

    return index === -1 ? [href, ''] : [href.slice(0, index), href.slice(index)];
}

function mapFirstSegment(path: string, segments: Map<string, string>) {
    return path.replace(/^\/([^/]+)/, (_match, segment: string) => `/${segments.get(segment) ?? segment}`);
}
