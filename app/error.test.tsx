/**
 * Tests for the route error boundary.
 * Covers that a crash inside a route lands on the error panel, in a main
 * landmark, with Next's reset wired to the retry.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RouteError from './error';

describe('RouteError', () => {
    const consoleError = vi.spyOn(console, 'error');

    beforeEach(() => {
        consoleError.mockImplementation(() => undefined);
    });

    afterEach(() => {
        consoleError.mockReset();
    });

    it('should show the error panel as the main content', () => {
        // Arrange
        render(<RouteError error={new Error('boom')} reset={vi.fn()} />);

        // Assert
        expect(screen.getByRole('main')).toContainElement(screen.getByRole('heading', { level: 1 }));
    });

    it('should call reset when the reader retries', async () => {
        // Arrange
        const reset = vi.fn();
        render(<RouteError error={new Error('boom')} reset={reset} />);

        // Act
        await userEvent.click(screen.getByRole('button', { name: 'Try again' }));

        // Assert
        expect(reset).toHaveBeenCalledTimes(1);
    });
});
