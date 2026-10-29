/**
 * Tests for the German 404 and the catch-all that sends unknown German paths to it.
 */

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';
import MissingGermanPage from './[...missing]/page';
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

    it('should answer every unclaimed German path with not-found', async () => {
        await expect(MissingGermanPage({ params: Promise.resolve({ missing: ['nope'] }) })).rejects.toThrow('NEXT_NOT_FOUND');
        expect(notFound).toHaveBeenCalled();
    });
});
