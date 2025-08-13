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
    it('should render as a section element', () => {
        render(<BlogPostList posts={mockPosts} />);

        const section = document.querySelector('section');
        expect(section).toBeInTheDocument();
    });

    it('should render all provided blog posts', () => {
        render(<BlogPostList posts={mockPosts} />);

        mockPosts.forEach((post) => {
            expect(screen.getByText(post.title)).toBeInTheDocument();
        });
    });

    it('should render post excerpts for all posts', () => {
        render(<BlogPostList posts={mockPosts} />);

        mockPosts.forEach((post) => {
            expect(screen.getByText(post.excerpt)).toBeInTheDocument();
        });
    });

    it('should render tags for all posts', () => {
        render(<BlogPostList posts={mockPosts} />);

        mockPosts.forEach((post) => {
            post.tags.forEach((tag) => {
                expect(screen.getByText(tag)).toBeInTheDocument();
            });
        });
    });

    it('should render action buttons for each post', () => {
        render(<BlogPostList posts={mockPosts} />);

        const buttons = screen.getAllByRole('link', { name: /read full article/i });
        expect(buttons).toHaveLength(mockPosts.length);
    });

    it('should generate correct blog post links from slugs', () => {
        render(<BlogPostList posts={mockPosts} />);

        mockPosts.forEach((post) => {
            const postLink = screen.getByText(post.title).closest('a');
            expect(postLink).toHaveAttribute('href', `/blog/${post.slug}`);
        });
    });

    it('should apply custom className when provided', () => {
        render(<BlogPostList posts={mockPosts} className="custom-class" />);

        const section = document.querySelector('section');
        expect(section).toHaveClass('custom-class');
    });

    it('should have proper section layout styling', () => {
        render(<BlogPostList posts={mockPosts} />);

        const section = document.querySelector('section');
        expect(section).toHaveClass('py-12', 'px-6');
    });

    it('should handle empty posts array gracefully', () => {
        render(<BlogPostList posts={[]} />);

        const section = document.querySelector('section');
        expect(section).toBeInTheDocument();
        expect(section).toHaveClass('py-12', 'px-6');
    });

    it('should render correct number of blog post cards', () => {
        render(<BlogPostList posts={mockPosts} />);

        const cards = document.querySelectorAll('[data-slot="card"]');
        expect(cards).toHaveLength(mockPosts.length);
    });

    it('should handle single post correctly', () => {
        const singlePost = [mockPosts[0]];
        render(<BlogPostList posts={singlePost} />);

        const cards = document.querySelectorAll('[data-slot="card"]');
        expect(cards).toHaveLength(1);
        expect(screen.getByText(singlePost[0].title)).toBeInTheDocument();
    });

    it('should maintain proper structure with varying post data', () => {
        const postWithManyTags = {
            ...mockPosts[0],
            tags: ['React', 'TypeScript', 'Testing', 'CSS', 'JavaScript'],
        };

        render(<BlogPostList posts={[postWithManyTags]} />);

        postWithManyTags.tags.forEach((tag) => {
            expect(screen.getByText(tag)).toBeInTheDocument();
        });
    });

    it('should handle posts with empty tags arrays', () => {
        const postWithoutTags = { ...mockPosts[0], tags: [] };
        render(<BlogPostList posts={[postWithoutTags]} />);

        const section = document.querySelector('section');
        expect(section).toBeInTheDocument();
        expect(screen.getByText(postWithoutTags.title)).toBeInTheDocument();
    });
});
