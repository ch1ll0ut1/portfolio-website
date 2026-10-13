'use client';

import { type RefObject, useEffect } from 'react';
import { type ScrubOptions, registerScrub } from './scrollStore';
import { useEventCallback } from './useEventCallback';

/**
 * Drives a callback from an element's progress through the viewport.
 *
 * The callback receives 0..1 and should only write transforms, opacity,
 * clip-path or custom properties feeding those.
 */
export const useScrub = (
    ref: RefObject<HTMLElement | null>,
    onProgress: (progress: number) => void,
    options: ScrubOptions = {},
) => {
    const progress = useEventCallback(onProgress);
    const { start, end } = options;

    useEffect(() => {
        const element = ref.current;

        if (!element) {
            return;
        }

        return registerScrub(element, progress, { start, end });
    }, [ref, start, end, progress]);
};
