/**
 * Tests for BlogPostHeader component.
 * Tests blog post header with metadata display.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BlogPostHeader } from './BlogPostHeader';

const mockPost = {
    id: 'test-post',
    title: 'Test Blog Post Header',
    excerpt: 'Test excerpt',
    date: '2024-01-01',
    readTime: '8 min read',
    tags: ['React', 'Testing', 'TypeScript'],
    slug: 'test-post-header',
    published: true,
};

describe('BlogPostHeader Component', () => {
    it('should render post title and metadata', () => {
        render(<BlogPostHeader post={mockPost} />);

        expect(screen.getByText('Test Blog Post Header')).toBeInTheDocument();
        expect(screen.getByText('8 min read')).toBeInTheDocument();
    });

    it('should render all post tags', () => {
        render(<BlogPostHeader post={mockPost} />);

        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('Testing')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });

    it('should display formatted date', () => {
        render(<BlogPostHeader post={mockPost} />);

        // Should display some date format
        const dateElement = screen.getByText(/2024|Jan|January/);
        expect(dateElement).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
        render(<BlogPostHeader post={mockPost} />);

        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
        expect(heading.tagName).toBe('H1');
    });

    it('should handle posts with no tags', () => {
        const postNoTags = { ...mockPost, tags: [] };
        render(<BlogPostHeader post={postNoTags} />);

        expect(screen.getByText('Test Blog Post Header')).toBeInTheDocument();
    });
});
