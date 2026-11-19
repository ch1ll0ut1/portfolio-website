/**
 * The visitor's stored consent choice.
 *
 * Kept apart from the React context so the analytics module can read the same
 * record before the provider has mounted, and so the parsing can be tested
 * without rendering anything. Storage is untrusted input: it can be missing,
 * corrupt, from an older consent version, or throw outright (Safari private
 * mode, blocked site data), and every one of those reads as "no choice yet".
 */

/**
 * The categories a visitor can decide on. Essential storage is not a choice —
 * it holds this record — so it is fixed to `true`.
 */
export interface ConsentState {
    /** Google Analytics: the gtag.js script and its `_ga` cookies. */
    analytics: boolean;
    essential: true;
}

interface StoredConsent {
    version: string;
    consent: ConsentState;
    timestamp: string;
}

/** The part of a stored record this module relies on when reading it back. */
interface ReadableConsent {
    version: string;
    consent: { analytics: boolean };
}

export const CONSENT_KEY = 'cookie-consent';

/**
 * Bump to re-ask every visitor. 2.0 dropped the Marketing and Preferences
 * categories, so a 1.x "accept all" no longer describes what it agreed to.
 */
export const CONSENT_VERSION = '2.0';

/** Returns the stored choice, or `null` when there is no current, valid one. */
export const readStoredConsent = (): ConsentState | null => {
    let raw: string | null;

    try {
        raw = localStorage.getItem(CONSENT_KEY);
    }
    catch {
        return null;
    }

    if (raw === null) {
        return null;
    }

    const parsed = parseJson(raw);

    if (!isReadableConsent(parsed) || parsed.version !== CONSENT_VERSION) {
        return null;
    }

    return { analytics: parsed.consent.analytics, essential: true };
};

/** Persists a choice. Returns `false` when storage refused it. */
export const writeStoredConsent = (consent: ConsentState) => {
    const record: StoredConsent = {
        version: CONSENT_VERSION,
        consent,
        timestamp: new Date().toISOString(),
    };

    try {
        localStorage.setItem(CONSENT_KEY, JSON.stringify(record));

        return true;
    }
    catch {
        return false;
    }
};

const parseJson = (raw: string): unknown => {
    try {
        return JSON.parse(raw);
    }
    catch {
        return null;
    }
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;

const isReadableConsent = (value: unknown): value is ReadableConsent =>
    isRecord(value)
    && typeof value.version === 'string'
    && isRecord(value.consent)
    && typeof value.consent.analytics === 'boolean';
