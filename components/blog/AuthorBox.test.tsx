/**
 * Tests for the author card that closes an article.
 */

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { siteConfig } from '@/config/site';
import { AuthorBox } from './AuthorBox';

describe('AuthorBox', () => {
    it('should name the author and link the name to the homepage', () => {
        // Arrange
        render(<AuthorBox />);

        // Act
        const name = screen.getByRole('link', { name: siteConfig.name });

        // Assert
        expect(screen.getByRole('complementary', { name: 'About the author' })).toBeInTheDocument();
        expect(name).toHaveAttribute('href', '/');
        expect(name).toHaveAttribute('rel', 'author');
    });

    it('should say what the author does, since when, and from where', () => {
        // Arrange
        render(<AuthorBox />);

        // Assert
        const bio = screen.getByText(/Software architect & tech lead since/);
        expect(bio).toHaveTextContent(`since ${siteConfig.sinceYear}.`);
        expect(bio).toHaveTextContent(/remotely from Bangkok in English and Deutsch/);
    });

    it('should lead on to the services and the contact page', () => {
        // Arrange
        render(<AuthorBox />);

        // Assert
        expect(screen.getByRole('link', { name: 'How I can help' })).toHaveAttribute('href', '/services');
        expect(screen.getByRole('link', { name: 'Get in touch' })).toHaveAttribute('href', '/contact');
    });
});
