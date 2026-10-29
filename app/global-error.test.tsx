/**
 * Tests for the global error boundary.
 * It replaces the root layout, so it must bring a whole document of its own.
 */

import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import GlobalError from './global-error';

const navigation = vi.hoisted(() => ({ pathname: '/' }));

vi.mock('next/navigation', () => ({
    usePathname: () => navigation.pathname,
}));

describe('GlobalError', () => {
    /**
     * Rendered to markup and parsed as a whole document: a test container
     * cannot hold an `<html>` element.
     */
    const renderDocument = () => new DOMParser().parseFromString(
        renderToStaticMarkup(<GlobalError error={new Error('boom')} reset={vi.fn()} />),
        'text/html',
    );

    it('should render its own document, in English', () => {
        // Arrange
        navigation.pathname = '/blog/x';
        const doc = renderDocument();

        // Assert
        expect(doc.documentElement.lang).toBe('en');
        expect(doc.body.querySelector('main')).not.toBeNull();
    });

    it('should show the error panel with a retry', () => {
        // Arrange
        navigation.pathname = '/';
        const doc = renderDocument();

        // Assert
        expect(doc.querySelector('h1')?.textContent).toBe('Something went wrong');
        expect(doc.querySelector('button')?.textContent).toBe('Try again');
    });

    it('should speak German under /de', () => {
        // Arrange
        navigation.pathname = '/de/leistungen';
        const doc = renderDocument();

        // Assert
        expect(doc.documentElement.lang).toBe('de');
        expect(doc.querySelector('h1')?.textContent).toBe('Etwas ist schiefgelaufen');
    });
});
