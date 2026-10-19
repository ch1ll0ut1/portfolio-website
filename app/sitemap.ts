import { MetadataRoute } from 'next';
import { blogPosts, lastModified } from '@/config/blog';
import { absoluteUrl, siteConfig } from '@/config/site';

/**
 * Every indexable page with a real last-modified date: posts carry their own,
 * and the static pages share one fixed date so a deploy alone does not mark
 * them changed. The blog index changes when any of its posts does.
 *
 * Only published posts are listed, whatever the environment: the dev server
 * shows drafts, but the sitemap is what tooling reads as "the posts this site
 * serves" (the visual and accessibility checks sample it).
 *
 * No `changeFrequency` or `priority`: Google ignores both, and only an honest
 * `lastModified` moves anything.
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const posts = blogPosts.filter(post => post.published);
    const staticUpdated = new Date(siteConfig.staticPagesUpdated);
    const newestChange = posts.map(lastModified).sort().at(-1);
    const blogUpdated = newestChange ? new Date(newestChange) : staticUpdated;

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: absoluteUrl('/'),
            lastModified: staticUpdated,
        },
        {
            url: absoluteUrl('/blog'),
            lastModified: blogUpdated,
        },
        {
            url: absoluteUrl('/contact'),
            lastModified: staticUpdated,
        },
        {
            url: absoluteUrl('/privacy'),
            lastModified: staticUpdated,
        },
    ];

    const blogPages: MetadataRoute.Sitemap = posts.map(post => ({
        url: absoluteUrl(`/blog/${post.slug}`),
        lastModified: new Date(lastModified(post)),
    }));

    return [...staticPages, ...blogPages];
}
