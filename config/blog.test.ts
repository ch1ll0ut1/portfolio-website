/**
 * Tests for blog configuration module.
 * Tests data integrity and structure, not function behavior.
 */

import { describe, it, expect } from 'vitest';
import { blogPosts, type BlogPost } from './blog';

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
                    readTime: expect.any(String),
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
                expect(dates[i - 1].getTime()).toBeGreaterThanOrEqual(dates[i].getTime());
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
});
