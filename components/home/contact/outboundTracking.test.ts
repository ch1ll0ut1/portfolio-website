/**
 * Tests for the section's outbound-link analytics handlers.
 */

import { type MouseEvent } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { applyAnalyticsConsent } from '@/lib/analytics';
import { conversionHandlers, externalLinkHandlers } from './outboundTracking';

const auxClick = (button: number) => ({ button }) as MouseEvent<HTMLAnchorElement>;

describe('conversionHandlers', () => {
    let gtag: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        gtag = vi.fn();
        vi.stubGlobal('gtag', gtag);
        window.gtag = gtag as unknown as typeof window.gtag;
        applyAnalyticsConsent(true);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('should report a conversion on a normal click', () => {
        // Act
        conversionHandlers('footer', 'cta_section').onClick();

        // Assert
        expect(gtag).toHaveBeenCalledWith('event', 'conversion', {
            conversion_type: 'footer',
            click_location: 'cta_section',
            event_category: 'conversion',
        });
    });

    it('should report a conversion when the link is middle-clicked into a new tab', () => {
        // Act
        conversionHandlers('footer', 'cta_section').onAuxClick(auxClick(1));

        // Assert
        expect(gtag).toHaveBeenCalledTimes(1);
    });

    it('should ignore a right-click, which opens a menu rather than the link', () => {
        // Act
        conversionHandlers('footer', 'cta_section').onAuxClick(auxClick(2));

        // Assert
        expect(gtag).not.toHaveBeenCalled();
    });
});

describe('externalLinkHandlers', () => {
    let gtag: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        gtag = vi.fn();
        window.gtag = gtag as unknown as typeof window.gtag;
        applyAnalyticsConsent(true);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('should report the destination and the label', () => {
        // Act
        externalLinkHandlers('https://github.com/ch1ll0ut1', 'github profile').onClick();

        // Assert
        expect(gtag).toHaveBeenCalledWith('event', 'external_link_click', {
            link_url: 'https://github.com/ch1ll0ut1',
            link_text: 'github profile',
            event_category: 'outbound_link',
        });
    });

    it('should report a middle-click but not a right-click', () => {
        // Arrange
        const handlers = externalLinkHandlers('https://example.com', 'example');

        // Act
        handlers.onAuxClick(auxClick(2));
        handlers.onAuxClick(auxClick(1));

        // Assert
        expect(gtag).toHaveBeenCalledTimes(1);
    });
});
