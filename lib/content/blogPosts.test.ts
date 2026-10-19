/**
 * Tests for reading posts from `content/blog/`.
 */

import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { blogPosts } from '@/config/blog';
import { itemAt } from '@/test/itemAt';
import { getBlogPostData, listBlogPosts, readPostMarkdown } from './blogPosts';
import { readingTime } from './readingTime';

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

describe('listBlogPosts', () => {
    it('should list every configured post in order, each timed from its own markdown', () => {
        const listed = listBlogPosts();

        expect(listed.map(post => post.slug)).toEqual(blogPosts.map(post => post.slug));
        listed.forEach((post) => {
            expect(post.readTime, post.slug).toBe(readingTime(readPostMarkdown(post.slug) ?? ''));
        });
    });
});

describe('getBlogPostData', () => {
    it('should return the post with its content and its neighbours in the index', () => {
        const middle = itemAt(blogPosts, 1);
        const data = getBlogPostData(middle.slug);

        expect(data?.post.slug).toBe(middle.slug);
        expect(data?.post.content).toBe(readPostMarkdown(middle.slug));
        expect(data?.post.readTime).toBe(readingTime(data?.post.content ?? ''));
        // The index is newest first: the entry before is newer, the one after older.
        expect(data?.newer?.slug).toBe(itemAt(blogPosts, 0).slug);
        expect(data?.older?.slug).toBe(itemAt(blogPosts, 2).slug);
    });

    it('should leave the newest post without a newer neighbour', () => {
        const data = getBlogPostData(itemAt(blogPosts, 0).slug);

        expect(data?.newer).toBeUndefined();
        expect(data?.older?.slug).toBe(itemAt(blogPosts, 1).slug);
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
