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
            // Assert
            expect(blogPosts[0].date).toBe('2024-01-15'); // scalable-react-applications
            expect(blogPosts[1].date).toBe('2024-01-08'); // cto-guide-ai-implementation
            expect(blogPosts[2].date).toBe('2024-01-01'); // developer-to-tech-lead
        });

        it('should have exactly 3 blog posts', () => {
            // Assert
            expect(blogPosts).toHaveLength(3);
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
