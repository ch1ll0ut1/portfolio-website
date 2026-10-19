/**
 * Tests for the global error boundary.
 * It replaces the root layout, so it must bring a whole document of its own.
 */

import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import GlobalError from './global-error';

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
        const doc = renderDocument();

        // Assert
        expect(doc.documentElement.lang).toBe('en');
        expect(doc.body.querySelector('main')).not.toBeNull();
    });

    it('should show the error panel with a retry', () => {
        // Arrange
        const doc = renderDocument();

        // Assert
        expect(doc.querySelector('h1')?.textContent).toBe('Something went wrong');
        expect(doc.querySelector('button')?.textContent).toBe('Try again');
    });
});
