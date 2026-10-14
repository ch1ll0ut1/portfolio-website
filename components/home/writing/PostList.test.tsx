/**
 * Tests for the PostList component.
 * Covers the links the section exposes, not how the rows are styled.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PostList } from './PostList';
import { featuredPosts } from './featuredPosts';

describe('PostList Component', () => {
    it('should render a link to the real blog route of every featured post', () => {
        // Arrange
        render(<PostList />);

        // Assert
        featuredPosts.forEach((post) => {
            const link = screen.getByRole('link', { name: new RegExp(escapeForRegExp(post.title)) });

            expect(link).toHaveAttribute('href', `/blog/${post.slug}`);
        });
    });

    it('should render the titles the blog config provides', () => {
        // Arrange
        render(<PostList />);

        // Assert
        featuredPosts.forEach((post) => {
            expect(screen.getByText(post.title)).toBeInTheDocument();
            expect(screen.getByText(post.description)).toBeInTheDocument();
        });
    });

    it('should link the all-articles row to the blog index', () => {
        // Arrange
        render(<PostList />);

        // Act
        const link = screen.getByRole('link', { name: /all articles on the blog/i });

        // Assert
        expect(link).toHaveAttribute('href', '/blog');
    });

    it('should render one row per featured post plus the all-articles row', () => {
        // Arrange
        render(<PostList />);

        // Assert
        expect(screen.getAllByRole('listitem')).toHaveLength(featuredPosts.length + 1);
    });
});

const escapeForRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
