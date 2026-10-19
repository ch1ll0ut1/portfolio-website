/**
 * Tests for the BlogIndex component.
 * Covers the rows it exposes and the metadata each one carries, not how they
 * are styled.
 */

import { describe, it, expect, afterAll, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BlogIndex } from './BlogIndex';
import { blogPosts, type ListedPost } from '@/config/blog';
import { formatDate } from '@/lib/date';
import { installMatchMedia } from '@/test/motionEnv';

const mockPosts: ListedPost[] = [
    {
        id: '1',
        title: 'First Post',
        excerpt: 'The first excerpt.',
        date: '2025-08-16',
        readTime: '8 min read',
        tags: ['Hiring', 'Startups'],
        slug: 'first-post',
        published: true,
        featured: true,
    },
    {
        id: '2',
        title: 'Second Post',
        excerpt: 'The second excerpt.',
        date: '2025-08-14',
        readTime: '10 min read',
        tags: ['AI'],
        slug: 'second-post',
        published: true,
    },
];

describe('BlogIndex Component', () => {
    // jsdom exposes `matchMedia` as an accessor that yields undefined, which the
    // motion kit calls on mount.
    let restoreMatchMedia: () => void = () => undefined;

    beforeAll(() => {
        restoreMatchMedia = installMatchMedia();
    });

    afterAll(() => {
        restoreMatchMedia();
    });

    it('should render a row linking to each post', () => {
        // Arrange
        render(<BlogIndex posts={mockPosts} />);

        // Assert
        mockPosts.forEach((post) => {
            const link = screen.getByRole('link', { name: new RegExp(post.title) });
            expect(link).toHaveAttribute('href', `/blog/${post.slug}`);
        });
    });

    it('should render every published post the config provides', () => {
        // Arrange
        render(<BlogIndex posts={blogPosts.map(post => ({ ...post, readTime: '1 min read' }))} />);

        // Assert
        blogPosts.forEach((post) => {
            expect(screen.getByText(post.title)).toBeInTheDocument();
        });
    });

    it('should render each post excerpt, date and read time', () => {
        // Arrange
        render(<BlogIndex posts={mockPosts} />);

        // Assert
        expect(screen.getByText('The first excerpt.')).toBeInTheDocument();
        expect(screen.getByText('8 min read')).toBeInTheDocument();
        expect(screen.getByText(formatDate('2025-08-16'))).toBeInTheDocument();
    });

    it('should expose the page heading as the only h1', () => {
        // Arrange
        render(<BlogIndex posts={mockPosts} />);

        // Assert
        expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    });

    it('should list the tags of each post', () => {
        // Arrange
        render(<BlogIndex posts={mockPosts} />);

        // Assert
        expect(screen.getByText('Hiring')).toBeInTheDocument();
        expect(screen.getByText('Startups')).toBeInTheDocument();
        expect(screen.getByText('AI')).toBeInTheDocument();
    });

    it('should mark a featured post', () => {
        // Arrange
        render(<BlogIndex posts={mockPosts} />);

        // Assert
        expect(screen.getAllByText('Featured')).toHaveLength(1);
    });
});
