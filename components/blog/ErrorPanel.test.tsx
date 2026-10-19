/**
 * Tests for the ErrorPanel component.
 * Covers that a crashed page explains itself, offers a retry and a way home,
 * and logs the error instead of printing it to the reader.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorPanel } from './ErrorPanel';

describe('ErrorPanel Component', () => {
    const consoleError = vi.spyOn(console, 'error');

    beforeEach(() => {
        consoleError.mockImplementation(() => undefined);
    });

    afterEach(() => {
        consoleError.mockReset();
    });

    it('should announce the failure as the page heading', () => {
        // Arrange
        render(<ErrorPanel error={new Error('boom')} onRetry={vi.fn()} />);

        // Assert
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Something went wrong');
    });

    it('should retry when the reader asks to try again', async () => {
        // Arrange
        const onRetry = vi.fn();
        render(<ErrorPanel error={new Error('boom')} onRetry={onRetry} />);

        // Act
        await userEvent.click(screen.getByRole('button', { name: 'Try again' }));

        // Assert
        expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('should offer a way back home', () => {
        // Arrange
        render(<ErrorPanel error={new Error('boom')} onRetry={vi.fn()} />);

        // Assert
        expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/');
    });

    it('should log the error but not show its message', () => {
        // Arrange
        const error = new Error('database password is hunter2');

        // Act
        render(<ErrorPanel error={error} onRetry={vi.fn()} />);

        // Assert
        expect(consoleError).toHaveBeenCalledWith(error);
        expect(screen.queryByText(/hunter2/)).not.toBeInTheDocument();
    });

    it('should show the digest that ties the error to the server log', () => {
        // Arrange
        const error = Object.assign(new Error('boom'), { digest: '4021337' });

        // Act
        render(<ErrorPanel error={error} onRetry={vi.fn()} />);

        // Assert
        expect(screen.getByText('Error 4021337')).toBeInTheDocument();
    });
});
