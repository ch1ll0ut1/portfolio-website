/**
 * The featured card's border trace.
 *
 * A caret-coloured outline is drawn clockwise exactly once as the card arrives:
 * a `clip-path` wedge anchored at the card's centre sweeps from the top centre
 * out to each corner in turn and back again, then the outline settles to its
 * resting opacity.
 *
 * Framework-agnostic: it is handed the element and returns a canceller.
 *
 * The vertex count is constant across every keyframe — five travelling points
 * plus the anchor — because `clip-path` only interpolates between polygons with
 * the same number of vertices. Points that have already reached their corner
 * stay there while the rest ride the leading edge.
 *
 * Each leg's share of the duration is its edge length over the perimeter, so
 * the outline is drawn at a constant speed on any card shape.
 */

import { EASE, prefersReducedMotion, tween } from '@/lib/motion';

export interface BorderTraceOptions {
    /** Wait before the first vertex leaves the top centre, in ms. */
    delay?: number;
    /** Time for one full lap, in ms. */
    duration?: number;
    /** Opacity the outline settles on. Matches the stylesheet's resting value. */
    restOpacity?: number;
}

const DEFAULT_DELAY_MS = 440;
const DEFAULT_DURATION_MS = 1500;
const SETTLE_DURATION_MS = 900;
const DEFAULT_REST_OPACITY = 0.5;

/** Clockwise from the top centre, back to the top centre. */
const CORNERS = ['50% 0%', '100% 0%', '100% 100%', '0% 100%', '0% 0%', '50% 0%'] as const;
const TRAVELLERS = [1, 2, 3, 4, 5] as const;

/**
 * The polygon after `stage` corners have been reached. Points that are still
 * behind the frontier are parked on it, which keeps the wedge convex.
 */
const frameAt = (stage: number) => {
    const points = TRAVELLERS.map(index => CORNERS[Math.min(index, stage)]);

    return `polygon(50% 50%, 50% 0%, ${points.join(', ')})`;
};

export const runBorderTrace = (trace: HTMLElement, options: BorderTraceOptions = {}) => {
    const noop = () => undefined;

    if (prefersReducedMotion()) {
        return noop;
    }

    const width = trace.offsetWidth || 1;
    const height = trace.offsetHeight || 1;
    const perimeter = 2 * (width + height);
    // Top-right half, right edge, bottom edge, left edge, top-left half.
    const legs = [width / 2, height, width, height, width / 2];

    const keyframes: Keyframe[] = [{ clipPath: frameAt(0), opacity: 1, offset: 0 }];
    let travelled = 0;

    legs.forEach((leg, index) => {
        travelled += leg;
        keyframes.push({
            clipPath: frameAt(index + 1),
            opacity: 1,
            offset: travelled / perimeter,
        });
    });

    // Guard against float drift leaving the last offset just shy of 1.
    const last = keyframes.at(-1);

    if (last) {
        last.offset = 1;
    }

    const lap = tween(trace, keyframes, {
        duration: options.duration ?? DEFAULT_DURATION_MS,
        easing: EASE.inOut,
        delay: options.delay ?? DEFAULT_DELAY_MS,
        fill: 'backwards',
    });

    let settle: Animation | null = null;

    lap.finished
        .then(() => {
            // `fill: 'none'` on purpose: the resting opacity is the
            // stylesheet's, so the animation hands the property back when it
            // ends instead of pinning it for the life of the page.
            settle = tween(trace, [
                { opacity: 1 },
                { opacity: options.restOpacity ?? DEFAULT_REST_OPACITY },
            ], { duration: SETTLE_DURATION_MS, easing: EASE.ui, fill: 'none' });
        })
        .catch(() => {
            // Cancelled by teardown.
        });

    return () => {
        lap.cancel();
        settle?.cancel();
    };
};
