/**
 * Which routes the sweep loads, and the status each is expected to answer.
 */

import { argOf } from './options.mjs';
import { caseStudyPages } from './caseStudyPages.mjs';
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

/** What Next's dev server adds to a page whose render a `notFound()` ended. */
const DEV_NOT_FOUND_MARKER = '<meta name="next-error" content="not-found"/>';

/** The status a route has to answer with. */
export const expectedStatus = route => (route === MISSING_ARTICLE ? MISSING_ARTICLE_STATUS : 200);

/**
 * Whether `response` answers `route` with the status it should.
 *
 * The missing article is a 404 in production, where Next prerenders it before
 * sending anything. The dev server renders it on request and streams it, so
 * its 200 is already sent by the time the page's `notFound()` reaches the
 * post's not-found boundary (see app/blog/[slug]/layout.tsx). There the real
 * 404 is told from a soft one by the marker Next's dev server adds for a
 * caught `notFound()`, which a page that merely rendered the panel lacks.
 */
export const answersAsExpected = async (route, response) => {
    if (response.status() === expectedStatus(route)) {
        return true;
    }

    return route === MISSING_ARTICLE
      && response.status() === 200
      && (await response.text()).includes(DEV_NOT_FOUND_MARKER);
};

/** The newest published articles, as the running site's sitemap lists them. */
const sampleArticles = async (base) => {
    const articles = await publishedArticles(base);

    // Silently checking fewer routes is the trap this default exists to close.
    if (articles.length < ARTICLE_SAMPLE) {
        throw new Error(`expected ${ARTICLE_SAMPLE}+ published posts in ${base}/sitemap.xml, found ${articles.length}`);
    }

    return articles.slice(0, ARTICLE_SAMPLE);
};

/**
 * Two case studies, between them showing both optional parts: the first has
 * an outbound link and no team size, the second the other way round.
 */
const sampleCaseStudies = async (base) => {
    const cases = await caseStudyPages(base);

    if (cases.length === 0) {
        throw new Error(`expected case study pages in ${base}/sitemap.xml, found none`);
    }

    return cases.slice(0, 2);
};

/** Every route type by default; `--routes` narrows it for a quick check. */
export const resolveRoutes = async (base) => {
    const override = argOf('routes', '');

    return override
        ? override.split(',').filter(Boolean)
        : ['/', '/blog', ...await sampleArticles(base), MISSING_ARTICLE, ...await sampleCaseStudies(base), '/privacy', '/contact'];
};
