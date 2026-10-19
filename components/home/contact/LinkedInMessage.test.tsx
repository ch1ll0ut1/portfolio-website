/**
 * Tests for the LinkedIn contact link.
 */

import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { applyAnalyticsConsent } from '@/lib/analytics';
import { links } from '@/config/links';
import { LinkedInMessage } from './LinkedInMessage';

describe('LinkedInMessage', () => {
    let gtag: Mock<(...args: unknown[]) => void>;

    beforeEach(() => {
        gtag = vi.fn();
        window.gtag = gtag;
        applyAnalyticsConsent(true);
    });

    it('should link to the LinkedIn profile', () => {
        // Act
        render(<LinkedInMessage />);

        // Assert
        expect(screen.getByRole('link', { name: 'Message me on LinkedIn' }))
            .toHaveAttribute('href', links.social.linkedin);
    });

    it('should open in a new tab without handing over the opener', () => {
        // Act
        render(<LinkedInMessage />);

        // Assert
        const link = screen.getByRole('link', { name: 'Message me on LinkedIn' });

        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should report the outbound click', async () => {
        // Arrange
        render(<LinkedInMessage />);

        // Act
        await userEvent.click(screen.getByRole('link', { name: 'Message me on LinkedIn' }));

        // Assert
        expect(gtag).toHaveBeenCalledWith('event', 'external_link_click', {
            link_url: links.social.linkedin,
            link_text: 'linkedin message',
            event_category: 'outbound_link',
        });
    });
});
