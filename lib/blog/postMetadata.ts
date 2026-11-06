/**
 * The page metadata of the blog's routes in either language: the index, a
 * post, and a post's 404. The route files call these with their locale.
 */

import type { Metadata } from 'next';
import { notFoundMetadata } from '@/components/errors/notFoundMetadata';
import { blogCopy, lastModified, tagLabel } from '@/config/blog';
import { absoluteUrl, siteConfig } from '@/config/site';
import { getBlogPostData } from '@/lib/content/blogPosts';
import { bangkokDateTime } from '@/lib/date';
import type { Locale } from '@/lib/i18n/locale';
import { pageMetadata } from '@/lib/i18n/metadata';
import { localizedPath } from '@/lib/i18n/paths';
import { postCardImage } from '@/lib/og/postCard';

/** The writing index's metadata in `locale`, with its twin and its language's feed. */
export const blogIndexMetadata = (locale: Locale): Metadata => {
    const { title, description } = blogCopy[locale].indexMeta;

    return pageMetadata({
        locale,
        enPath: '/blog',
        // Absolute, so the layout's "| Stefan Knoch" template is not stacked onto a second separator.
        title: { absolute: `${title} | ${siteConfig.name}` },
        description,
        shareTitle: title,
        feed: true,
    });
};

/**
 * The metadata of the post at `slug` in `locale`, with its twin and its
 * language's feed, or its 404's for a slug with no post. Every post is
 * translated, so every post has a twin.
 */
export const blogPostMetadata = (slug: string, locale: Locale): Metadata => {
    const data = getBlogPostData(slug, locale);

    // Guards the property reads below. Matches the not-found page, robots
    // included (this result does reach the page).
    if (!data) {
        return notFoundMetadata(locale, 'post');
    }

    const { post } = data;

    return pageMetadata({
        locale,
        enPath: `/blog/${slug}`,
        title: post.title,
        description: post.excerpt,
        shareTitle: post.title,
        article: {
            publishedTime: bangkokDateTime(post.date),
            modifiedTime: bangkokDateTime(lastModified(post)),
            // The author's profile page: Open Graph wants a URL here, not a name.
            authors: [absoluteUrl(localizedPath(locale, '/'))],
            tags: post.tags.map(tag => tagLabel(locale, tag)),
        },
        image: postCardImage(post, locale),
        feed: true,
    });
};
