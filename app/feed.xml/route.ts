import { blogPosts } from '@/config/blog';
import { rssFeed } from '@/lib/feed';

/** Built once at build time, like the posts it lists. */
export const dynamic = 'force-static';

/**
 * The blog's RSS feed. Published posts only, whatever the environment: the
 * dev server shows drafts, but a feed reader must never see one.
 */
export function GET() {
    return new Response(rssFeed(blogPosts.filter(post => post.published)), {
        headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
    });
}
