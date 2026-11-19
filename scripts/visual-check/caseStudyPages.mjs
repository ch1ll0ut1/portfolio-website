/**
 * The case study pages, as the running site lists them in its own sitemap,
 * in sitemap order. Read from the server under test for the same reason as
 * `publishedArticles.mjs`: a renamed slug cannot silently drop out of a sweep.
 *
 * Shared by the visual and accessibility checks.
 */

const CASE_PATH = /^\/work\/[^/]+$/;

/** Fetches `${base}/sitemap.xml` and returns the path of every `/work/<slug>` page. */
export const caseStudyPages = async (base) => {
    const response = await fetch(`${base}/sitemap.xml`);

    if (!response.ok) {
        throw new Error(`could not read ${base}/sitemap.xml: HTTP ${response.status}`);
    }

    const xml = await response.text();

    return [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)]
        .map(match => new URL(match[1]?.trim() ?? '', base).pathname)
        .filter(path => CASE_PATH.test(path));
};
