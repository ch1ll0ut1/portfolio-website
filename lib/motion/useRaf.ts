'use client';

import { useEffect, useEffectEvent } from 'react';
import { type TickFn, subscribeTick } from './ticker';

/**
 * Runs a callback on the shared animation clock while `enabled` is true.
 *
 * Unsubscribing is what stops the loop, so anything off-screen or in a hidden
 * tab should set `enabled` to false rather than idling inside the callback.
 */
export const useRaf = (callback: TickFn, enabled = true) => {
    const tick = useEffectEvent(callback);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        return subscribeTick(tick);
    }, [enabled]);
};
