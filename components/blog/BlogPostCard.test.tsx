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
    it('should render the blog post title', () => {
        render(<BlogPostCard post={mockPost} />);

        expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    });

    it('should render the blog post excerpt', () => {
        render(<BlogPostCard post={mockPost} />);

        expect(screen.getByText('This is a test blog post excerpt for testing purposes.')).toBeInTheDocument();
    });

    it('should render the formatted date', () => {
        render(<BlogPostCard post={mockPost} />);

        expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
    });

    it('should render the read time', () => {
        render(<BlogPostCard post={mockPost} />);

        expect(screen.getByText('5 min read')).toBeInTheDocument();
    });

    it('should render the author name', () => {
        render(<BlogPostCard post={mockPost} />);

        expect(screen.getByText('Stefan Knoch')).toBeInTheDocument();
    });

    it('should render all tags', () => {
        render(<BlogPostCard post={mockPost} />);

        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('Testing')).toBeInTheDocument();
    });

    it('should render the read full article button', () => {
        render(<BlogPostCard post={mockPost} />);

        expect(screen.getByText('Read Full Article')).toBeInTheDocument();
    });

    it('should have correct link to blog post', () => {
        render(<BlogPostCard post={mockPost} />);

        const titleLink = screen.getByText('Test Blog Post').closest('a');
        expect(titleLink).toHaveAttribute('href', '/blog/test-blog-post');
    });

    it('should render calendar icon', () => {
        render(<BlogPostCard post={mockPost} />);

        const calendarIcon = document.querySelector('.lucide-calendar');
        expect(calendarIcon).toBeInTheDocument();
    });

    it('should render clock icon', () => {
        render(<BlogPostCard post={mockPost} />);

        const clockIcon = document.querySelector('.lucide-clock');
        expect(clockIcon).toBeInTheDocument();
    });

    it('should render user icon', () => {
        render(<BlogPostCard post={mockPost} />);

        const userIcon = document.querySelector('.lucide-user');
        expect(userIcon).toBeInTheDocument();
    });

    it('should apply custom className when provided', () => {
        render(<BlogPostCard post={mockPost} className="custom-class" />);

        const card = screen.getByText('Test Blog Post').closest('[data-slot="card"]');
        expect(card).toHaveClass('custom-class');
    });

    it('should have proper card styling', () => {
        render(<BlogPostCard post={mockPost} />);

        const card = screen.getByText('Test Blog Post').closest('[data-slot="card"]');
        expect(card).toHaveClass('border-0', 'shadow-lg', 'hover:shadow-xl');
    });
});
