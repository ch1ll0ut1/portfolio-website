/**
 * Tests for the PagerLink component.
 * Covers the route it points at and the label it carries.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PagerLink } from './PagerLink';
import { type BlogPost } from '@/config/blog';

const post: BlogPost = {
    id: '1',
    title: 'An Older Post',
    excerpt: 'The excerpt.',
    date: '2025-08-14',
    readTime: '10 min read',
    tags: ['AI'],
    slug: 'an-older-post',
    published: true,
};

describe('PagerLink Component', () => {
    it('should link to the post route', () => {
        // Arrange
        render(<PagerLink post={post} label="Older" />);

        // Assert
        expect(screen.getByRole('link')).toHaveAttribute('href', '/blog/an-older-post');
    });

    it('should name the link by its label and the post title', () => {
        // Arrange
        render(<PagerLink post={post} label="Older" />);

        // Act
        const link = screen.getByRole('link');

        // Assert
        expect(link).toHaveTextContent('Older');
        expect(link).toHaveTextContent('An Older Post');
    });
});
