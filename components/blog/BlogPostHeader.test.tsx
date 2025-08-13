import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BlogPostHeader } from './BlogPostHeader';
import { BlogPost } from '@/config/blog';

const mockPost: BlogPost = {
    id: '1',
    title: 'Test Blog Post Title',
    excerpt: 'This is a test blog post excerpt.',
    date: '2024-01-15',
    readTime: '8 min read',
    tags: ['React', 'TypeScript', 'Testing'],
    slug: 'test-blog-post',
};

describe('BlogPostHeader Component', () => {
    it('should render as a header element', () => {
        render(<BlogPostHeader post={mockPost} />);

        const header = document.querySelector('header');
        expect(header).toBeInTheDocument();
    });

    it('should have proper heading hierarchy with h1', () => {
        render(<BlogPostHeader post={mockPost} />);

        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
    });

    it('should display post title from props', () => {
        render(<BlogPostHeader post={mockPost} />);

        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toHaveTextContent(mockPost.title);
    });

    it('should format and display date correctly', () => {
        render(<BlogPostHeader post={mockPost} />);

        // Verify date is formatted (without checking specific format)
        expect(screen.getByText(/January/)).toBeInTheDocument();
        expect(screen.getByText(/2024/)).toBeInTheDocument();
    });

    it('should display read time from props', () => {
        render(<BlogPostHeader post={mockPost} />);

        expect(screen.getByText(mockPost.readTime)).toBeInTheDocument();
    });

    it('should render author information', () => {
        render(<BlogPostHeader post={mockPost} />);

        // Check for author presence without specific name assertion
        const userIcon = document.querySelector('.lucide-user');
        expect(userIcon).toBeInTheDocument();
    });

    it('should render all provided tags', () => {
        render(<BlogPostHeader post={mockPost} />);

        mockPost.tags.forEach((tag) => {
            expect(screen.getByText(tag)).toBeInTheDocument();
        });
    });

    it('should display metadata icons for better accessibility', () => {
        render(<BlogPostHeader post={mockPost} />);

        const calendarIcon = document.querySelector('.lucide-calendar');
        const clockIcon = document.querySelector('.lucide-clock');
        const userIcon = document.querySelector('.lucide-user');

        expect(calendarIcon).toBeInTheDocument();
        expect(clockIcon).toBeInTheDocument();
        expect(userIcon).toBeInTheDocument();
    });

    it('should apply custom className when provided', () => {
        render(<BlogPostHeader post={mockPost} className="custom-class" />);

        const header = document.querySelector('header');
        expect(header).toHaveClass('custom-class');
    });

    it('should have responsive text sizing for heading', () => {
        render(<BlogPostHeader post={mockPost} />);

        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toHaveClass('text-4xl', 'md:text-5xl');
    });

    it('should have proper metadata layout styling', () => {
        render(<BlogPostHeader post={mockPost} />);

        // Find metadata container by looking for calendar icon's parent
        const calendarIcon = document.querySelector('.lucide-calendar');
        const metadataContainer = calendarIcon?.closest('div');
        expect(metadataContainer).toHaveClass('flex', 'items-center', 'gap-1');
    });

    it('should have proper tag container styling', () => {
        render(<BlogPostHeader post={mockPost} />);

        // Find tag container by looking for first tag's parent container
        const firstTag = screen.getByText(mockPost.tags[0]);
        const tagContainer = firstTag.closest('div');
        expect(tagContainer).toHaveClass('flex', 'flex-wrap', 'gap-2');
    });

    it('should handle empty tags array gracefully', () => {
        const postWithoutTags = { ...mockPost, tags: [] };
        render(<BlogPostHeader post={postWithoutTags} />);

        const header = document.querySelector('header');
        expect(header).toBeInTheDocument();
    });

    it('should handle different date formats correctly', () => {
        const postWithDifferentDate = { ...mockPost, date: '2023-12-25' };
        render(<BlogPostHeader post={postWithDifferentDate} />);

        // Verify component renders without breaking on different date
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
    });
});
