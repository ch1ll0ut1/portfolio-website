/**
 * Tests for choosing an article's related posts.
 */

import { describe, expect, it } from 'vitest';
import { relatedPosts } from './relatedPosts';

const post = (slug: string, date: string, tags: string[]) => ({ slug, date, tags });

const current = post('current', '2025-06-01', ['AI', 'Hiring', 'Startups']);
const posts = [
    current,
    post('newest-unrelated', '2026-01-01', ['Python']),
    post('one-shared', '2025-09-01', ['Hiring']),
    post('two-shared', '2025-01-01', ['ai', 'Startups']),
    post('old-unrelated', '2024-01-01', ['Burnout']),
];

const slugs = (list: { slug: string }[]) => list.map(entry => entry.slug);

describe('relatedPosts', () => {
    it('should rank by tags in common, ignoring case, and never pick the post itself', () => {
        expect(slugs(relatedPosts(current, posts, 2))).toEqual(['two-shared', 'one-shared']);
    });

    it('should fill up with the newest posts when too few share a tag', () => {
        expect(slugs(relatedPosts(current, posts, 4))).toEqual(['two-shared', 'one-shared', 'newest-unrelated', 'old-unrelated']);
    });

    it('should leave out the excluded slugs', () => {
        expect(slugs(relatedPosts(current, posts, 2, ['two-shared']))).toEqual(['one-shared', 'newest-unrelated']);
    });

    it('should return fewer than asked when there are not enough posts', () => {
        expect(relatedPosts(current, [current], 3)).toEqual([]);
    });
});
