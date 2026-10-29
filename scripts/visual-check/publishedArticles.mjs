/**
 * The published articles, newest first, as the running site lists them in its
 * own sitemap.
 *
 * The sitemap is the one place that already answers "which posts does this
 * site serve": it is built from `config/blog.ts`, lists only published posts
 * and dates each one. Reading it from the server under test, rather than
 * parsing the TypeScript config, means a renamed field or a reformatted entry
 * cannot silently drop posts from the sweep.
 *
 * Shared by the visual and accessibility checks.
 */

const ARTICLE_PATH = /^\/blog\/[^/]+$/;

/** The text of the first `<tag>` inside `xml`, or undefined. */
const tagText = (xml, tag) => new RegExp(`<${tag}>([^<]*)</${tag}>`).exec(xml)?.[1]?.trim();

/**
 * Fetches `${base}/sitemap.xml` and returns each article's path and date,
 * newest first. Paths are taken from the canonical URLs, so they resolve
 * against whichever server `base` points at.
 */
export const publishedArticles = async (base) => {
    const response = await fetch(`${base}/sitemap.xml`);

    if (!response.ok) {
        throw new Error(`could not read ${base}/sitemap.xml: HTTP ${response.status}`);
    }

    const xml = await response.text();

    return (xml.match(/<url>[\s\S]*?<\/url>/g) ?? [])
        .map(entry => ({
            path: new URL(tagText(entry, 'loc') ?? '', base).pathname,
            date: tagText(entry, 'lastmod') ?? '',
        }))
        .filter(article => ARTICLE_PATH.test(article.path))
        .sort((a, b) => b.date.localeCompare(a.date))
        .map(article => article.path);
};
