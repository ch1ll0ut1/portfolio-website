/**
 * Google Analytics 4, behind the visitor's consent.
 *
 * Every analytics event on the site goes through `track` here, and `track`
 * sends nothing unless analytics consent is granted. The site runs Google's
 * Basic Consent Mode: no gtag.js request is made before consent, so Google
 * receives neither cookies nor cookieless pings from a visitor who has not
 * agreed. The script itself is loaded by `GoogleAnalytics`; this module owns
 * the `gtag` queue, the consent signals and the events.
 *
 * Page views are not sent from here. `gtag('config')` sends the first one,
 * and GA4's enhanced measurement ("page changes based on browser history
 * events", on by default) sends one per App Router navigation, since those
 * are `history.pushState` calls. A manual `page_view` on top would count
 * every page twice.
 */

import { readStoredConsent } from './consentStorage';

type Gtag = (...args: unknown[]) => void;

declare global {
    interface Window {
        gtag?: Gtag;
        dataLayer?: unknown[];
        /** Google's documented opt-out switch: while true, gtag sends nothing for that property. */
        [disableFlag: `ga-disable-${string}`]: boolean | undefined;
    }
}

const DENIED = 'denied';
const GRANTED = 'granted';
const ANALYTICS_COOKIE = /^(_ga(_.+)?|_gid|_gat.*)$/;

/** Set by the consent provider; `null` until it has mounted. */
let analyticsConsent: boolean | null = null;

/** Empty outside deployments that configure GA, which turns GA off entirely. */
export const gaMeasurementId = () => process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? '';

/**
 * Whether analytics may run. Before the consent provider mounts, the stored
 * choice answers, so events fired by effects that run before the provider's
 * own effect are not lost for a returning visitor.
 */
export const hasAnalyticsConsent = () => analyticsConsent ?? readStoredConsent()?.analytics ?? false;

/**
 * Applies a consent decision to Google Analytics.
 *
 * Granting sets up the `gtag` queue (the script reads it once it loads) and
 * clears the opt-out switch. Withdrawing flips the switch so gtag stops
 * sending, signals `analytics_storage: denied`, and deletes the `_ga` cookies
 * already set. Ad signals are never granted: nothing on the site advertises.
 */
export const applyAnalyticsConsent = (granted: boolean) => {
    analyticsConsent = granted;

    const id = gaMeasurementId();

    if (id === '') {
        return;
    }

    window[`ga-disable-${id}`] = !granted;

    if (granted) {
        ensureGtag()?.('consent', 'update', consentSignals(true));

        return;
    }

    // Withdrawing must not create a queue for a script that was never loaded.
    window.gtag?.('consent', 'update', consentSignals(false));
    clearAnalyticsCookies();
};

/** Deletes GA's cookies on this host and on every parent domain GA may have used. */
export const clearAnalyticsCookies = () => {
    const names = document.cookie
        .split(';')
        .map(cookie => cookie.split('=')[0].trim())
        .filter(name => ANALYTICS_COOKIE.test(name));
    const labels = window.location.hostname.split('.');
    const domains = [
        '',
        ...labels.map((_label, index) => `; domain=.${labels.slice(index).join('.')}`),
    ];

    for (const name of names) {
        for (const domain of domains) {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
        }
    }
};

/** Track scroll depth for any page. */
export const trackScroll = (pageType: string, percentage: number) => {
    track('scroll_depth', {
        page_type: pageType,
        scroll_percentage: percentage,
        event_category: 'engagement',
    });
};

/** Track time-based engagement milestones. */
export const trackTimeOnSite = (seconds: number) => {
    track('engagement_milestone', {
        milestone_seconds: seconds,
        event_category: 'engagement',
    });
};

/** Track conversion events (CTA clicks). */
export const trackConversion = {
    ctaClick: (conversionType: string, location: string) => {
        track('conversion', {
            conversion_type: conversionType,
            click_location: location,
            event_category: 'conversion',
        });
    },
};

/** Track external link clicks (including social media). */
export const trackExternalLink = (url: string, linkText: string) => {
    track('external_link_click', {
        link_url: url,
        link_text: linkText,
        event_category: 'outbound_link',
    });
};

/** Blog-specific engagement events. */
export const trackBlogPost = {
    view: () => {
        track('blog_post_view', {
            event_category: 'blog_engagement',
        });
    },

    readComplete: (readingTime: number) => {
        track('blog_post_complete', {
            reading_time: readingTime,
            event_category: 'blog_engagement',
        });
    },

    scroll: (percentage: number) => {
        track('blog_scroll', {
            scroll_percentage: percentage,
            event_category: 'blog_engagement',
        });
    },
};

const track = (eventName: string, parameters: Record<string, unknown>) => {
    if (typeof window === 'undefined' || !hasAnalyticsConsent()) {
        return;
    }

    ensureGtag()?.('event', eventName, parameters);
};

const consentSignals = (analyticsGranted: boolean) => ({
    analytics_storage: analyticsGranted ? GRANTED : DENIED,
    ad_storage: DENIED,
    ad_user_data: DENIED,
    ad_personalization: DENIED,
});

/** Returns the page's `gtag`, creating the queue on first use when GA is configured. */
const ensureGtag = (): Gtag | null => {
    if (window.gtag) {
        return window.gtag;
    }

    const id = gaMeasurementId();

    if (id === '') {
        return null;
    }

    const dataLayer = window.dataLayer ?? [];

    window.dataLayer = dataLayer;

    // gtag.js only replays `Arguments` objects from the data layer, never
    // arrays, so this has to be a classic function pushing `arguments`.
    const gtag: Gtag = function () {
        // eslint-disable-next-line prefer-rest-params
        dataLayer.push(arguments);
    };

    window.gtag = gtag;
    gtag('consent', 'default', consentSignals(true));
    gtag('js', new Date());
    gtag('config', id, {
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
    });

    return gtag;
};
