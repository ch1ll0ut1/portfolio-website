/**
 * Tests for reading posts from `content/blog/`.
 */

import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { blogPosts } from '@/config/blog';
import { itemAt } from '@/test/itemAt';
import { getBlogPostData, readPostMarkdown } from './blogPosts';

describe('readPostMarkdown', () => {
    it('should return a post\'s markdown with surrounding whitespace trimmed', () => {
        const slug = itemAt(blogPosts, 0).slug;
        const raw = fs.readFileSync(path.join(process.cwd(), 'content', 'blog', `${slug}.md`), 'utf8');

        expect(readPostMarkdown(slug)).toBe(raw.trim());
    });

    it('should return null for a slug with no file', () => {
        expect(readPostMarkdown('this-post-does-not-exist')).toBeNull();
    });
});

describe('getBlogPostData', () => {
    it('should return the post with its content and its neighbours in the index', () => {
        const middle = itemAt(blogPosts, 1);
        const data = getBlogPostData(middle.slug);

        expect(data?.post.slug).toBe(middle.slug);
        expect(data?.post.content).toBe(readPostMarkdown(middle.slug));
        // The index is newest first: the entry before is newer, the one after older.
        expect(data?.newer).toBe(itemAt(blogPosts, 0));
        expect(data?.older).toBe(itemAt(blogPosts, 2));
    });

    it('should leave the newest post without a newer neighbour', () => {
        const data = getBlogPostData(itemAt(blogPosts, 0).slug);

        expect(data?.newer).toBeUndefined();
        expect(data?.older).toBe(itemAt(blogPosts, 1));
    });

    it('should return null for a slug the config does not list', () => {
        expect(getBlogPostData('this-post-does-not-exist')).toBeNull();
    });

    it('should have a markdown file for every post in the config', () => {
        blogPosts.forEach((post) => {
            expect(getBlogPostData(post.slug), post.slug).not.toBeNull();
        });
    });
});
