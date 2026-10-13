'use client';

import { type RefObject, useEffect } from 'react';
import { type TickFn, subscribeTick } from './ticker';
import { useEventCallback } from './useEventCallback';

/**
 * Runs a callback on the shared animation clock while `enabled` is true.
 *
 * Unsubscribing is what stops the loop, so anything off-screen or in a hidden
 * tab should set `enabled` to false rather than idling inside the callback.
 */
export const useRaf = (callback: TickFn, enabled = true) => {
    const tick = useEventCallback(callback);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        return subscribeTick(tick);
    }, [enabled, tick]);
};

/** Pauses a shared-clock callback while the element is off-screen or the tab is hidden. */
export const useVisibleRaf = (
    ref: RefObject<HTMLElement | null>,
    callback: TickFn,
    threshold = 0,
) => {
    const tick = useEventCallback(callback);

    useEffect(() => {
        const element = ref.current;

        if (!element) {
            return;
        }

        let stop: (() => void) | null = null;
        let onScreen = false;

        const sync = () => {
            const shouldRun = onScreen && !document.hidden;

            if (shouldRun && !stop) {
                stop = subscribeTick(tick);
            }
            else if (!shouldRun && stop) {
                stop();
                stop = null;
            }
        };

        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                onScreen = entry.isIntersecting;
            }

            sync();
        }, { threshold });

        observer.observe(element);
        document.addEventListener('visibilitychange', sync);

        return () => {
            observer.disconnect();
            document.removeEventListener('visibilitychange', sync);
            stop?.();
        };
    }, [ref, threshold, tick]);
};
