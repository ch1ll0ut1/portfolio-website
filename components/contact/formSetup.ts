'use client';

/**
 * What the contact form needs from the browser before it can be used: a
 * signed token from the server, and the topic from the page's query. Both
 * arrive only once JavaScript runs, which is also what keeps the prerendered
 * form disabled until then.
 */

import { useEffect, useState, useSyncExternalStore } from 'react';
import { type ContactTopic, DEFAULT_CONTACT_TOPIC, isContactTopic } from '@/config/contact';

export type TokenRequest
    = | { status: 'loading' }
      | { status: 'ready'; token: string }
      | { status: 'failed' };

/**
 * Asks the server for a fresh token on mount. The fill time therefore starts
 * when the visitor has the form, not when the HTML was built or cached, and
 * a page restored from an old tab still gets a current token when it mounts.
 */
export const useFormToken = (issueToken: () => Promise<string>): TokenRequest => {
    const [request, setRequest] = useState<TokenRequest>({ status: 'loading' });

    useEffect(() => {
        let current = true;

        issueToken().then(
            (token) => {
                if (current) {
                    setRequest({ status: 'ready', token });
                }
            },
            (error: unknown) => {
                console.error('[contact] Could not fetch a form token:', error);

                if (current) {
                    setRequest({ status: 'failed' });
                }
            },
        );

        return () => {
            current = false;
        };
    }, [issueToken]);

    return request;
};

/**
 * The topic named by `?topic=` (the privacy policy links `?topic=privacy`),
 * read in the browser so the page itself can stay static. The server render
 * and hydration see the default; the query's topic follows right after.
 */
export const useQueryTopic = (): ContactTopic =>
    useSyncExternalStore(subscribeToNothing, readQueryTopic, () => DEFAULT_CONTACT_TOPIC);

/** The query does not change while the form is on screen. */
const subscribeToNothing = () => () => undefined;

const readQueryTopic = () => {
    const topic = new URLSearchParams(window.location.search).get('topic');

    return isContactTopic(topic) ? topic : DEFAULT_CONTACT_TOPIC;
};
