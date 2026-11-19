/**
 * Cookie consent state for the whole site.
 *
 * The provider reads the stored choice once hydrated, shows the banner when
 * there is no current one, and hands every decision to `lib/analytics`, which
 * is the only place Google Analytics is switched on or off. The preferences
 * dialog can be reopened at any time, because consent has to be as easy to
 * withdraw as it was to give (GDPR Art. 7(3)).
 */

'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore, type FC, type ReactNode } from 'react';
import { applyAnalyticsConsent } from '@/lib/analytics';
import { readStoredConsent, writeStoredConsent, type ConsentState } from '@/lib/consentStorage';

interface ConsentContextValue {
    /** The current choice; `null` until the stored one has been read. */
    consent: ConsentState | null;
    /** Whether the first-visit banner is up. */
    showBanner: boolean;
    /** Whether the preferences dialog is open. */
    preferencesOpen: boolean;
    /** Records a choice, which also dismisses the banner. */
    updateConsent: (choice: Partial<Pick<ConsentState, 'analytics'>>) => void;
    acceptAll: () => void;
    rejectAll: () => void;
    openPreferences: () => void;
    closePreferences: () => void;
}

/**
 * Window event that opens the preferences dialog. Lets surfaces that live
 * outside the provider's React subtree, or are rendered without it in tests
 * (the footer, the command palette), reopen it without importing the context.
 */
export const OPEN_CONSENT_PREFERENCES_EVENT = 'consent:open-preferences';

/** Opens the cookie preferences dialog from anywhere on the page. */
export const requestConsentPreferences = () => {
    window.dispatchEvent(new Event(OPEN_CONSENT_PREFERENCES_EVENT));
};

const DENIED: ConsentState = { analytics: false, essential: true };
const GRANTED: ConsentState = { analytics: true, essential: true };

/**
 * The stored choice as a primitive, so `useSyncExternalStore` can compare
 * snapshots by value. `pending` is the server's answer: it cannot know the
 * choice, and hydrating with it keeps the two renders in agreement.
 */
type StoredChoice = 'pending' | 'none' | 'granted' | 'denied';

const ConsentContext = createContext<ConsentContextValue | undefined>(undefined);

interface Props {
    children: ReactNode;
}

export const ConsentProvider: FC<Props> = ({ children }) => {
    const stored = useSyncExternalStore(subscribeToNothing, readStoredChoice, readServerChoice);
    /** A choice made on this visit, which holds even when storage refused it. */
    const [chosen, setChosen] = useState<ConsentState | null>(null);
    const [preferencesOpen, setPreferencesOpen] = useState(false);
    const consent = chosen ?? consentFrom(stored);
    const showBanner = chosen === null && stored === 'none';

    useEffect(() => {
        const choice = readStoredConsent();

        if (choice) {
            applyAnalyticsConsent(choice.analytics);
        }
    }, []);

    const openPreferences = useCallback(() => {
        setPreferencesOpen(true);
    }, []);

    const closePreferences = useCallback(() => {
        setPreferencesOpen(false);
    }, []);

    useEffect(() => {
        window.addEventListener(OPEN_CONSENT_PREFERENCES_EVENT, openPreferences);

        return () => {
            window.removeEventListener(OPEN_CONSENT_PREFERENCES_EVENT, openPreferences);
        };
    }, [openPreferences]);

    const save = useCallback((next: ConsentState) => {
        // A choice that cannot be persisted still holds for this visit; the
        // banner will simply ask again next time.
        if (!writeStoredConsent(next)) {
            console.warn('Cookie consent could not be stored; it applies to this visit only.');
        }

        setChosen(next);
        applyAnalyticsConsent(next.analytics);
    }, []);

    const updateConsent = useCallback((choice: Partial<Pick<ConsentState, 'analytics'>>) => {
        save({ analytics: choice.analytics ?? consent?.analytics ?? false, essential: true });
    }, [consent, save]);

    const acceptAll = useCallback(() => {
        save({ analytics: true, essential: true });
    }, [save]);

    const rejectAll = useCallback(() => {
        save(DENIED);
    }, [save]);

    const value = useMemo<ConsentContextValue>(() => ({
        consent,
        showBanner,
        preferencesOpen,
        updateConsent,
        acceptAll,
        rejectAll,
        openPreferences,
        closePreferences,
    }), [consent, showBanner, preferencesOpen, updateConsent, acceptAll, rejectAll, openPreferences, closePreferences]);

    return (
        <ConsentContext.Provider value={value}>
            {children}
        </ConsentContext.Provider>
    );
};

/** Consent state and actions. Must be used inside a `ConsentProvider`. */
export const useConsent = () => {
    const context = useContext(ConsentContext);

    if (context === undefined) {
        throw new Error('useConsent must be used within a ConsentProvider');
    }

    return context;
};

/** Nothing outside this provider writes the record, so there is nothing to subscribe to. */
const subscribeToNothing = () => () => undefined;

const readStoredChoice = (): StoredChoice => {
    const choice = readStoredConsent();

    if (!choice) {
        return 'none';
    }

    return choice.analytics ? 'granted' : 'denied';
};

const readServerChoice = (): StoredChoice => 'pending';

const consentFrom = (stored: StoredChoice): ConsentState | null => {
    switch (stored) {
        case 'pending':
            return null;
        case 'granted':
            return GRANTED;
        case 'none':
        case 'denied':
            return DENIED;
    }
};
