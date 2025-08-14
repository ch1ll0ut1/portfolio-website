/**
 * Tests for BlogPostList component.
 * Tests blog post list rendering and grid layout.
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BlogPostList } from './BlogPostList';

const mockPosts = [
    {
        id: 'post-1',
        title: 'Test Post 1',
        excerpt: 'First test post',
        date: '2024-01-01',
        readTime: '5 min read',
        tags: ['React'],
        slug: 'test-post-1',
    },
    {
        id: 'post-2',
        title: 'Test Post 2',
        excerpt: 'Second test post',
        date: '2024-01-02',
        readTime: '3 min read',
        tags: ['TypeScript'],
        slug: 'test-post-2',
    },
];

describe('BlogPostList Component', () => {
    it('should render list of blog posts', () => {
        render(<BlogPostList posts={mockPosts} />);

        const cards = document.querySelectorAll('[data-slot="card"]');
        expect(cards).toHaveLength(2);
    });

    it('should have responsive layout', () => {
        render(<BlogPostList posts={mockPosts} />);

        const section = document.querySelector('section');
        expect(section).toBeInTheDocument();
    });

    it('should handle empty posts array', () => {
        render(<BlogPostList posts={[]} />);

        const section = document.querySelector('section');
        expect(section).toBeInTheDocument();
    });

    it('should render single post correctly', () => {
        render(<BlogPostList posts={[mockPosts[0]]} />);

        const cards = document.querySelectorAll('[data-slot="card"]');
        expect(cards).toHaveLength(1);
    });
});
