import { MetadataRoute } from 'next';
import { blogPosts } from '@/config/blog';
import { absoluteUrl, siteConfig } from '@/config/site';

/**
 * Every indexable page with a real last-modified date: posts carry their own,
 * and the static pages share one fixed date so a deploy alone does not mark
 * them changed. The blog index changes when its newest post does.
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const staticUpdated = new Date(siteConfig.staticPagesUpdated);
    const newestPost = blogPosts.at(0);
    const blogUpdated = newestPost ? new Date(newestPost.date) : staticUpdated;

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: absoluteUrl('/'),
            lastModified: staticUpdated,
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: absoluteUrl('/blog'),
            lastModified: blogUpdated,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: absoluteUrl('/privacy'),
            lastModified: staticUpdated,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ];

    const blogPages: MetadataRoute.Sitemap = blogPosts.map(post => ({
        url: absoluteUrl(`/blog/${post.slug}`),
        lastModified: new Date(post.date),
        changeFrequency: 'yearly',
        priority: 0.6,
    }));

    return [...staticPages, ...blogPages];
}
