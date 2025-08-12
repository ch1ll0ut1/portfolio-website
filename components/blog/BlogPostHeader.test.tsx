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
    it('should render the blog post title', () => {
        render(<BlogPostHeader post={mockPost} />);

        expect(screen.getByText('Test Blog Post Title')).toBeInTheDocument();
    });

    it('should render the formatted date', () => {
        render(<BlogPostHeader post={mockPost} />);

        expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
    });

    it('should render the read time', () => {
        render(<BlogPostHeader post={mockPost} />);

        expect(screen.getByText('8 min read')).toBeInTheDocument();
    });

    it('should render the author name', () => {
        render(<BlogPostHeader post={mockPost} />);

        expect(screen.getByText('Stefan Knoch')).toBeInTheDocument();
    });

    it('should render all tags', () => {
        render(<BlogPostHeader post={mockPost} />);

        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
        expect(screen.getByText('Testing')).toBeInTheDocument();
    });

    it('should render calendar icon', () => {
        render(<BlogPostHeader post={mockPost} />);

        const calendarIcon = document.querySelector('.lucide-calendar');
        expect(calendarIcon).toBeInTheDocument();
    });

    it('should render clock icon', () => {
        render(<BlogPostHeader post={mockPost} />);

        const clockIcon = document.querySelector('.lucide-clock');
        expect(clockIcon).toBeInTheDocument();
    });

    it('should render user icon', () => {
        render(<BlogPostHeader post={mockPost} />);

        const userIcon = document.querySelector('.lucide-user');
        expect(userIcon).toBeInTheDocument();
    });

    it('should apply custom className when provided', () => {
        render(<BlogPostHeader post={mockPost} className="custom-class" />);

        const header = screen.getByText('Test Blog Post Title').closest('header');
        expect(header).toHaveClass('custom-class');
    });

    it('should have proper heading hierarchy', () => {
        render(<BlogPostHeader post={mockPost} />);

        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('Test Blog Post Title');
    });

    it('should have responsive text sizing', () => {
        render(<BlogPostHeader post={mockPost} />);

        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toHaveClass('text-4xl', 'md:text-5xl');
    });

    it('should have proper metadata styling', () => {
        render(<BlogPostHeader post={mockPost} />);

        const metadata = screen.getByText('January 15, 2024').closest('div');
        expect(metadata).toHaveClass('flex', 'items-center', 'gap-1');
    });

    it('should have proper tag styling', () => {
        render(<BlogPostHeader post={mockPost} />);

        const tagContainer = screen.getByText('React').closest('div');
        expect(tagContainer).toHaveClass('flex', 'flex-wrap', 'gap-2');
    });
});
