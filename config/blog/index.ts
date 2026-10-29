/**
 * The blog in each language: the posts with their words merged in, the copy
 * of the reading pages, and the tag labels.
 */

import { sortByDate } from '@/lib/date';
import type { Locale } from '@/lib/i18n/locale';
import { blogEn } from './en';
import { rawBlogPosts } from './posts';
import type { BlogCopy, BlogPost } from './types';

export type { BlogCopy, BlogPost, ListedPost } from './types';

export const blogCopy: Record<Locale, BlogCopy> = {
    en: blogEn,
    de: blogEn, // i18n: German copy pending
};

/** In production only published posts are shown; in development, drafts too. */
const visiblePosts = process.env.NODE_ENV === 'production'
    ? rawBlogPosts.filter(post => post.published)
    : rawBlogPosts;

const postsIn = (locale: Locale): BlogPost[] => sortByDate(visiblePosts.map(({ id, ...facts }) => ({
    id,
    ...blogCopy[locale].posts[facts.slug],
    ...facts,
})));

const postsByLocale: Record<Locale, BlogPost[]> = {
    en: postsIn('en'),
    de: postsIn('de'),
};

/** The posts in `locale`, newest first. */
export const blogPostsFor = (locale: Locale) => postsByLocale[locale];

/**
 * The English posts. Their facts — slugs, dates, tags, flags — are every
 * language's, so the sitemap, the feed and the homepage read them from here.
 */
export const blogPosts = postsByLocale.en;

/** When a post last changed: its update date, or its publish date if it has none. */
export const lastModified = (post: BlogPost) => post.updated ?? post.date;

/** The label of an (English) tag in `locale`; the tag itself where there is none. */
export const tagLabel = (locale: Locale, tag: string) => blogCopy[locale].tags[tag] ?? tag;
