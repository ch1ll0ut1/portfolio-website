'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Tracks whether a media query matches.
 *
 * Built on `useSyncExternalStore`, so the value is read during render rather
 * than mirrored into state from an effect: no render ever reports an answer
 * the query has already moved past. `serverValue` is what the server renders
 * and what hydration starts from; React then re-renders with the live value if
 * the two disagree, so server and client markup always match.
 */
export const useMediaQuery = (query: string, serverValue = false) => {
    const subscribe = useCallback((onChange: () => void) => {
        const list = window.matchMedia(query);

        list.addEventListener('change', onChange);

        return () => {
            list.removeEventListener('change', onChange);
        };
    }, [query]);

    const getSnapshot = () => window.matchMedia(query).matches;
    const getServerSnapshot = () => serverValue;

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
