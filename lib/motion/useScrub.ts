'use client';

import { type RefObject, useEffect, useRef } from 'react';
import { type ScrubOptions, registerScrub } from './scrollStore';

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
    const latest = useRef(onProgress);
    const { start, end } = options;

    latest.current = onProgress;

    useEffect(() => {
        const element = ref.current;

        if (!element) {
            return;
        }

        return registerScrub(element, (progress) => {
            latest.current(progress);
        }, { start, end });
    }, [ref, start, end]);
};
