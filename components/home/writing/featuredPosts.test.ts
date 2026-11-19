/**
 * Tests for the writing section's featured post selection.
 * Membership must come from the blog config, never from a local list.
 */

import { describe, it, expect } from 'vitest';
import { blogPosts, blogPostsFor } from '@/config/blog';
import { allArticlesFor, featuredPostsFor } from './featuredPosts';

const allArticles = allArticlesFor('en');
const featuredPosts = featuredPostsFor('en');

describe('featuredPosts', () => {
    it('should contain exactly the posts flagged featured in the blog config', () => {
        // Act
        const expected = blogPosts.filter(post => post.featured === true).map(post => post.slug);

        // Assert
        expect(featuredPosts.map(post => post.slug)).toEqual(expected);
        expect(featuredPosts.length).toBeGreaterThan(0);
    });

    it('should take its titles from the blog config', () => {
        // Assert
        featuredPosts.forEach((post) => {
            const source = blogPosts.find(candidate => candidate.slug === post.slug);

            expect(post.title).toBe(source?.title);
        });
    });

    it('should only feature published posts', () => {
        // Assert
        featuredPosts.forEach((post) => {
            const source = blogPosts.find(candidate => candidate.slug === post.slug);

            expect(source?.published).toBe(true);
        });
    });

    it('should link each post to its internal blog route', () => {
        // Assert
        featuredPosts.forEach((post) => {
            expect(post.href).toBe(`/blog/${post.slug}`);
        });
    });

    it('should give every post a kind label and a description', () => {
        // Assert
        featuredPosts.forEach((post) => {
            expect(post.kind).toBeTruthy();
            expect(post.description).toBeTruthy();
        });
    });

    it('should point the all-articles row at the blog index', () => {
        // Assert
        expect(allArticles.href).toBe('/blog');
    });

    it('should title German posts as the German blog does, linked under /de', () => {
        // Act
        const germanPosts = featuredPostsFor('de');

        // Assert
        expect(germanPosts.map(post => post.slug)).toEqual(featuredPosts.map(post => post.slug));
        germanPosts.forEach((post) => {
            const source = blogPostsFor('de').find(candidate => candidate.slug === post.slug);

            expect(post.title).toBe(source?.title);
            expect(post.href).toBe(`/de/blog/${post.slug}`);
        });
    });
});
