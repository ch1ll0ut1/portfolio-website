/**
 * Reads blog posts from `content/blog/`: the markdown behind each entry in
 * `config/blog.ts`, and the neighbours the article links to.
 */

// Next's own copy of the `server-only` marker: the build fails if a client
// module imports this file. Next ships it, so it needs no dependency.
import 'next/dist/compiled/server-only';
import fs from 'fs';
import path from 'path';
import { cache } from 'react';
import { blogPosts } from '@/config/blog';

/**
 * Reads a post's markdown from the content directory, trimmed.
 * Returns `null` when no file exists for the slug.
 */
export function readPostMarkdown(slug: string): string | null {
    try {
        const contentPath = path.join(process.cwd(), 'content', 'blog', `${slug}.md`);

        if (!fs.existsSync(contentPath)) {
            return null;
        }

        const content = fs.readFileSync(contentPath, 'utf8');

        return content.trim();
    }
    catch (error) {
        throw new Error(`Error reading markdown file ${slug}: ${String(error)}`);
    }
}

/**
 * Gets blog post data and content from configuration and markdown files.
 * Returns the post metadata, its markdown, and its neighbours in the index,
 * or `null` for a slug with no published entry or no file.
 *
 * Cached per render, so `generateMetadata` and the page share one file read.
 */
export const getBlogPostData = cache((slug: string) => {
    const index = blogPosts.findIndex(p => p.slug === slug);
    const postMetadata = blogPosts[index];
    if (postMetadata === undefined) {
        return null;
    }
    const markdownContent = readPostMarkdown(slug);
    if (!markdownContent) return null;

    // The index is newest first, so the entry before this one is the newer post.
    return {
        post: { ...postMetadata, content: markdownContent },
        newer: blogPosts[index - 1],
        older: blogPosts[index + 1],
    };
});
