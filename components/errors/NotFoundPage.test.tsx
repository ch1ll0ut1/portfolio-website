/**
 * Tests for the not-found pages in both languages, and their metadata.
 */

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NotFoundPage } from './NotFoundPage';
import { notFoundMetadata } from './notFoundMetadata';

describe('NotFoundPage', () => {
    it.each([
        ['page', 'Page not found', 'Back to home', '/'],
        ['post', 'Post not found', 'All articles', '/blog'],
        ['caseStudy', 'Case study not found', 'All work', '/#work'],
    ] as const)('should explain a missing %s in English and lead on', (kind, title, action, href) => {
        // Act
        render(<NotFoundPage locale="en" kind={kind} />);

        // Assert
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(title);
        expect(screen.getByText('404')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: action })).toHaveAttribute('href', href);
    });

    it('should explain a missing page in German, leading to the German home page', () => {
        // Act
        render(<NotFoundPage locale="de" kind="page" />);

        // Assert
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Seite nicht gefunden');
        expect(screen.getByRole('link', { name: 'Zur Startseite' })).toHaveAttribute('href', '/de');
    });

    it('should lead a German reader on within the German site', () => {
        // Act
        render(<NotFoundPage locale="de" kind="caseStudy" />);

        // Assert
        expect(screen.getByRole('link')).toHaveAttribute('href', '/de#work');
    });
});

describe('notFoundMetadata', () => {
    it('should title and describe the 404 in its language, and leave robots to Next', () => {
        expect(notFoundMetadata('en', 'post')).toEqual({
            title: 'Post not found',
            description: 'That article does not exist, or its link has changed.',
            robots: null,
        });
        expect(notFoundMetadata('de', 'page')).toEqual({
            title: 'Seite nicht gefunden',
            description: 'Die gesuchte Seite gibt es nicht.',
            robots: null,
        });
    });
});
