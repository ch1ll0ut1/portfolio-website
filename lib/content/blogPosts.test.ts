/**
 * Tests for reading posts from `content/blog/` and `content/blog/de/`.
 */

import fs from 'fs';
import path from 'path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { blogCopy, blogPosts } from '@/config/blog';
import { itemAt } from '@/test/itemAt';
import { getBlogPostData, listBlogPosts, readPostMarkdown } from './blogPosts';
import { readingTime } from './readingTime';

const readTimeLabel = (slug: string) => blogCopy.en.readTime(readingTime(readPostMarkdown(slug, 'en') ?? ''));

describe('readPostMarkdown', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should return a post\'s markdown with surrounding whitespace trimmed', () => {
        const slug = itemAt(blogPosts, 0).slug;
        const raw = fs.readFileSync(path.join(process.cwd(), 'content', 'blog', `${slug}.md`), 'utf8');

        expect(readPostMarkdown(slug, 'en')).toBe(raw.trim());
    });

    it('should return null for a slug with no file', () => {
        expect(readPostMarkdown('this-post-does-not-exist', 'en')).toBeNull();
    });

    it('should read a German post from its own folder, never the English file', () => {
        // Arrange
        const exists = vi.spyOn(fs, 'existsSync').mockReturnValue(false);

        // Act
        const markdown = readPostMarkdown('a-post', 'de');

        // Assert
        expect(markdown).toBeNull();
        expect(exists).toHaveBeenCalledExactlyOnceWith(path.join(process.cwd(), 'content', 'blog', 'de', 'a-post.md'));
    });

    it('should read an English post from the root of the blog folder', () => {
        // Arrange
        const exists = vi.spyOn(fs, 'existsSync').mockReturnValue(false);

        // Act
        readPostMarkdown('a-post', 'en');

        // Assert
        expect(exists).toHaveBeenCalledExactlyOnceWith(path.join(process.cwd(), 'content', 'blog', 'a-post.md'));
    });
});

describe('listBlogPosts', () => {
    it('should list every configured post in order, each timed from its own markdown', () => {
        const listed = listBlogPosts('en');

        expect(listed.map(post => post.slug)).toEqual(blogPosts.map(post => post.slug));
        listed.forEach((post) => {
            expect(post.readTime, post.slug).toBe(readTimeLabel(post.slug));
        });
    });
});

describe('getBlogPostData', () => {
    it('should return the post with its content and its neighbours in the index', () => {
        const middle = itemAt(blogPosts, 1);
        const data = getBlogPostData(middle.slug, 'en');

        expect(data?.post.slug).toBe(middle.slug);
        expect(data?.post.content).toBe(readPostMarkdown(middle.slug, 'en'));
        expect(data?.post.readTime).toBe(readTimeLabel(middle.slug));
        // The index is newest first: the entry before is newer, the one after older.
        expect(data?.newer?.slug).toBe(itemAt(blogPosts, 0).slug);
        expect(data?.older?.slug).toBe(itemAt(blogPosts, 2).slug);
    });

    it('should suggest related posts other than the post and its neighbours', () => {
        const middle = itemAt(blogPosts, 1);
        const data = getBlogPostData(middle.slug, 'en');
        const shown = [middle.slug, data?.newer?.slug, data?.older?.slug];

        expect(data?.related.length).toBeGreaterThan(0);
        data?.related.forEach((post) => {
            expect(shown).not.toContain(post.slug);
            expect(post.readTime).toMatch(/^\d+ min read$/);
        });
    });

    it('should leave the newest post without a newer neighbour', () => {
        const data = getBlogPostData(itemAt(blogPosts, 0).slug, 'en');

        expect(data?.newer).toBeUndefined();
        expect(data?.older?.slug).toBe(itemAt(blogPosts, 1).slug);
    });

    it('should return null for a slug the config does not list', () => {
        expect(getBlogPostData('this-post-does-not-exist', 'en')).toBeNull();
    });

    it('should have a markdown file for every post in the config', () => {
        blogPosts.forEach((post) => {
            expect(getBlogPostData(post.slug, 'en'), post.slug).not.toBeNull();
        });
    });
});
