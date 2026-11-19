import { blogPostsFor } from '@/config/blog';
import { rssFeed } from '@/lib/feed';

/** Built once at build time, like the posts it lists. */
export const dynamic = 'force-static';

/**
 * The German blog's RSS feed, the twin of `/feed.xml`. Published posts only,
 * whatever the environment, as there.
 */
export function GET() {
    return new Response(rssFeed(blogPostsFor('de').filter(post => post.published), 'de'), {
        headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
    });
}
