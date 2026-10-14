/**
 * Which routes the sweep loads, and the status each is expected to answer.
 */

import { argOf } from './options.mjs';
import { publishedArticles } from './publishedArticles.mjs';

/** Exercises the not-found branch of /blog/[slug]. */
const MISSING_ARTICLE = '/blog/this-article-does-not-exist';
/**
 * It is swept *because* it 404s. The not-found page carries the same nav,
 * chrome and footer as any other route, so it has to read as well as they do —
 * and asserting the status here is what keeps the route from regressing back
 * into a soft 404 that answers 200 and can be indexed.
 */
const MISSING_ARTICLE_STATUS = 404;
/** Two articles is enough to catch template-wide breakage. */
const ARTICLE_SAMPLE = 2;

/** Whether `route` is the swept unknown-slug 404. */
export const isMissingArticle = route => route === MISSING_ARTICLE;

/** The status a route has to answer with. */
export const expectedStatus = route => (isMissingArticle(route) ? MISSING_ARTICLE_STATUS : 200);

/** The newest published articles, as the running site's sitemap lists them. */
const sampleArticles = async (base) => {
    const articles = await publishedArticles(base);

    // Silently checking fewer routes is the trap this default exists to close.
    if (articles.length < ARTICLE_SAMPLE) {
        throw new Error(`expected ${ARTICLE_SAMPLE}+ published posts in ${base}/sitemap.xml, found ${articles.length}`);
    }

    return articles.slice(0, ARTICLE_SAMPLE);
};

/** Every route type by default; `--routes` narrows it for a quick check. */
export const resolveRoutes = async (base) => {
    const override = argOf('routes', '');

    return override
        ? override.split(',').filter(Boolean)
        : ['/', '/blog', ...await sampleArticles(base), MISSING_ARTICLE, '/privacy'];
};
