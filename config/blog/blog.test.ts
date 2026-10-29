/**
 * Tests for blog configuration module.
 * Tests data integrity and structure, not function behavior.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { INFORMAL_ADDRESS, dictionaryStrings, keyPaths } from '@/test/dictionary';
import { itemAt } from '@/test/itemAt';
import { type BlogCopy, blogCopy, blogPosts, blogPostsFor, tagLabel } from '@/config/blog';
import { blogDe } from './de';
import { blogEn } from './en';
import { rawBlogPosts } from './posts';

describe('Blog Configuration', () => {
    describe('Blog Posts Data Integrity', () => {
        it('should have unique post IDs', () => {
            // Act
            const ids = blogPosts.map(p => p.id);
            const uniqueIds = [...new Set(ids)];

            // Assert
            expect(uniqueIds).toHaveLength(ids.length);
        });

        it('should have unique slugs', () => {
            // Act
            const slugs = blogPosts.map(p => p.slug);
            const uniqueSlugs = [...new Set(slugs)];

            // Assert
            expect(uniqueSlugs).toHaveLength(slugs.length);
        });

        it('should have non-empty titles and excerpts', () => {
            // Assert
            blogPosts.forEach((post) => {
                expect(post.title).toBeTruthy();
                expect(post.excerpt).toBeTruthy();
                expect(post.title.length).toBeGreaterThan(0);
                expect(post.excerpt.length).toBeGreaterThan(0);
            });
        });

        it('should have valid post structure', () => {
            // Assert
            blogPosts.forEach((post) => {
                expect(post).toMatchObject({
                    id: expect.any(String),
                    title: expect.any(String),
                    excerpt: expect.any(String),
                    date: expect.any(String),
                    tags: expect.arrayContaining([expect.any(String)]),
                    slug: expect.any(String),
                });
            });
        });

        it('should be sorted by date (newest first)', () => {
            // Act - convert dates to Date objects for comparison
            const dates = blogPosts.map(post => new Date(post.date));

            // Assert - each subsequent post should be older than or equal to the previous
            for (let i = 1; i < dates.length; i++) {
                expect(itemAt(dates, i - 1).getTime()).toBeGreaterThanOrEqual(itemAt(dates, i).getTime());
            }
        });

        it('should have at least one blog post', () => {
            // Assert
            expect(blogPosts.length).toBeGreaterThan(0);
        });

        it('should have valid dates', () => {
            // Assert
            blogPosts.forEach((post) => {
                const date = new Date(post.date);
                expect(date.toString()).not.toBe('Invalid Date');
            });
        });

        it('should have non-empty tags', () => {
            // Assert
            blogPosts.forEach((post) => {
                expect(post.tags.length).toBeGreaterThan(0);
                post.tags.forEach((tag) => {
                    expect(tag.length).toBeGreaterThan(0);
                });
            });
        });
    });

    describe('blogPostsFor', () => {
        it('should merge each language\'s title and excerpt onto the shared facts', () => {
            // Act
            const english = blogPostsFor('en');

            // Assert
            expect(english).toBe(blogPosts);
            // Outside production every post is listed, drafts included.
            expect(english).toHaveLength(rawBlogPosts.length);
            rawBlogPosts.forEach((facts) => {
                const post = english.find(entry => entry.slug === facts.slug);

                expect(post).toEqual({ ...facts, ...blogCopy.en.posts[facts.slug] });
            });
        });

        it('should list the same posts in the same order in every language', () => {
            // Act
            const german = blogPostsFor('de');

            // Assert
            expect(german.map(post => post.slug)).toEqual(blogPosts.map(post => post.slug));
            expect(german.map(post => post.date)).toEqual(blogPosts.map(post => post.date));
            expect(german.map(post => post.tags)).toEqual(blogPosts.map(post => post.tags));
        });

        it('should keep the key order the posts were always serialized in', () => {
            expect(Object.keys(itemAt(blogPosts, 0)).slice(0, 4)).toEqual(['id', 'title', 'excerpt', 'date']);
        });
    });

    describe('tagLabel', () => {
        it('should show an English tag as it is on an English page', () => {
            expect(tagLabel('en', 'Tech Leadership')).toBe('Tech Leadership');
        });

        it('should fall back to the English tag where a language has no label for it', () => {
            expect(tagLabel('de', 'a-tag-nobody-labelled')).toBe('a-tag-nobody-labelled');
        });

        it('should label an English tag in German on a German page', () => {
            expect(tagLabel('de', 'Tech Leadership')).toBe('Technische Führung');
        });

        it('should only label tags the posts use', () => {
            const used = new Set(rawBlogPosts.flatMap(post => post.tags));

            Object.keys(blogDe.tags).forEach((tag) => {
                expect(used.has(tag), tag).toBe(true);
            });
        });
    });

    describe('German copy', () => {
        it('should be the German dictionary', () => {
            expect(blogCopy.de).toBe(blogDe);
        });

        it('should fill the same keys as the English, tag labels aside', () => {
            const withoutTags = (copy: BlogCopy) => keyPaths({ ...copy, tags: {} });

            expect(withoutTags(blogDe)).toEqual(withoutTags(blogEn));
        });

        it('should leave no string empty, quote no dollars and never say "du"', () => {
            dictionaryStrings(blogDe).forEach(({ path, text }) => {
                expect(text.trim(), path).not.toBe('');
                expect(text, path).not.toContain('$');
                expect(text, path).not.toMatch(INFORMAL_ADDRESS);
            });
        });

        it('should title each post as its German markdown\'s heading', () => {
            rawBlogPosts.forEach(({ slug }) => {
                const englishHeading = firstHeading(readFileSync(join(process.cwd(), 'content/blog', `${slug}.md`), 'utf8'));
                const germanHeading = firstHeading(readFileSync(join(process.cwd(), 'content/blog/de', `${slug}.md`), 'utf8'));

                // A post without an `#` heading in English has none in German either.
                expect(germanHeading === undefined, slug).toBe(englishHeading === undefined);
                if (germanHeading !== undefined) {
                    expect(blogDe.posts[slug].title, slug).toBe(germanHeading);
                }
            });
        });
    });
});

/** The text of a markdown file's first `#` heading, skipping code blocks. */
const firstHeading = (markdown: string) => {
    let inCode = false;

    for (const line of markdown.split('\n')) {
        if (line.startsWith('```')) {
            inCode = !inCode;
        }
        else if (!inCode && line.startsWith('# ')) {
            return line.slice(2).trim();
        }
    }

    return undefined;
};
