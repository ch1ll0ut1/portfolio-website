/**
 * The posts the writing section puts on the homepage.
 *
 * Which posts appear is decided by the `featured` flag in `config/blog.ts`, so
 * the homepage cannot drift from the blog: renaming, unpublishing or
 * re-slugging a post there changes this list too. Only the presentation copy
 * the post metadata does not carry — a kind label and a shorter, sharper
 * description than the SEO excerpt — lives here, keyed by slug.
 */

import { blogPosts } from '@/config/blog';

export interface FeaturedPost {
    slug: string;
    title: string;
    /** Kind label above the title, e.g. "Guide". */
    kind: string;
    description: string;
    /** Internal blog route. */
    href: string;
}

interface Highlight {
    kind: string;
    description: string;
}

const highlights: Record<string, Highlight | undefined> = {
    'why-good-software-engineering-is-expensive': {
        kind: 'Essay',
        description: 'AI gets you the first 80% in an hour. The last 20% (edge cases, data consistency, security) is where software gets expensive, and why cheap code gets built twice.',
    },
    'how-to-hire-your-first-developer': {
        kind: 'Guide',
        description: 'For non-technical founders: test real skills instead of resumes, start with a paid trial project, and bring in a tech lead to help you judge.',
    },
};

const DEFAULT_KIND = 'Article';

export const featuredPosts: FeaturedPost[] = blogPosts
    .filter(post => post.featured === true && post.published)
    .map((post) => {
        const highlight = highlights[post.slug];

        return {
            slug: post.slug,
            title: post.title,
            kind: highlight?.kind ?? DEFAULT_KIND,
            description: highlight?.description ?? post.excerpt,
            href: `/blog/${post.slug}`,
        };
    });

/** The row under the featured posts. */
export const allArticles = {
    label: 'All articles on the blog',
    href: '/blog',
};
