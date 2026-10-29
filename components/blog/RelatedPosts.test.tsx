/**
 * Tests for the related posts shown under an article.
 */

import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { type ListedPost } from '@/config/blog';
import { RelatedPosts } from './RelatedPosts';

const listed = (slug: string, title: string): ListedPost => ({
    id: slug,
    title,
    excerpt: '',
    date: '2025-08-14',
    readTime: '4 min read',
    tags: ['AI'],
    slug,
    published: true,
});

describe('RelatedPosts', () => {
    it('should list each post as a link under a heading', () => {
        // Arrange
        render(<RelatedPosts posts={[listed('one', 'Post One'), listed('two', 'Post Two')]} />);

        // Act
        const section = screen.getByRole('region', { name: 'Related posts' });
        const links = within(section).getAllByRole('link');

        // Assert
        expect(screen.getByRole('heading', { level: 2, name: 'Related posts' })).toBeInTheDocument();
        expect(links.map(link => link.getAttribute('href'))).toEqual(['/blog/one', '/blog/two']);
        expect(links[0]).toHaveTextContent('4 min read');
        expect(links[0]).toHaveTextContent('Post One');
    });

    it('should render nothing without posts', () => {
        // Arrange
        const { container } = render(<RelatedPosts posts={[]} />);

        // Assert
        expect(container).toBeEmptyDOMElement();
    });
});
