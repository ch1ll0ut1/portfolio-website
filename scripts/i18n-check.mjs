/**
 * Checks the two languages against each other on a running server, over
 * every page its sitemap lists:
 *
 * - `<html lang>` is the page's language: `de` under `/de`, `en` elsewhere.
 * - The page names itself as canonical, and its hreflang links (en, de and
 *   x-default, the last equal to en) include itself and are named back the
 *   same by its twin.
 * - Every same-origin `<a href>` on a German page stays under `/de`, and no
 *   English page links under `/de`. The exceptions are the language links
 *   themselves, marked with `hreflang` set to the other language, the feeds
 *   and static assets.
 *
 * Reads the server-rendered HTML, which is the whole page: every route is
 * prerendered, and client components render the same links on hydration.
 *
 * Usage:
 *   node scripts/i18n-check.mjs [--base http://localhost:3000]
 */

const argOf = (name, fallback) => {
    const index = process.argv.indexOf(`--${name}`);

    return index >= 0 ? process.argv[index + 1] : fallback;
};

const BASE = argOf('base', 'http://localhost:3000');
/** The canonical origin, which canonical and hreflang URLs are written on. */
const SITE_ORIGIN = 'https://stefanknoch.com';
const SAME_ORIGINS = new Set([new URL(BASE).origin, SITE_ORIGIN]);
const CONCURRENCY = 8;
/** Paths that are no page in either language: feeds, build output and files with an extension. */
const EXEMPT_PATH = /^\/(?:de\/)?feed\.xml$|^\/_next\/|\.[a-z0-9]{2,5}$/i;

const localeOf = path => (/^\/de(?=$|\/)/.test(path) ? 'de' : 'en');

const decode = value => value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, '\'')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

/** The attributes of one start tag, lower-cased names to decoded values. */
const attributesOf = (tag) => {
    const attributes = {};

    for (const match of tag.matchAll(/([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g)) {
        attributes[match[1].toLowerCase()] = decode(match[2] ?? match[3] ?? match[4] ?? '');
    }

    return attributes;
};

/** Every start tag named `name` in `html`, as its attributes. */
const tagsOf = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))]
    .map(match => attributesOf(match[0].slice(name.length + 1)));

const sitemapPaths = async () => {
    const response = await fetch(`${BASE}/sitemap.xml`);

    if (!response.ok) {
        throw new Error(`could not read ${BASE}/sitemap.xml: HTTP ${response.status}`);
    }

    const xml = await response.text();

    return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(decode(match[1].trim())).pathname);
};

/** What one page says about its language, its twin and its links. */
const readPage = async (path) => {
    const response = await fetch(`${BASE}${path}`, { redirect: 'manual' });
    const html = response.ok ? await response.text() : '';
    const links = tagsOf(html, 'link');
    const languages = Object.fromEntries(links
        .filter(link => link.rel === 'alternate' && link.hreflang)
        .map(link => [link.hreflang, new URL(link.href, SITE_ORIGIN).pathname]));
    const canonical = links.find(link => link.rel === 'canonical')?.href;

    return {
        path,
        status: response.status,
        lang: attributesOf(/<html\b([^>]*)>/i.exec(html)?.[1] ?? '').lang,
        canonical: canonical ? new URL(canonical, SITE_ORIGIN).pathname : undefined,
        languages,
        anchors: tagsOf(html, 'a').filter(anchor => anchor.href !== undefined),
    };
};

/** The problems with one page, each a line of text. */
const checkPage = (page, byPath) => {
    const problems = [];
    const locale = localeOf(page.path);
    const other = locale === 'de' ? 'en' : 'de';

    if (page.status !== 200) {
        return [`HTTP ${page.status}`];
    }

    if (page.lang !== locale) {
        problems.push(`<html lang="${page.lang}">, expected "${locale}"`);
    }

    if (page.canonical !== page.path) {
        problems.push(`canonical ${page.canonical}, expected itself`);
    }

    const { languages } = page;
    const keys = Object.keys(languages).sort().join(',');

    if (keys !== 'de,en,x-default') {
        problems.push(`hreflang languages [${keys}], expected [de,en,x-default]`);
    }
    else {
        if (languages['x-default'] !== languages.en) {
            problems.push(`x-default ${languages['x-default']} is not the English page ${languages.en}`);
        }

        if (languages[locale] !== page.path) {
            problems.push(`hreflang ${locale} is ${languages[locale]}, not the page itself`);
        }

        const twin = byPath.get(languages[other]);

        if (!twin) {
            problems.push(`twin ${languages[other]} is not in the sitemap`);
        }
        else if (JSON.stringify(sorted(twin.languages)) !== JSON.stringify(sorted(languages))) {
            problems.push(`twin ${twin.path} names ${JSON.stringify(sorted(twin.languages))} back, not ${JSON.stringify(sorted(languages))}`);
        }
    }

    for (const anchor of page.anchors) {
        const target = linkTarget(anchor.href, page.path);

        if (!target || EXEMPT_PATH.test(target) || anchor.hreflang === other) {
            continue;
        }

        if (localeOf(target) !== locale) {
            problems.push(`links to ${anchor.href}, a page in the other language, without hreflang="${other}"`);
        }
    }

    return problems;
};

/** The same-origin path an `href` on the page at `path` points at, or undefined for another origin. */
function linkTarget(href, path) {
    if (href === '' || href.startsWith('#')) {
        return path;
    }

    const url = new URL(href, `${BASE}${path}`);

    return SAME_ORIGINS.has(url.origin) && /^https?:$/.test(url.protocol) ? url.pathname : undefined;
}

function sorted(languages) {
    return Object.fromEntries(Object.entries(languages).sort(([a], [b]) => a.localeCompare(b)));
}

const main = async () => {
    const paths = await sitemapPaths();
    const pages = [];

    for (let index = 0; index < paths.length; index += CONCURRENCY) {
        pages.push(...await Promise.all(paths.slice(index, index + CONCURRENCY).map(readPage)));
    }

    const byPath = new Map(pages.map(page => [page.path, page]));
    let failed = 0;

    for (const page of pages) {
        const problems = checkPage(page, byPath);

        console.log(`${problems.length === 0 ? 'ok  ' : 'FAIL'} ${page.path} [${localeOf(page.path)}, ${page.anchors.length} links]`);
        for (const problem of problems) {
            console.log(`       - ${problem}`);
        }

        failed += problems.length > 0 ? 1 : 0;
    }

    const german = pages.filter(page => localeOf(page.path) === 'de').length;

    console.log(`\n${pages.length} pages (${pages.length - german} English, ${german} German): ${failed} with problems`);
    process.exitCode = failed > 0 ? 1 : 0;
};

await main();
