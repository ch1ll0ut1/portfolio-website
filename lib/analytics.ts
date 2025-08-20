/**
 * Analytics tracking utilities for Google Analytics 4.
 * Provides functions for tracking user interactions and engagement.
 */

declare global {
    interface Window {
        gtag: (command: string, ...args: unknown[]) => void;
    }
}

/**
 * Send a tracking event to Google Analytics
 */
const trackEvent = (eventName: string, parameters: Record<string, unknown>) => {
    if (typeof window !== 'undefined') {
        window.gtag('event', eventName, parameters);
    }
};

/**
 * Track page views with context
 */
export const trackPageView = (pageName: string, pageType: 'home' | 'blog' | 'blog_post' | 'privacy', additionalData?: Record<string, unknown>) => {
    trackEvent('page_view', {
        page_name: pageName,
        page_type: pageType,
        ...additionalData,
    });
};

/**
 * Track scroll depth for any page (consolidated)
 */
export const trackScroll = (pageType: string, percentage: number) => {
    trackEvent('scroll_depth', {
        page_type: pageType,
        scroll_percentage: percentage,
        event_category: 'engagement',
    });
};

/**
 * Track time-based engagement milestones
 */
export const trackTimeOnSite = (seconds: number) => {
    trackEvent('engagement_milestone', {
        milestone_seconds: seconds,
        event_category: 'engagement',
    });
};

/**
 * Track conversion events (CTA clicks)
 */
export const trackConversion = {
    ctaClick: (conversionType: string, location: string) => {
        trackEvent('conversion', {
            conversion_type: conversionType,
            click_location: location,
            event_category: 'conversion',
        });
    },
};

/**
 * Track external link clicks (including social media)
 */
export const trackExternalLink = (url: string, linkText: string) => {
    trackEvent('external_link_click', {
        link_url: url,
        link_text: linkText,
        event_category: 'outbound_link',
    });
};

/**
 * Blog-specific tracking functions
 */
export const trackBlogPost = {
    view: () => {
        trackEvent('blog_post_view', {
            event_category: 'blog_engagement',
        });
    },

    readComplete: (readingTime: number) => {
        trackEvent('blog_post_complete', {
            reading_time: readingTime,
            event_category: 'blog_engagement',
        });
    },

    scroll: (percentage: number) => {
        trackEvent('blog_scroll', {
            scroll_percentage: percentage,
            event_category: 'blog_engagement',
        });
    },
};
