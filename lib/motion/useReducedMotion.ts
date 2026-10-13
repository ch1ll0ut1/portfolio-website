'use client';

import { REDUCED_MOTION_QUERY } from './env';
import { useMediaQuery } from './useMediaQuery';

/**
 * Tracks the reduced-motion preference.
 *
 * Renders `false` on the server and during hydration, so server and client
 * markup agree, then reports the live preference. Anything that must never
 * animate should also be gated by the `.motion` class the boot script sets,
 * which is correct from the very first paint.
 */
export const useReducedMotion = () => useMediaQuery(REDUCED_MOTION_QUERY);
