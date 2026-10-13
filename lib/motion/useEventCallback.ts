'use client';

import { useCallback, useLayoutEffect, useRef } from 'react';

/**
 * A stable function that always calls the latest `callback`.
 *
 * Stands in for React's `useEffectEvent` until the site is on Next 16: the App
 * Router runs on the React that Next bundles, and no Next 15 release bundles a
 * React that exports it. The swap is one line per call site.
 *
 * Use it for callbacks that only run from effects, ticker and scroll
 * subscriptions or other effect-like code, never during render. The ref is
 * synced in a layout effect, so it is current before any passive effect or
 * subscription of the same commit reads it.
 */
export const useEventCallback = <Args extends unknown[], Result>(
    callback: (...args: Args) => Result,
) => {
    const latest = useRef(callback);

    useLayoutEffect(() => {
        latest.current = callback;
    });

    return useCallback((...args: Args) => latest.current(...args), []);
};
