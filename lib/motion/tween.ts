/**
 * Web Animations wrapper with the design's defaults.
 *
 * Collapses to a zero-duration jump under reduced motion, so callers can await
 * `.finished` without branching on the motion preference.
 */

import { prefersReducedMotion } from './env';

export const EASE = {
    out: 'cubic-bezier(.16,1,.3,1)',
    inOut: 'cubic-bezier(.65,0,.35,1)',
    ui: 'cubic-bezier(.33,1,.68,1)',
} as const;

const DEFAULT_DURATION = 900;

export const tween = (
    element: Element,
    keyframes: Keyframe[] | PropertyIndexedKeyframes,
    options: KeyframeAnimationOptions = {},
) => {
    const resolved: KeyframeAnimationOptions = {
        duration: DEFAULT_DURATION,
        easing: EASE.out,
        fill: 'both',
        ...options,
    };

    if (prefersReducedMotion()) {
        resolved.duration = 0;
    }

    return element.animate(keyframes, resolved);
};
