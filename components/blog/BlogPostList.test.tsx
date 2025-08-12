import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BlogPostList } from './BlogPostList';
import { BlogPost } from '@/config/blog';

const mockPosts: BlogPost[] = [
    {
        id: '1',
        title: 'First Blog Post',
        excerpt: 'This is the first blog post excerpt.',
        date: '2024-01-15',
        readTime: '5 min read',
        tags: ['React'],
        slug: 'first-blog-post',
    },
    {
        id: '2',
        title: 'Second Blog Post',
        excerpt: 'This is the second blog post excerpt.',
        date: '2024-01-10',
        readTime: '3 min read',
        tags: ['TypeScript'],
        slug: 'second-blog-post',
    },
];

describe('BlogPostList Component', () => {
    it('should render all blog posts', () => {
        render(<BlogPostList posts={mockPosts} />);

        expect(screen.getByText('First Blog Post')).toBeInTheDocument();
        expect(screen.getByText('Second Blog Post')).toBeInTheDocument();
    });

    it('should render all blog post excerpts', () => {
        render(<BlogPostList posts={mockPosts} />);

        expect(screen.getByText('This is the first blog post excerpt.')).toBeInTheDocument();
        expect(screen.getByText('This is the second blog post excerpt.')).toBeInTheDocument();
    });

    it('should render all blog post tags', () => {
        render(<BlogPostList posts={mockPosts} />);

        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });

    it('should render read full article buttons for all posts', () => {
        render(<BlogPostList posts={mockPosts} />);

        const buttons = screen.getAllByText('Read Full Article');
        expect(buttons).toHaveLength(2);
    });

    it('should have correct links to blog posts', () => {
        render(<BlogPostList posts={mockPosts} />);

        const firstPostLink = screen.getByText('First Blog Post').closest('a');
        const secondPostLink = screen.getByText('Second Blog Post').closest('a');

        expect(firstPostLink).toHaveAttribute('href', '/blog/first-blog-post');
        expect(secondPostLink).toHaveAttribute('href', '/blog/second-blog-post');
    });

    it('should apply custom className when provided', () => {
        render(<BlogPostList posts={mockPosts} className="custom-class" />);

        const section = screen.getByText('First Blog Post').closest('section');
        expect(section).toHaveClass('custom-class');
    });

    it('should have proper section structure', () => {
        render(<BlogPostList posts={mockPosts} />);

        const section = screen.getByText('First Blog Post').closest('section');
        expect(section).toHaveClass('py-12', 'px-6');
    });

    it('should render empty list when no posts provided', () => {
        render(<BlogPostList posts={[]} />);

        const section = document.querySelector('section');
        expect(section).toBeInTheDocument();
        expect(section).toHaveClass('py-12', 'px-6');
    });

    it('should render correct number of blog post cards', () => {
        render(<BlogPostList posts={mockPosts} />);

        const cards = document.querySelectorAll('[data-slot="card"]');
        expect(cards).toHaveLength(2);
    });
});
