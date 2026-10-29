/**
 * Tests for the 404 of an unknown article slug.
 */

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BlogPostNotFound } from './BlogPostNotFound';

describe('BlogPostNotFound', () => {
    it('should say the post is missing and lead back to the index', () => {
        // Arrange
        render(<BlogPostNotFound locale="en" />);

        // Assert
        expect(screen.getByRole('heading', { name: 'Post not found' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'All articles' })).toHaveAttribute('href', '/blog');
    });

    it('should lead a German reader back to the German index', () => {
        // Arrange
        render(<BlogPostNotFound locale="de" />);

        // Assert
        expect(screen.getByRole('link', { name: /./ })).toHaveAttribute('href', '/de/blog');
    });
});
