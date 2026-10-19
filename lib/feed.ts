/**
 * The blog's RSS 2.0 feed (`/feed.xml`) and the `<link rel="alternate">` that
 * announces it.
 */

import { type BlogPost, lastModified } from '@/config/blog';
import { absoluteUrl, siteConfig } from '@/config/site';
import { bangkokDateTime } from './date';

const FEED_PATH = '/feed.xml';
const FEED_TITLE = `${siteConfig.name} — Writing`;
const FEED_DESCRIPTION = 'Writing on software engineering, technical leadership, hiring, and building software with AI.';

/**
 * The feed as `alternates.types` metadata. Next replaces a parent's
 * `alternates` with a page's own, so every page that sets a canonical spreads
 * this in too, or the link is lost there.
 */
export const feedAlternateTypes = {
    'application/rss+xml': [{ url: FEED_PATH, title: FEED_TITLE }],
};

/**
 * The RSS document for `posts` (newest first, published only: the caller
 * filters). Links are absolute on the canonical origin and dates are RFC 822,
 * as RSS 2.0 requires.
 */
export const rssFeed = (posts: BlogPost[]) => {
    const newest = posts.map(lastModified).sort().at(-1);
    const items = posts.map(rssItem).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${escapeXml(FEED_TITLE)}</title>
<link>${absoluteUrl('/blog')}</link>
<description>${escapeXml(FEED_DESCRIPTION)}</description>
<language>en-us</language>
<atom:link href="${absoluteUrl(FEED_PATH)}" rel="self" type="application/rss+xml"/>
${newest ? `<lastBuildDate>${rfc822(newest)}</lastBuildDate>\n` : ''}${items}</channel>
</rss>
`;
};

/** A calendar date as an RFC 822 date-time, at midnight in Bangkok like the rest of the site's dates. */
const rfc822 = (date: string) => new Date(bangkokDateTime(date)).toUTCString();

function rssItem(post: BlogPost) {
    const url = absoluteUrl(`/blog/${post.slug}`);
    const categories = post.tags.map(tag => `<category>${escapeXml(tag)}</category>\n`).join('');

    return `<item>
<title>${escapeXml(post.title)}</title>
<link>${url}</link>
<description>${escapeXml(post.excerpt)}</description>
<guid isPermaLink="true">${url}</guid>
<pubDate>${rfc822(post.date)}</pubDate>
${categories}</item>
`;
}

function escapeXml(text: string) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
