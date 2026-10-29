/**
 * The page metadata of the blog's routes in either language: the index, a
 * post, and a post's 404. The route files call these with their locale.
 */

import type { Metadata } from 'next';
import { blogCopy, lastModified } from '@/config/blog';
import { absoluteUrl, siteConfig } from '@/config/site';
import { baseOpenGraph } from '@/lib/baseOpenGraph';
import { getBlogPostData } from '@/lib/content/blogPosts';
import { bangkokDateTime } from '@/lib/date';
import { feedAlternateTypes } from '@/lib/feed';
import { type Locale, ogLocale } from '@/lib/i18n/locale';
import { localizedPath } from '@/lib/i18n/paths';
import { postCardImage } from '@/lib/og/postCard';
import { twitterCard } from '@/lib/twitterCard';

/** The writing index's metadata in `locale`. */
export const blogIndexMetadata = (locale: Locale): Metadata => {
    const { title, description } = blogCopy[locale].indexMeta;
    const path = localizedPath(locale, '/blog');

    return {
        // Absolute, so the layout's "| Stefan Knoch" template is not stacked onto a second separator.
        title: { absolute: `${title} | ${siteConfig.name}` },
        description,
        openGraph: {
            ...baseOpenGraph,
            locale: ogLocale[locale],
            title,
            description,
            url: absoluteUrl(path),
            type: 'website',
        },
        twitter: twitterCard(title, description),
        alternates: {
            canonical: path,
            types: feedAlternateTypes,
        },
    };
};

/**
 * A post's 404 metadata in `locale`. `robots` is null, not `{ index: false }`:
 * Next already answers every 404 with its own `<meta name="robots"
 * content="noindex">`, so a value here would only add a second tag. Null
 * still clears the layout's "index, follow".
 */
export const postNotFoundMetadata = (locale: Locale): Metadata => ({
    title: blogCopy[locale].notFound.title,
    description: blogCopy[locale].notFound.description,
    robots: null,
});

/** The metadata of the post at `slug` in `locale`, or its 404's for a slug with no post. */
export const blogPostMetadata = (slug: string, locale: Locale): Metadata => {
    const data = getBlogPostData(slug, locale);

    // Guards the property reads below. Matches the not-found page, robots
    // included (this result does reach the page).
    if (!data) {
        return postNotFoundMetadata(locale);
    }

    const { post } = data;
    const path = localizedPath(locale, `/blog/${slug}`);
    const card = postCardImage(post, locale);

    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            ...baseOpenGraph,
            locale: ogLocale[locale],
            title: post.title,
            description: post.excerpt,
            url: absoluteUrl(path),
            type: 'article',
            publishedTime: bangkokDateTime(post.date),
            modifiedTime: bangkokDateTime(lastModified(post)),
            // The author's profile page: Open Graph wants a URL here, not a name.
            authors: [absoluteUrl(localizedPath(locale, '/'))],
            tags: post.tags,
            images: [card],
        },
        twitter: { ...twitterCard(post.title, post.excerpt), images: [card] },
        alternates: {
            canonical: path,
            types: feedAlternateTypes,
        },
    };
};
