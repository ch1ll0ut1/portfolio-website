'use client';

import { useEffect, useState } from 'react';
import { REDUCED_MOTION_QUERY, prefersReducedMotion, watchMedia } from './env';

/**
 * Tracks the reduced-motion preference.
 *
 * Starts `false` so server and client markup agree, then corrects on mount.
 * Anything that must never animate should also be gated by the `.motion` class
 * the boot script sets, which is correct from the very first paint.
 */
export const useReducedMotion = () => {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        setReduced(prefersReducedMotion());

        return watchMedia(REDUCED_MOTION_QUERY, setReduced);
    }, []);

    return reduced;
};
