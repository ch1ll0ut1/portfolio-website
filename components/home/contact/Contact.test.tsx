/**
 * Tests for the contact section.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { links } from '@/config/links';
import { installIntersectionObserver, installMatchMedia, settleIntro } from '../../../test/motionEnv';
import { Contact } from './Contact';
import styles from './Contact.module.css';

describe('Contact', () => {
    let observers: ReturnType<typeof installIntersectionObserver>;
    let restoreMedia: () => void;

    beforeEach(() => {
        observers = installIntersectionObserver();
        restoreMedia = installMatchMedia([]);
    });

    afterEach(() => {
        observers.restore();
        restoreMedia();
    });

    it('should render a labelled section anchored at the contact id', () => {
        // Act
        const { container } = render(<Contact />);

        // Assert
        expect(container.querySelector('#contact')).toBeInTheDocument();
        expect(screen.getByRole('region', { name: /bring me the hard part/i })).toBeInTheDocument();
    });

    it('should render the headline with the highlighted phrase', () => {
        // Act
        render(<Contact />);

        // Assert
        const heading = screen.getByRole('heading', { level: 2 });

        expect(heading.textContent).toBe('Bring me the hard part.');
        expect(heading.querySelector('mark')?.textContent).toBe('hard part');
    });

    it('should render the lede', () => {
        // Act
        render(<Contact />);

        // Assert
        expect(screen.getByText(/i reply within a day, from bangkok/i)).toBeInTheDocument();
    });

    it('should offer both ways to get in touch', () => {
        // Act
        render(<Contact />);

        // Assert
        expect(screen.getByRole('link', { name: 'Book a 30-min call' })).toHaveAttribute('href', links.calendly);
        expect(screen.getByRole('link', { name: 'Message me on LinkedIn' })).toHaveAttribute('href', links.social.linkedin);
    });

    it('should carry the footer', () => {
        // Act
        render(<Contact />);

        // Assert
        expect(screen.getByRole('contentinfo')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Back to top' })).toBeInTheDocument();
    });

    it('should leave the headline selection drawn, not sweep it again, when on screen at load', async () => {
        // Arrange
        const rect = vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(
            DOMRect.fromRect({ x: 0, y: 100, width: 300, height: 200 }),
        );

        try {
            // Act
            render(<Contact />);
            await settleIntro();
            // Past the delay a sweep would have started after.
            await new Promise((resolve) => {
                setTimeout(resolve, 700);
            });

            // Assert
            const mark = screen.getByRole('heading', { level: 2 }).querySelector('mark');

            expect(mark).not.toHaveClass(styles.isArmed);
            expect(mark).not.toHaveClass(styles.isSweep);
        }
        finally {
            rect.mockRestore();
        }
    });
});
