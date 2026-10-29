/**
 * The shapes of the blog's data and copy. A post's facts (slug, dates, tags,
 * flags) are the same in every language; only its title and excerpt, and the
 * words the reading pages set around it, are per language (`BlogCopy`).
 */

/** Every post's slug. A language's `BlogCopy.posts` has to name each one. */
export type BlogSlug
    = | 'how-to-use-ai-to-build-apps-10x-speed'
      | 'nodejs-vs-python-framework-magic'
      | 'how-to-hire-your-first-developer'
      | 'why-startups-dont-need-product-owners'
      | 'how-to-build-a-startup-dev-team-for-real-world-success'
      | 'startup-burnout-trap'
      | '10-ai-workflows-every-developer-should-know-2025'
      | 'why-good-software-engineering-is-expensive';

/** A post's language-independent facts. */
export interface BlogPostData {
    id: string;
    date: string;
    /** The last meaningful content change, when there was one after `date`. */
    updated?: string;
    /** In English in every language: they are what related posts are matched by. Shown through `tagLabel`. */
    tags: string[];
    slug: string;
    published: boolean;
    /** Highlighted in the homepage's writing section. */
    featured?: boolean;
}

/** The words of one post in one language. */
export interface BlogPostWords {
    title: string;
    excerpt: string;
}

export interface BlogPost extends BlogPostData, BlogPostWords {}

/**
 * A post as the reading pages list it: its read time is counted from the
 * markdown at build time (`lib/content/blogPosts.ts`), never written by hand,
 * and set in the page's language.
 */
export interface ListedPost extends BlogPost {
    readTime: string;
}

interface CallToActionCopy {
    /** To the services page. */
    services: string;
    /** To the contact page. */
    contact: string;
}

/** The words of the blog's pages, share cards, feed and structured data in one language. */
export interface BlogCopy {
    /** Each post's title and excerpt. */
    posts: Record<BlogSlug, BlogPostWords>;
    /** Display labels of the English tags; a tag missing here shows as it is. */
    tags: Partial<Record<string, string>>;
    /** The index's `<title>` (before " | Stefan Knoch") and meta description. */
    indexMeta: {
        title: string;
        description: string;
    };
    /** The writing index's heading, shared by the page and its share card. */
    indexHeading: {
        kicker: string;
        title: string;
        /** The phrase the share card draws on the selection highlight. */
        highlight: string;
        lede: (years: number) => string;
    };
    /** The index share card's alt text, from the heading's title. */
    indexCardAlt: (title: string, name: string) => string;
    /** "Featured" on a highlighted post's row. */
    featured: string;
    /** A post's read time, e.g. "5 min read". */
    readTime: (minutes: number) => string;
    /** Before a revised post's update date. */
    updated: string;
    breadcrumbs: {
        label: string;
        home: string;
        writing: string;
    };
    pager: {
        label: string;
        newer: string;
        older: string;
        all: string;
    };
    related: string;
    author: {
        label: string;
        headshotAlt: string;
        kicker: string;
        /** The bio, around the start year and the native-language name of German. */
        bio: {
            beforeYear: string;
            afterYear: string;
            german: string;
            end: string;
        };
        actions: CallToActionCopy;
    };
    /** The 404 of an unknown slug: page metadata and panel. */
    notFound: {
        title: string;
        description: string;
        body: string;
        action: string;
    };
    /** The first part of a post card's meta line, "blog · 2025-08-14 · 5 min read". */
    cardKicker: string;
    feed: {
        title: (name: string) => string;
        description: string;
        /** RSS `<language>`. */
        language: string;
    };
    /** The Blog node's name. */
    schemaName: (name: string) => string;
}
