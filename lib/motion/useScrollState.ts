'use client';

import { useEffect } from 'react';
import { type ScrollState, subscribeScroll } from './scrollStore';
import { useEventCallback } from './useEventCallback';

/**
 * Subscribes to scroll state without re-rendering.
 *
 * Scroll fires far too often to drive React state; the callback writes to the
 * DOM directly instead.
 */
export const useScrollState = (callback: (state: ScrollState) => void) => {
    const onScroll = useEventCallback(callback);

    useEffect(() => subscribeScroll(onScroll), [onScroll]);
};
