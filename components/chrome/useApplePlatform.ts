'use client';

import { useSyncExternalStore } from 'react';
import { isApplePlatform } from './isApplePlatform';

/**
 * Whether to print shortcuts with ⌘ rather than Ctrl, safe to call in render.
 *
 * The platform never changes during a visit, so there is nothing to subscribe
 * to; `useSyncExternalStore` is here for its hydration contract. The server
 * renders the ⌘ spelling the nav has always shipped with, and React swaps in
 * Ctrl straight after hydration elsewhere, without a state update from an
 * effect.
 */
export const useApplePlatform = () => useSyncExternalStore(subscribeNever, isApplePlatform, assumeApple);

const subscribeNever = () => () => undefined;

const assumeApple = () => true;
