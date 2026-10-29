/**
 * The blog's RSS 2.0 feeds (`/feed.xml`, and `/de/feed.xml` once the German
 * posts exist) and the `<link rel="alternate">` that announces the English one.
 */

import { type BlogPost, blogCopy, lastModified, tagLabel } from '@/config/blog';
import { absoluteUrl, siteConfig } from '@/config/site';
import { bangkokDateTime } from './date';
import type { Locale } from './i18n/locale';
import { localizedPath } from './i18n/paths';

const FEED_PATH = '/feed.xml';

/** The feed's title in `locale`, e.g. "Stefan Knoch — Writing". */
const feedTitle = (locale: Locale) => blogCopy[locale].feed.title(siteConfig.name);

/**
 * The feed as `alternates.types` metadata. Next replaces a parent's
 * `alternates` with a page's own, so every page that sets a canonical spreads
 * this in too, or the link is lost there.
 */
export const feedAlternateTypes = {
    'application/rss+xml': [{ url: FEED_PATH, title: feedTitle('en') }],
};

/**
 * The RSS document for `posts` in `locale` (newest first, published only: the
 * caller filters). Links are absolute on the canonical origin and dates are
 * RFC 822, as RSS 2.0 requires.
 */
export const rssFeed = (posts: BlogPost[], locale: Locale) => {
    const copy = blogCopy[locale].feed;
    const newest = posts.map(lastModified).sort().at(-1);
    const items = posts.map(post => rssItem(post, locale)).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${escapeXml(feedTitle(locale))}</title>
<link>${absoluteUrl(localizedPath(locale, '/blog'))}</link>
<description>${escapeXml(copy.description)}</description>
<language>${copy.language}</language>
<atom:link href="${absoluteUrl(localizedPath(locale, FEED_PATH))}" rel="self" type="application/rss+xml"/>
${newest ? `<lastBuildDate>${rfc822(newest)}</lastBuildDate>\n` : ''}${items}</channel>
</rss>
`;
};

/** A calendar date as an RFC 822 date-time, at midnight in Bangkok like the rest of the site's dates. */
const rfc822 = (date: string) => new Date(bangkokDateTime(date)).toUTCString();

function rssItem(post: BlogPost, locale: Locale) {
    const url = absoluteUrl(localizedPath(locale, `/blog/${post.slug}`));
    const categories = post.tags.map(tag => `<category>${escapeXml(tagLabel(locale, tag))}</category>\n`).join('');

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
