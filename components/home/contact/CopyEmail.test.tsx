/**
 * Tests for the email pill.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CONTACT_EMAIL, CopyEmail } from './CopyEmail';

const stubClipboard = (writeText: () => Promise<void>) => {
    Object.defineProperty(navigator, 'clipboard', {
        value: { writeText },
        configurable: true,
        writable: true,
    });
};

/** The pill's own live region, and the only confirmation: the copy is made
 *  with `silent: true` so the global toast does not duplicate it. */
const liveRegion = (container: HTMLElement) => container.querySelector('[aria-live="polite"]');

describe('CopyEmail', () => {
    beforeEach(() => {
        // The fallback path reaches for execCommand, which jsdom does not have.
        Object.defineProperty(document, 'execCommand', {
            value: vi.fn(() => false),
            configurable: true,
            writable: true,
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should show the email address as selectable text', () => {
        // Act
        render(<CopyEmail />);

        // Assert
        expect(screen.getByText(CONTACT_EMAIL)).toBeInTheDocument();
    });

    it('should copy the address to the clipboard', async () => {
        // Arrange
        const writeText = vi.fn(() => Promise.resolve());

        stubClipboard(writeText);
        render(<CopyEmail />);

        // Act
        await userEvent.click(screen.getByRole('button', { name: /copy email/i }));

        // Assert
        expect(writeText).toHaveBeenCalledWith(CONTACT_EMAIL);
    });

    it('should announce the confirmation in the live region', async () => {
        // Arrange
        stubClipboard(() => Promise.resolve());
        const { container } = render(<CopyEmail />);

        // Act
        await userEvent.click(screen.getByRole('button', { name: /copy email/i }));

        // Assert
        await waitFor(() => {
            expect(liveRegion(container)).toHaveTextContent('Email copied to clipboard');
        });
        expect(liveRegion(container)).toHaveAttribute('role', 'status');
    });

    it('should say nothing before the button is used', () => {
        // Act
        const { container } = render(<CopyEmail />);

        // Assert
        expect(liveRegion(container)).toHaveTextContent('');
    });

    it('should announce a failure when neither clipboard path works', async () => {
        // Arrange
        stubClipboard(() => Promise.reject(new Error('denied')));
        const { container } = render(<CopyEmail />);

        // Act
        await userEvent.click(screen.getByRole('button', { name: /copy email/i }));

        // Assert
        await waitFor(() => {
            expect(liveRegion(container)).toHaveTextContent(/could not copy/i);
        });
    });

    it('should not claim success when the copy failed', async () => {
        // Arrange
        stubClipboard(() => Promise.reject(new Error('denied')));
        const { container } = render(<CopyEmail />);

        // Act
        await userEvent.click(screen.getByRole('button', { name: /copy email/i }));

        // Assert
        await waitFor(() => {
            expect(liveRegion(container)).not.toHaveTextContent('Email copied to clipboard');
        });
    });
});
