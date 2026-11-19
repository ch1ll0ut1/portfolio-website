/**
 * Tests for the consent-gated analytics module.
 *
 * Each test re-imports the module, since the consent decision it holds is
 * module state.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CONSENT_KEY, CONSENT_VERSION } from './consentStorage';

const MEASUREMENT_ID = 'G-TEST123';

const loadAnalytics = async () => {
    vi.resetModules();

    return import('./analytics');
};

describe('analytics', () => {
    beforeEach(() => {
        vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', MEASUREMENT_ID);
        window.gtag = undefined;
        window.dataLayer = undefined;
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        localStorage.clear();
        window.gtag = undefined;
        window.dataLayer = undefined;
        window[`ga-disable-${MEASUREMENT_ID}`] = undefined;
    });

    describe('without consent', () => {
        it('should send no event and create no gtag queue', async () => {
            // Arrange
            const { trackExternalLink } = await loadAnalytics();

            // Act
            trackExternalLink('https://example.com', 'example');

            // Assert
            expect(window.gtag).toBeUndefined();
            expect(window.dataLayer).toBeUndefined();
        });

        it('should send no event to an existing gtag once consent is withdrawn', async () => {
            // Arrange
            const { applyAnalyticsConsent, trackConversion } = await loadAnalytics();
            const gtag = vi.fn();

            window.gtag = gtag;
            applyAnalyticsConsent(false);
            gtag.mockClear();

            // Act
            trackConversion.ctaClick('footer', 'cta_section');

            // Assert
            expect(gtag).not.toHaveBeenCalled();
        });
    });

    describe('with consent', () => {
        it('should queue config before the first event, with ad signals off', async () => {
            // Arrange
            const { applyAnalyticsConsent, trackScroll } = await loadAnalytics();

            applyAnalyticsConsent(true);

            // Act
            trackScroll('home', 50);

            // Assert
            const commands = (window.dataLayer ?? []).map(entry => Array.from(entry as ArrayLike<unknown>));

            expect(commands[0]).toEqual(['consent', 'default', {
                analytics_storage: 'granted',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
            }]);
            expect(commands).toContainEqual(['config', MEASUREMENT_ID, {
                allow_google_signals: false,
                allow_ad_personalization_signals: false,
            }]);
            expect(commands.at(-1)).toEqual(['event', 'scroll_depth', {
                page_type: 'home',
                scroll_percentage: 50,
                event_category: 'engagement',
            }]);
        });

        it('should push Arguments objects, which is all gtag.js replays', async () => {
            // Arrange
            const { applyAnalyticsConsent } = await loadAnalytics();

            // Act
            applyAnalyticsConsent(true);

            // Assert
            expect(Object.prototype.toString.call(window.dataLayer?.[0])).toBe('[object Arguments]');
        });

        it('should never send a manual page_view', async () => {
            // Arrange
            const analytics = await loadAnalytics();

            analytics.applyAnalyticsConsent(true);

            // Act
            analytics.trackBlogPost.view();
            analytics.trackTimeOnSite(30);

            // Assert
            const events = (window.dataLayer ?? []).map(entry => Array.from(entry as ArrayLike<unknown>).slice(0, 2));

            expect(events).not.toContainEqual(['event', 'page_view']);
        });

        it('should honour a stored grant before the consent provider has mounted', async () => {
            // Arrange
            localStorage.setItem(CONSENT_KEY, JSON.stringify({ version: CONSENT_VERSION, consent: { analytics: true } }));
            const { trackTimeOnSite } = await loadAnalytics();
            const gtag = vi.fn();

            window.gtag = gtag;

            // Act
            trackTimeOnSite(60);

            // Assert
            expect(gtag).toHaveBeenCalledWith('event', 'engagement_milestone', {
                milestone_seconds: 60,
                event_category: 'engagement',
            });
        });
    });

    describe('without a measurement id', () => {
        it('should leave GA off even with consent', async () => {
            // Arrange
            vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', '');
            const { applyAnalyticsConsent, trackScroll } = await loadAnalytics();

            // Act
            applyAnalyticsConsent(true);
            trackScroll('home', 25);

            // Assert
            expect(window.gtag).toBeUndefined();
        });
    });

    describe('clearAnalyticsCookies', () => {
        it('should delete GA cookies and keep the rest', async () => {
            // Arrange
            const { clearAnalyticsCookies } = await loadAnalytics();

            document.cookie = '_ga=GA1.1.1.1; path=/';
            document.cookie = '_ga_ABC123=GS1.1.1; path=/';
            document.cookie = '_gid=GA1.1.1; path=/';
            document.cookie = 'keep=1; path=/';

            // Act
            clearAnalyticsCookies();

            // Assert
            expect(document.cookie).toBe('keep=1');
            document.cookie = 'keep=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        });
    });
});
