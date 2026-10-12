/**
 * Tests for the primary call to action.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { links } from '@/config/links';
import { installMatchMedia } from '../../../test/motionEnv';
import { CtaMagnet } from './CtaMagnet';

describe('CtaMagnet', () => {
    let restoreMedia: () => void;
    let gtag: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        restoreMedia = installMatchMedia([]);
        gtag = vi.fn();
        window.gtag = gtag as unknown as typeof window.gtag;
    });

    afterEach(() => {
        restoreMedia();
    });

    it('should report a conversion when the booking link is activated', async () => {
        // Arrange
        render(<CtaMagnet />);

        // Act
        await userEvent.click(screen.getByRole('link', { name: 'Book a 30-min call' }));

        // Assert
        expect(gtag).toHaveBeenCalledWith('event', 'conversion', {
            conversion_type: 'footer',
            click_location: 'cta_section',
            event_category: 'conversion',
        });
    });

    it('should still be a real link, so the browser handles the navigation', () => {
        // Act
        render(<CtaMagnet />);

        // Assert
        const cta = screen.getByRole('link', { name: 'Book a 30-min call' });

        expect(cta.tagName).toBe('A');
        expect(cta).toHaveAttribute('href', links.calendly);
    });

    it('should link to the booking page', () => {
        // Act
        render(<CtaMagnet />);

        // Assert
        expect(screen.getByRole('link', { name: 'Book a 30-min call' })).toHaveAttribute('href', links.calendly);
    });

    it('should open the booking page safely in a new tab', () => {
        // Act
        render(<CtaMagnet />);

        // Assert
        const cta = screen.getByRole('link', { name: 'Book a 30-min call' });

        expect(cta).toHaveAttribute('target', '_blank');
        expect(cta).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should name the action once, with the rolling duplicate hidden', () => {
        // Act
        render(<CtaMagnet />);

        // Assert
        expect(screen.getByRole('link', { name: 'Book a 30-min call' })).toBeInTheDocument();
    });

    it('should hide the decorative arrow from assistive technology', () => {
        // Act
        const { container } = render(<CtaMagnet />);

        // Assert
        for (const svg of container.querySelectorAll('svg')) {
            expect(svg.closest('[aria-hidden="true"]')).not.toBeNull();
        }
    });
});
