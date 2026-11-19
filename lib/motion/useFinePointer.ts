'use client';

import { FINE_POINTER_QUERY } from './env';
import { useMediaQuery } from './useMediaQuery';

/**
 * Tracks whether the primary pointer can hover precisely.
 *
 * Renders `false` on the server and during hydration, so cursor-only effects
 * never render on the server or flash on touch devices.
 */
export const useFinePointer = () => useMediaQuery(FINE_POINTER_QUERY);
