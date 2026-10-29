'use client';

import { useEffect, useEffectEvent } from 'react';
import { type ScrollState, subscribeScroll } from './scrollStore';

/**
 * Subscribes to scroll state without re-rendering.
 *
 * Scroll fires far too often to drive React state; the callback writes to the
 * DOM directly instead.
 */
export const useScrollState = (callback: (state: ScrollState) => void) => {
    const onScroll = useEffectEvent(callback);

    useEffect(() => subscribeScroll(onScroll), []);
};
