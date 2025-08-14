/**
 * Tests for BlogPostCard component.
 * Tests blog post card display and functionality.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BlogPostCard } from './BlogPostCard';

const mockPost = {
    id: 'test-post',
    title: 'Test Blog Post',
    excerpt: 'This is a test excerpt',
    date: '2024-01-01',
    readTime: '5 min read',
    tags: ['React', 'Testing'],
    slug: 'test-blog-post',
    published: true,
};

describe('BlogPostCard Component', () => {
    it('should render post information', () => {
        render(<BlogPostCard post={mockPost} />);

        expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
        expect(screen.getByText('This is a test excerpt')).toBeInTheDocument();
        expect(screen.getByText('5 min read')).toBeInTheDocument();
    });

    it('should render post tags', () => {
        render(<BlogPostCard post={mockPost} />);

        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('Testing')).toBeInTheDocument();
    });

    it('should render formatted date', () => {
        render(<BlogPostCard post={mockPost} />);

        // Should display some date format
        const dateElement = screen.getByText(/2024|Jan|January/);
        expect(dateElement).toBeInTheDocument();
    });

    it('should have accessible card structure', () => {
        render(<BlogPostCard post={mockPost} />);

        const card = document.querySelector('[data-slot="card"]');
        expect(card).toBeInTheDocument();
    });

    it('should handle posts with many tags', () => {
        const postWithManyTags = {
            ...mockPost,
            tags: ['React', 'Testing', 'TypeScript', 'Next.js', 'Tailwind'],
        };
        render(<BlogPostCard post={postWithManyTags} />);

        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('Tailwind')).toBeInTheDocument();
    });
});
