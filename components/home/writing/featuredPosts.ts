/**
 * The posts the writing section puts on the homepage.
 *
 * Which posts appear is decided by the `featured` flag in `config/blog.ts`, so
 * the homepage cannot drift from the blog: renaming, unpublishing or
 * re-slugging a post there changes this list too. Only the presentation copy
 * the post metadata does not carry — a kind label and a shorter, sharper
 * description than the SEO excerpt — lives in the writing section's
 * dictionary, keyed by slug.
 */

import { blogPosts } from '@/config/blog';
import { writingCopy } from '@/config/home/writing';
import type { Locale } from '@/lib/i18n/locale';
import { localizedPath } from '@/lib/i18n/paths';

export interface FeaturedPost {
    slug: string;
    title: string;
    kind: string;
    description: string;
    href: string;
}

export const featuredPostsFor = (locale: Locale): FeaturedPost[] => {
    const { highlights, defaultKind } = writingCopy[locale];

    return blogPosts
        .filter(post => post.featured === true && post.published)
        .map((post) => {
            const highlight = highlights[post.slug];

            return {
                slug: post.slug,
                title: post.title,
                kind: highlight?.kind ?? defaultKind,
                description: highlight?.description ?? post.excerpt,
                href: localizedPath(locale, `/blog/${post.slug}`),
            };
        });
};

/** The row under the featured posts. */
export const allArticlesFor = (locale: Locale) => ({
    label: writingCopy[locale].allArticles,
    href: localizedPath(locale, '/blog'),
});
