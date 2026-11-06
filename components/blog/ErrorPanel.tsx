'use client';

import { FC, useEffect } from 'react';
import type { ErrorsCopy } from '@/config/errors/types';
import type { Locale } from '@/lib/i18n/locale';
import { localizedPath } from '@/lib/i18n/paths';
import { NotFoundPanel } from './NotFoundPanel';

interface Props {
    error: Error & { digest?: string };
    /** Re-renders the segment that failed, from Next's error boundary. */
    onRetry: () => void;
    /** The panel's words, in the language of the page that failed. */
    copy: ErrorsCopy['error'];
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
 *
 * Its words come in as `copy`: each language's error page imports only its
 * own dictionary.
 */
export const ErrorPanel: FC<Props> = ({ error, onRetry, copy, locale = 'en' }) => {
    useEffect(() => {
        console.error(error);
    }, [error]);

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
