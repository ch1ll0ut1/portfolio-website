/**
 * Scroll state and scroll-driven progress, behind one passive listener.
 *
 * Scrubs are evaluated in two passes — every element is measured first, then
 * every callback runs — so a callback that writes styles cannot force a
 * synchronous re-layout for the scrub measured after it.
 */

import { clamp, lerp } from './math';
import { onStage } from './stage';
import { subscribeTick } from './ticker';

export interface ScrollState {
    /** Current scroll offset in px. */
    y: number;
    /** Smoothed velocity in px per frame. Decays to exactly 0 when idle. */
    vy: number;
    /** Maximum scrollable offset. */
    max: number;
    /** Scroll progress through the document, 0..1. */
    p: number;
}

export interface ScrubOptions {
    /** Progress is 0 when the element's top sits at `start` × viewport height. */
    start?: number;
    /** Progress is 1 when the element's bottom sits at `end` × viewport height. */
    end?: number;
}

interface Scrub {
    element: HTMLElement;
    onProgress: (progress: number) => void;
    start: number;
    end: number;
    last: number;
}

const VELOCITY_SMOOTHING = 0.2;
const VELOCITY_EPSILON = 0.01;

export const scrollState: ScrollState = { y: 0, vy: 0, max: 1, p: 0 };

const scrubs = new Set<Scrub>();
const listeners = new Set<(state: ScrollState) => void>();
const dueCallbacks: { scrub: Scrub; progress: number }[] = [];

let viewportHeight = 0;
let started = false;
let queued = false;
let previousY = 0;
let stopVelocity: (() => void) | null = null;

const measure = () => {
    viewportHeight = window.innerHeight;
    scrollState.max = Math.max(1, document.documentElement.scrollHeight - viewportHeight);
};

export const runScrubs = () => {
    dueCallbacks.length = 0;

    // Read pass.
    for (const scrub of scrubs) {
        const rect = scrub.element.getBoundingClientRect();
        const from = viewportHeight * scrub.start;
        const to = viewportHeight * scrub.end;
        const travel = from - to + rect.height;
        const progress = clamp((from - rect.top) / (travel === 0 ? 1 : travel), 0, 1);

        if (progress !== scrub.last) {
            scrub.last = progress;
            dueCallbacks.push({ scrub, progress });
        }
    }

    // Write pass.
    for (const due of dueCallbacks) {
        try {
            due.scrub.onProgress(due.progress);
        }
        catch (error) {
            console.error('[motion] scrub failed', error);
            scrubs.delete(due.scrub);
        }
    }
};

const trackVelocity = () => {
    const y = window.scrollY;

    scrollState.vy = lerp(scrollState.vy, y - previousY, VELOCITY_SMOOTHING);
    previousY = y;

    if (Math.abs(scrollState.vy) < VELOCITY_EPSILON && Math.abs(y - scrollState.y) < 1) {
        scrollState.vy = 0;
        stopVelocity?.();
        stopVelocity = null;
    }
};

const handleScroll = () => {
    if (!queued) {
        queued = true;
        requestAnimationFrame(() => {
            queued = false;
            scrollState.y = window.scrollY;
            scrollState.p = clamp(scrollState.y / scrollState.max, 0, 1);
            runScrubs();

            for (const fn of Array.from(listeners)) {
                try {
                    fn(scrollState);
                }
                catch (error) {
                    console.error('[motion] scroll listener failed', error);
                    listeners.delete(fn);
                }
            }
        });
    }

    stopVelocity ??= subscribeTick(trackVelocity);
};

/** Idempotent, so Strict Mode's double effect cannot attach two listeners. */
export const startScrollStore = () => {
    if (started || typeof window === 'undefined') {
        return;
    }

    started = true;
    previousY = window.scrollY;
    scrollState.y = previousY;
    measure();

    window.addEventListener('scroll', handleScroll, { passive: true });
    const remeasure = () => {
        measure();
        runScrubs();
    };

    window.addEventListener('load', remeasure);
    onStage('layout', remeasure);
};

export const subscribeScroll = (fn: (state: ScrollState) => void) => {
    startScrollStore();
    listeners.add(fn);

    return () => {
        listeners.delete(fn);
    };
};

/**
 * Registers a scroll-driven progress callback.
 *
 * Passing the same value for `start` and `end` tracks a single reading line at
 * that fraction of the viewport rather than a range — the career graph uses it
 * that way to drive its ink reveal.
 */
export const registerScrub = (
    element: HTMLElement,
    onProgress: (progress: number) => void,
    options: ScrubOptions = {},
) => {
    startScrollStore();

    const scrub: Scrub = {
        element,
        onProgress,
        start: options.start ?? 1,
        end: options.end ?? 0,
        last: -1,
    };

    scrubs.add(scrub);
    requestAnimationFrame(runScrubs);

    return () => {
        scrubs.delete(scrub);
    };
};
