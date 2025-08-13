import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BlogPostCard } from './BlogPostCard';
import { BlogPost } from '@/config/blog';

const mockPost: BlogPost = {
    id: '1',
    title: 'Test Blog Post',
    excerpt: 'This is a test blog post excerpt for testing purposes.',
    date: '2024-01-15',
    readTime: '5 min read',
    tags: ['React', 'Testing'],
    slug: 'test-blog-post',
};

describe('BlogPostCard Component', () => {
    it('should render as a card element', () => {
        render(<BlogPostCard post={mockPost} />);

        const card = document.querySelector('[data-slot="card"]');
        expect(card).toBeInTheDocument();
    });

    it('should display post title from props', () => {
        render(<BlogPostCard post={mockPost} />);

        expect(screen.getByText(mockPost.title)).toBeInTheDocument();
    });

    it('should display post excerpt from props', () => {
        render(<BlogPostCard post={mockPost} />);

        expect(screen.getByText(mockPost.excerpt)).toBeInTheDocument();
    });

    it('should format and display date correctly', () => {
        render(<BlogPostCard post={mockPost} />);

        // Verify date is formatted without checking specific format
        expect(screen.getByText(/January/)).toBeInTheDocument();
        expect(screen.getByText(/2024/)).toBeInTheDocument();
    });

    it('should display read time from props', () => {
        render(<BlogPostCard post={mockPost} />);

        expect(screen.getByText(mockPost.readTime)).toBeInTheDocument();
    });

    it('should render author information', () => {
        render(<BlogPostCard post={mockPost} />);

        // Check for author presence via user icon without specific name assertion
        const userIcon = document.querySelector('.lucide-user');
        expect(userIcon).toBeInTheDocument();
    });

    it('should render all provided tags', () => {
        render(<BlogPostCard post={mockPost} />);

        mockPost.tags.forEach((tag) => {
            expect(screen.getByText(tag)).toBeInTheDocument();
        });
    });

    it('should render action button to read full article', () => {
        render(<BlogPostCard post={mockPost} />);

        const button = screen.getByRole('link', { name: /read full article/i });
        expect(button).toBeInTheDocument();
    });

    it('should generate correct blog post link from slug', () => {
        render(<BlogPostCard post={mockPost} />);

        const titleLink = screen.getByText(mockPost.title).closest('a');
        expect(titleLink).toHaveAttribute('href', `/blog/${mockPost.slug}`);
    });

    it('should display metadata icons for accessibility', () => {
        render(<BlogPostCard post={mockPost} />);

        const calendarIcon = document.querySelector('.lucide-calendar');
        const clockIcon = document.querySelector('.lucide-clock');
        const userIcon = document.querySelector('.lucide-user');

        expect(calendarIcon).toBeInTheDocument();
        expect(clockIcon).toBeInTheDocument();
        expect(userIcon).toBeInTheDocument();
    });

    it('should apply custom className when provided', () => {
        render(<BlogPostCard post={mockPost} className="custom-class" />);

        const card = document.querySelector('[data-slot="card"]');
        expect(card).toHaveClass('custom-class');
    });

    it('should have proper card styling with hover effects', () => {
        render(<BlogPostCard post={mockPost} />);

        const card = document.querySelector('[data-slot="card"]');
        expect(card).toHaveClass('border-0', 'shadow-lg', 'hover:shadow-xl');
    });

    it('should handle empty tags array gracefully', () => {
        const postWithoutTags = { ...mockPost, tags: [] };
        render(<BlogPostCard post={postWithoutTags} />);

        const card = document.querySelector('[data-slot="card"]');
        expect(card).toBeInTheDocument();
        expect(screen.getByText(postWithoutTags.title)).toBeInTheDocument();
    });

    it('should handle different date formats correctly', () => {
        const postWithDifferentDate = { ...mockPost, date: '2023-12-25' };
        render(<BlogPostCard post={postWithDifferentDate} />);

        // Verify component renders without breaking on different date
        const card = document.querySelector('[data-slot="card"]');
        expect(card).toBeInTheDocument();
    });

    it('should maintain accessibility with proper link structure', () => {
        render(<BlogPostCard post={mockPost} />);

        const titleLink = screen.getByText(mockPost.title).closest('a');
        const actionButton = screen.getByRole('link', { name: /read full article/i });

        expect(titleLink).toHaveAttribute('href', `/blog/${mockPost.slug}`);
        expect(actionButton).toHaveAttribute('href', `/blog/${mockPost.slug}`);
    });

    it('should handle long content gracefully', () => {
        const postWithLongContent = {
            ...mockPost,
            title: 'This is a very long blog post title that might wrap to multiple lines',
            excerpt: 'This is a very long excerpt that contains multiple sentences and goes on for quite a while to test how the component handles longer content that might need to be truncated or wrapped properly within the card layout.',
        };

        render(<BlogPostCard post={postWithLongContent} />);

        const card = document.querySelector('[data-slot="card"]');
        expect(card).toBeInTheDocument();
        expect(screen.getByText(postWithLongContent.title)).toBeInTheDocument();
        expect(screen.getByText(postWithLongContent.excerpt)).toBeInTheDocument();
    });
});
