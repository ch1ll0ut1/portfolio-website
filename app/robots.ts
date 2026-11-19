import { MetadataRoute } from 'next';
import { absoluteUrl } from '@/config/site';

/** Everything is public; the sitemap URL shares the canonical origin with the rest of the metadata. */
export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
        },
        sitemap: absoluteUrl('/sitemap.xml'),
    };
}
