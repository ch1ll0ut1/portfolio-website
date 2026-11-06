import { MetadataRoute } from 'next';
import { blogPosts, lastModified } from '@/config/blog';
import { caseStudiesFor, caseStudyPath } from '@/config/caseStudies';
import { absoluteUrl, siteConfig } from '@/config/site';
import { localizedPath, pageAlternates } from '@/lib/i18n/paths';
import { SERVICES_PATH } from '@/lib/serviceStructuredData';

/** One page of the site, by its English path, and the German twin it has. */
interface Page {
    enPath: string;
    lastModified: Date;
    /** Set while the page has no German twin yet: it is listed alone, without a language map. */
    englishOnly?: true;
}

/**
 * Every indexable page with a real last-modified date: posts carry their own,
 * and the static pages share one fixed date so a deploy alone does not mark
 * them changed. The blog index changes when any of its posts does. The case
 * study pages count as static pages.
 *
 * Each page is listed in both languages, each entry naming both as its
 * translations with English as `x-default`, the same map the pages' own
 * hreflang links carry (`pageAlternates`). A German page is dated like its
 * English one: the facts behind both are the same.
 *
 * Only published posts are listed, whatever the environment: the dev server
 * shows drafts, but the sitemap is what tooling reads as "the posts this site
 * serves" (the visual and accessibility checks sample it).
 *
 * No `changeFrequency` or `priority`: Google ignores both, and only an honest
 * `lastModified` moves anything.
 */
export default function sitemap(): MetadataRoute.Sitemap {
    return pages().flatMap(page => (page.englishOnly ? [englishEntry(page)] : pairEntries(page)));
}

/** The route table: every page the sitemap lists, by its English path. */
function pages(): Page[] {
    const posts = blogPosts.filter(post => post.published);
    const staticUpdated = new Date(siteConfig.staticPagesUpdated);
    const newestChange = posts.map(lastModified).sort().at(-1);
    const blogUpdated = newestChange ? new Date(newestChange) : staticUpdated;

    return [
        // `/de` arrives with the German homepage; drop `englishOnly` then.
        { enPath: '/', lastModified: staticUpdated, englishOnly: true },
        { enPath: '/blog', lastModified: blogUpdated },
        { enPath: SERVICES_PATH, lastModified: staticUpdated },
        { enPath: '/contact', lastModified: staticUpdated },
        { enPath: '/privacy', lastModified: staticUpdated },
        ...posts.map(post => ({ enPath: `/blog/${post.slug}`, lastModified: new Date(lastModified(post)) })),
        ...caseStudiesFor('en').map(study => ({ enPath: caseStudyPath(study), lastModified: staticUpdated })),
    ];
}

function englishEntry(page: Page): MetadataRoute.Sitemap[number] {
    return { url: absoluteUrl(page.enPath), lastModified: page.lastModified };
}

/** The English page and its German twin, each listing both as its translations. */
function pairEntries(page: Page): MetadataRoute.Sitemap {
    const languages = Object.fromEntries(Object.entries(pageAlternates(page.enPath)).map(([language, path]) => [language, absoluteUrl(path)]));

    return [page.enPath, localizedPath('de', page.enPath)].map(path => ({
        url: absoluteUrl(path),
        lastModified: page.lastModified,
        alternates: { languages },
    }));
}
