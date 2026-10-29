'use client';

import { FC, useEffect } from 'react';
import type { Locale } from '@/lib/i18n/locale';
import { localizedPath } from '@/lib/i18n/paths';
import { NotFoundPanel } from './NotFoundPanel';

/** The panel's words in each language. German addresses the reader as "Sie". */
const COPY: Record<Locale, { kicker: string; title: string; body: string; home: string; retry: string }> = {
    en: {
        kicker: 'Error',
        title: 'Something went wrong',
        body: 'This page failed to load. Trying again usually fixes it; if not, the home page is a safe place to start over.',
        home: 'Back to home',
        retry: 'Try again',
    },
    de: {
        kicker: 'Fehler',
        title: 'Etwas ist schiefgelaufen',
        body: 'Diese Seite konnte nicht geladen werden. Ein neuer Versuch hilft meistens; wenn nicht, können Sie auf der Startseite neu beginnen.',
        home: 'Zur Startseite',
        retry: 'Erneut versuchen',
    },
};

interface Props {
    error: Error & { digest?: string };
    /** Re-renders the segment that failed, from Next's error boundary. */
    onRetry: () => void;
    /** The language of the page that failed; English by default. */
    locale?: Locale;
}

/**
 * The body of the error pages: what went wrong, a retry and a way home.
 *
 * Reuses the not-found panel so a crash reads as part of the site rather than
 * as Next's bare fallback. The error itself is logged rather than shown: its
 * message can carry internals, and in production Next replaces it with a
 * generic one anyway — the digest is what ties it to the server log.
 */
export const ErrorPanel: FC<Props> = ({ error, onRetry, locale = 'en' }) => {
    useEffect(() => {
        console.error(error);
    }, [error]);

    const copy = COPY[locale];

    return (
        <NotFoundPanel
            kicker={error.digest ? `${copy.kicker} ${error.digest}` : copy.kicker}
            title={copy.title}
            body={copy.body}
            actionHref={localizedPath(locale, '/')}
            actionLabel={copy.home}
        >
            <button type="button" className="btn" onClick={onRetry}>
                <span className="btn__label">{copy.retry}</span>
            </button>
        </NotFoundPanel>
    );
};
