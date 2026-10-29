'use client';

import { FC, useEffect } from 'react';
import { NotFoundPanel } from './NotFoundPanel';

interface Props {
    error: Error & { digest?: string };
    /** Re-renders the segment that failed, from Next's error boundary. */
    onRetry: () => void;
}

/**
 * The body of the error pages: what went wrong, a retry and a way home.
 *
 * Reuses the not-found panel so a crash reads as part of the site rather than
 * as Next's bare fallback. The error itself is logged rather than shown: its
 * message can carry internals, and in production Next replaces it with a
 * generic one anyway — the digest is what ties it to the server log.
 */
export const ErrorPanel: FC<Props> = ({ error, onRetry }) => {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <NotFoundPanel
            kicker={error.digest ? `Error ${error.digest}` : 'Error'}
            title="Something went wrong"
            body="This page failed to load. Trying again usually fixes it; if not, the home page is a safe place to start over."
            actionHref="/"
            actionLabel="Back to home"
        >
            <button type="button" className="btn" onClick={onRetry}>
                <span className="btn__label">Try again</span>
            </button>
        </NotFoundPanel>
    );
};
