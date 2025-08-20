/**
 * Cookie consent management utilities and context.
 *
 * Provides a lightweight, GDPR-compliant cookie consent management system with:
 * - LocalStorage-based consent persistence with versioning
 * - Google Consent Mode V2 integration for GA4
 * - Granular consent categories (analytics, marketing, preferences, essential)
 * - Automatic consent banner display for new/updated consent versions
 * - Utility functions for conditional event tracking
 *
 * Usage:
 * 1. Wrap your app with ConsentProvider
 * 2. Use useConsent() hook to access consent state and methods
 * 3. Use trackEvent() utility for consent-aware analytics tracking
 */

'use client';

import React, { createContext, useContext, useEffect, useState, type FC, type ReactNode } from 'react';

/**
 * Represents the user's consent preferences for different cookie categories.
 * Essential cookies are always granted as they're required for basic functionality.
 */
export interface ConsentState {
    /** Analytics cookies (Google Analytics, performance monitoring) */
    analytics: boolean;
    /** Marketing cookies (advertising, remarketing, conversion tracking) */
    marketing: boolean;
    /** Preference cookies (language, theme, user settings) */
    preferences: boolean;
    /** Essential cookies (security, authentication, consent storage) - always true */
    essential: boolean;
}

/**
 * Context interface providing consent state and management functions.
 */
interface ConsentContextType {
    /** Current consent state, null if not yet loaded */
    consent: ConsentState | null;
    /** Whether user has made a consent choice (prevents banner on repeat visits) */
    hasConsented: boolean;
    /** Whether consent banner should be displayed */
    showBanner: boolean;
    /** Update specific consent categories */
    updateConsent: (newConsent: Partial<ConsentState>) => void;
    /** Grant consent for all categories */
    acceptAll: () => void;
    /** Deny consent for all non-essential categories */
    rejectAll: () => void;
    /** Hide the consent banner without saving preferences */
    hideBanner: () => void;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

/** LocalStorage key for consent data */
const CONSENT_KEY = 'cookie-consent';

/**
 * Consent schema version - increment to re-prompt users when consent requirements change
 * Format: 'major.minor' where major = breaking changes, minor = additions
 */
const CONSENT_VERSION = '1.0';

/**
 * Default consent state for new users.
 * Only essential cookies are granted by default, all others require explicit consent.
 */
const defaultConsent: ConsentState = {
    analytics: false,
    marketing: false,
    preferences: false,
    essential: true, // Always granted - required for basic functionality
};

interface ConsentProviderProps {
    children: ReactNode;
}

/**
 * ConsentProvider component that manages cookie consent state and Google Consent Mode.
 *
 * Handles:
 * - Loading existing consent from localStorage on mount
 * - Validating consent version compatibility
 * - Displaying consent banner for new/incompatible versions
 * - Saving consent choices with timestamp
 * - Updating Google Consent Mode for GA4 integration
 */
export const ConsentProvider: FC<ConsentProviderProps> = ({ children }) => {
    const [consent, setConsent] = useState<ConsentState | null>(null);
    const [hasConsented, setHasConsented] = useState(false);
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        /**
         * Load existing consent from localStorage on component mount.
         * Shows banner if no valid consent found or version mismatch.
         */
        const loadConsent = () => {
            try {
                const stored = localStorage.getItem(CONSENT_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored) as { version: string; consent: ConsentState };
                    // Check if consent version matches current version
                    if (parsed.version === CONSENT_VERSION) {
                        setConsent(parsed.consent);
                        setHasConsented(true);
                        updateGoogleConsent(parsed.consent);
                        return;
                    }
                }
            }
            catch (error) {
                console.warn('Failed to load consent preferences:', error);
            }

            // No valid consent found - show banner
            setConsent(defaultConsent);
            setShowBanner(true);
        };

        loadConsent();
    }, []);

    /**
     * Updates Google Consent Mode V2 based on user's consent choices.
     * Maps internal consent categories to Google's consent types.
     *
     * @param consentState - User's current consent preferences
     */
    const updateGoogleConsent = (consentState: ConsentState) => {
        if (typeof window !== 'undefined' && 'gtag' in window && typeof window.gtag === 'function') {
            window.gtag('consent', 'update', {
                analytics_storage: consentState.analytics ? 'granted' : 'denied',
                ad_storage: consentState.marketing ? 'granted' : 'denied',
                ad_user_data: consentState.marketing ? 'granted' : 'denied',
                ad_personalization: consentState.marketing ? 'granted' : 'denied',
                personalization_storage: consentState.preferences ? 'granted' : 'denied',
                functionality_storage: 'granted', // Always granted - essential cookies
                security_storage: 'granted', // Always granted - essential cookies
            });
        }
    };

    /**
     * Persists consent choices to localStorage and updates Google Consent Mode.
     * Includes version and timestamp for tracking and migration purposes.
     *
     * @param consentState - The consent state to save
     */
    const saveConsent = (consentState: ConsentState) => {
        try {
            const consentData = {
                consent: consentState,
                version: CONSENT_VERSION,
                timestamp: new Date().toISOString(),
            };
            localStorage.setItem(CONSENT_KEY, JSON.stringify(consentData));
            setConsent(consentState);
            setHasConsented(true);
            updateGoogleConsent(consentState);
        }
        catch (error) {
            console.error('Failed to save consent preferences:', error);
        }
    };

    const updateConsent = (newConsent: Partial<ConsentState>) => {
        if (!consent) return;

        const updatedConsent = {
            ...consent,
            ...newConsent,
            essential: true, // Essential always granted
        };

        saveConsent(updatedConsent);
    };

    const acceptAll = () => {
        const allAccepted: ConsentState = {
            analytics: true,
            marketing: true,
            preferences: true,
            essential: true,
        };
        saveConsent(allAccepted);
        setShowBanner(false);
    };

    const rejectAll = () => {
        const allRejected: ConsentState = {
            analytics: false,
            marketing: false,
            preferences: false,
            essential: true, // Essential always granted
        };
        saveConsent(allRejected);
        setShowBanner(false);
    };

    const hideBanner = () => {
        setShowBanner(false);
    };

    const contextValue: ConsentContextType = {
        consent,
        hasConsented,
        showBanner,
        updateConsent,
        acceptAll,
        rejectAll,
        hideBanner,
    };

    return (
        <ConsentContext.Provider value={contextValue}>
            {children}
        </ConsentContext.Provider>
    );
};

/**
 * Hook to access consent context. Must be used within a ConsentProvider.
 *
 * @returns Consent context with state and management functions
 * @throws Error if used outside ConsentProvider
 */
export const useConsent = (): ConsentContextType => {
    const context = useContext(ConsentContext);
    if (context === undefined) {
        throw new Error('useConsent must be used within a ConsentProvider');
    }
    return context;
};

/**
 * Utility function to check if consent is granted for a specific category.
 *
 * @param type - The consent category to check
 * @param consentState - Current consent state (optional, will check localStorage if not provided)
 * @returns True if consent is granted, false otherwise. Essential is always true.
 */
export const hasConsentFor = (type: keyof ConsentState, consentState?: ConsentState | null): boolean => {
    if (!consentState) return type === 'essential';
    return consentState[type];
};

/**
 * Consent-aware event tracking utility for Google Analytics.
 * Only sends events if analytics consent has been granted.
 *
 * @param eventName - The event name to track
 * @param parameters - Optional event parameters
 *
 * @example
 * ```typescript
 * // Track a button click only if user consented to analytics
 * trackEvent('button_click', { button_name: 'subscribe' });
 * ```
 */
export const trackEvent = (eventName: string, parameters?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && 'gtag' in window && typeof window.gtag === 'function') {
        // Only track if analytics consent is granted
        const stored = localStorage.getItem(CONSENT_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored) as { consent: ConsentState };
                if (parsed.consent.analytics) {
                    window.gtag('event', eventName, parameters);
                }
            }
            catch (error) {
                console.warn('Failed to check consent for event tracking:', error);
            }
        }
    }
};

/**
 * TypeScript declarations for Google Analytics global objects.
 * Extends the Window interface to include gtag function and dataLayer.
 */
declare global {
    interface Window {
        /** Google Analytics 4 global tracking function */
        gtag: (command: string, ...args: unknown[]) => void;
        /** Google Analytics data layer for event queuing */
        dataLayer: unknown[];
    }
}
