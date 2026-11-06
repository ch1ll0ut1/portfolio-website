/**
 * Tests for the German 404 and the page unknown German paths are rewritten to.
 */

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';
import MissingGermanPage from './nicht-gefunden/page';
import GermanNotFound, { metadata } from './not-found';

vi.mock('next/navigation', () => ({
    notFound: vi.fn(() => {
        throw new Error('NEXT_NOT_FOUND');
    }),
}));

describe('German 404', () => {
    it('should say in German that the page does not exist, and lead to the German home page', () => {
        // Arrange
        render(<GermanNotFound />);

        // Assert
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Seite nicht gefunden');
        expect(screen.getByRole('link', { name: 'Zur Startseite' })).toHaveAttribute('href', '/de');
        expect(metadata.robots).toBeNull();
    });

    it('should answer every unclaimed German path with not-found', () => {
        expect(() => MissingGermanPage()).toThrow('NEXT_NOT_FOUND');
        expect(notFound).toHaveBeenCalled();
    });
});
