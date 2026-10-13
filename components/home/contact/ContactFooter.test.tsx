/**
 * Tests for the site footer.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { applyAnalyticsConsent } from '@/lib/analytics';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { links } from '@/config/links';
import { installIntersectionObserver, installMatchMedia } from '../../../test/motionEnv';
import { ConsentProvider } from '@/components/consent/ConsentContext';
import { CookieConsent } from '@/components/consent/CookieConsent';
import { ContactFooter } from './ContactFooter';

/** jsdom cannot navigate, and logs loudly when a test clicks a real link. */
const blockNavigation = () => {
    const handle = (event: Event) => {
        event.preventDefault();
    };

    document.addEventListener('click', handle);

    return () => {
        document.removeEventListener('click', handle);
    };
};

describe('ContactFooter', () => {
    let observers: ReturnType<typeof installIntersectionObserver>;
    let restoreMedia: () => void;
    let gtag: ReturnType<typeof vi.fn>;
    let restoreNavigation: () => void;

    beforeEach(() => {
        observers = installIntersectionObserver();
        restoreMedia = installMatchMedia([]);
        restoreNavigation = blockNavigation();
        gtag = vi.fn();
        window.gtag = gtag as unknown as typeof window.gtag;
        applyAnalyticsConsent(true);
    });

    afterEach(() => {
        observers.restore();
        restoreMedia();
        restoreNavigation();
    });

    it('should point the social links at the configured profiles', () => {
        // Act
        render(<ContactFooter />);

        // Assert
        expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', links.social.github);
        expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', links.social.linkedin);
    });

    it('should point the site links at internal routes', () => {
        // Act
        render(<ContactFooter />);

        // Assert
        expect(screen.getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/blog');
        expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy');
    });

    it('should keep internal links in the same tab', () => {
        // Act
        render(<ContactFooter />);

        // Assert
        expect(screen.getByRole('link', { name: 'Blog' })).not.toHaveAttribute('target');
        expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('target', '_blank');
    });

    it('should offer a way back to the top of the page', () => {
        // Act
        render(<ContactFooter />);

        // Assert
        expect(screen.getByRole('link', { name: 'Back to top' })).toHaveAttribute('href', '#top');
    });

    it('should render the copyright and the colophon', () => {
        // Act
        render(<ContactFooter />);

        // Assert
        expect(screen.getByText('© 2026 Stefan Knoch')).toBeInTheDocument();
        expect(screen.getByText('Hand-written front end: no animation libraries.')).toBeInTheDocument();
    });

    it('should report a click on an external profile', async () => {
        // Arrange
        render(<ContactFooter />);

        // Act
        await userEvent.click(screen.getByRole('link', { name: 'GitHub' }));

        // Assert
        expect(gtag).toHaveBeenCalledWith('event', 'external_link_click', {
            link_url: links.social.github,
            link_text: 'github profile',
            event_category: 'outbound_link',
        });
    });

    it('should not report clicks on internal routes', async () => {
        // Arrange
        render(<ContactFooter />);

        // Act
        await userEvent.click(screen.getByRole('link', { name: 'Blog' }));

        // Assert
        expect(gtag).not.toHaveBeenCalled();
    });

    it('should label the clock with its city', () => {
        // Act
        render(<ContactFooter />);

        // Assert
        expect(screen.getByText(/bangkok/i)).toBeInTheDocument();
    });

    it('should reopen the cookie preferences from a button', async () => {
        // Arrange
        localStorage.setItem('cookie-consent', JSON.stringify({
            version: '2.0',
            consent: { analytics: true, essential: true },
        }));
        render(
            <ConsentProvider>
                <ContactFooter />
                <CookieConsent />
            </ConsentProvider>,
        );

        // Act
        await userEvent.click(screen.getByRole('button', { name: 'Cookie settings' }));

        // Assert
        expect(await screen.findByRole('dialog', { name: 'Cookie preferences' })).toBeInTheDocument();
        expect(screen.getByRole('switch', { name: 'Analytics cookies' })).toBeChecked();
        localStorage.clear();
    });
});
