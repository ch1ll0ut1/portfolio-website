/**
 * Tests for the Writing section.
 * Covers the section's structure and that its posts come from the blog config.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { blogPosts } from '@/config/blog';
import { buildingNow } from '@/config/buildingNow';
import { Writing } from './Writing';

describe('Writing Section', () => {
    it('should render as a labelled section anchored at #writing', () => {
        // Arrange
        const { container } = render(<Writing />);

        // Act
        const section = container.querySelector('section');

        // Assert
        expect(section).toHaveAttribute('id', 'writing');
        expect(screen.getByRole('region', { name: /writing and current work/i })).toBeInTheDocument();
    });

    it('should render the heading and sub-line', () => {
        // Arrange
        render(<Writing />);

        // Assert
        expect(screen.getByRole('heading', { name: /writing and current work/i })).toBeInTheDocument();
        expect(screen.getByText(/building software with AI agents/i)).toBeInTheDocument();
    });

    it('should link every post the blog config flags as featured', () => {
        // Arrange
        render(<Writing />);

        // Act
        const featured = blogPosts.filter(post => post.featured === true);

        // Assert
        expect(featured.length).toBeGreaterThan(0);
        featured.forEach((post) => {
            const link = screen.getByRole('link', { name: new RegExp(escapeForRegExp(post.title)) });

            expect(link).toHaveAttribute('href', `/blog/${post.slug}`);
        });
    });

    it('should render the building-now card alongside the posts', () => {
        // Arrange
        render(<Writing />);

        // Assert
        expect(screen.getByRole('heading', { name: buildingNow.title })).toBeInTheDocument();
        expect(screen.getByText(buildingNow.description)).toBeInTheDocument();
    });

    it('should link to the blog index', () => {
        // Arrange
        render(<Writing />);

        // Assert
        expect(screen.getByRole('link', { name: /all articles on the blog/i })).toHaveAttribute('href', '/blog');
    });
});

const escapeForRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
