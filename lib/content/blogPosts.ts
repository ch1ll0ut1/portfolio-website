/**
 * Reads blog posts from `content/blog/` (English) and `content/blog/de/`
 * (German): the markdown behind each entry in `config/blog/`, the read time
 * counted from it, and the neighbours the article links to.
 */

// Next's own copy of the `server-only` marker: the build fails if a client
// module imports this file. Next ships it, so it needs no dependency.
import 'next/dist/compiled/server-only';
import fs from 'fs';
import path from 'path';
import { cache } from 'react';
import { type ListedPost, blogCopy, blogPostsFor } from '@/config/blog';
import type { Locale } from '@/lib/i18n/locale';
import { relatedPosts } from '@/lib/relatedPosts';
import { readingTime } from './readingTime';

/** How many related posts an article suggests, besides its neighbours. */
const RELATED_COUNT = 3;

/** Where a language's markdown lives: English at the root, every other language in its own folder. */
const CONTENT_DIR: Record<Locale, string[]> = {
    en: ['content', 'blog'],
    de: ['content', 'blog', 'de'],
};

/**
 * Reads a post's markdown in `locale` from the content directory, trimmed.
 * Returns `null` when no file exists for the slug in that language.
 */
export function readPostMarkdown(slug: string, locale: Locale): string | null {
    try {
        const contentPath = path.join(process.cwd(), ...CONTENT_DIR[locale], `${slug}.md`);

        if (!fs.existsSync(contentPath)) {
            return null;
        }

        const content = fs.readFileSync(contentPath, 'utf8');

        return content.trim();
    }
    catch (error) {
        throw new Error(`Error reading markdown file ${slug} (${locale}): ${String(error)}`);
    }
}

/**
 * Every post in the index in `locale`, newest first, each with the read time
 * of its markdown in that language. Cached per render and language, so a page
 * listing posts reads each file once.
 */
export const listBlogPosts = cache((locale: Locale): ListedPost[] => blogPostsFor(locale).map(post => ({
    ...post,
    readTime: blogCopy[locale].readTime(readingTime(readPostMarkdown(post.slug, locale) ?? '')),
})));

/**
 * Gets blog post data and content in `locale` from configuration and markdown
 * files. Returns the post metadata, its markdown, its neighbours in the index
 * and the posts closest to it by tags (neighbours left out), or `null` for a
 * slug with no published entry or no file in that language.
 *
 * Cached per render, so `generateMetadata` and the page share one file read.
 */
export const getBlogPostData = cache((slug: string, locale: Locale) => {
    const posts = listBlogPosts(locale);
    const index = posts.findIndex(p => p.slug === slug);
    const postMetadata = posts[index];
    if (postMetadata === undefined) {
        return null;
    }
    const markdownContent = readPostMarkdown(slug, locale);
    if (!markdownContent) return null;

    // The index is newest first, so the entry before this one is the newer post.
    const newer = posts[index - 1];
    const older = posts[index + 1];
    const neighbours = [newer, older].flatMap(neighbour => (neighbour ? [neighbour.slug] : []));

    return {
        post: { ...postMetadata, content: markdownContent },
        newer,
        older,
        related: relatedPosts(postMetadata, posts, RELATED_COUNT, neighbours),
    };
});
