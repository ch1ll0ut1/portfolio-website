/**
 * Scroll state and scroll-driven progress, behind one passive listener.
 *
 * Every scroll frame runs in two phases. The read phase measures every scrub
 * and runs every listener's `read`; only then does the write phase run the
 * scrub callbacks and every listener's `write`. Nothing written in a frame can
 * therefore force a synchronous re-layout for something measured after it.
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

/**
 * A scroll listener split by what it touches.
 *
 * `read` may measure layout but must not write styles; `write` may write
 * styles but must not measure. A plain function is a `write`.
 */
export interface ScrollPhases {
    read?: (state: ScrollState) => void;
    write?: (state: ScrollState) => void;
}

export type ScrollListener = ((state: ScrollState) => void) | ScrollPhases;

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
const listeners = new Set<ScrollPhases>();
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

const measureScrubs = () => {
    dueCallbacks.length = 0;

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
};

const flushScrubs = () => {
    for (const due of dueCallbacks) {
        try {
            due.scrub.onProgress(due.progress);
        }
        catch (error) {
            console.error('[motion] scrub failed', error);
            scrubs.delete(due.scrub);
        }
    }

    dueCallbacks.length = 0;
};

/** Measures every scrub, then calls back the ones whose progress changed. */
export const runScrubs = () => {
    measureScrubs();
    flushScrubs();
};

const runPhase = (phase: keyof ScrollPhases) => {
    for (const listener of Array.from(listeners)) {
        try {
            listener[phase]?.(scrollState);
        }
        catch (error) {
            console.error('[motion] scroll listener failed', error);
            listeners.delete(listener);
        }
    }
};

/**
 * One scroll frame: every read (scrubs, then listeners), then every write.
 * Exported for tests; the store runs it once per animation frame on scroll.
 */
export const runScrollFrame = () => {
    scrollState.y = window.scrollY;
    scrollState.p = clamp(scrollState.y / scrollState.max, 0, 1);

    measureScrubs();
    runPhase('read');
    flushScrubs();
    runPhase('write');
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
            runScrollFrame();
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

/**
 * Calls `listener` on every scroll frame. A plain function runs in the write
 * phase, so it must not read layout; pass `{ read, write }` to measure first.
 */
export const subscribeScroll = (listener: ScrollListener) => {
    const phases: ScrollPhases = typeof listener === 'function' ? { write: listener } : { ...listener };

    startScrollStore();
    listeners.add(phases);

    return () => {
        listeners.delete(phases);
    };
};

/** How far outside the viewport a section still counts as near. */
const NEAR_MARGIN = '50% 0px';

/**
 * `subscribeScroll`, but only while `element` is within `margin` of the
 * viewport. A section far off screen costs nothing per scroll frame.
 *
 * On coming near, the listener runs once straight away, so whatever it
 * renders is current before the section can be seen.
 */
export const subscribeScrollWhileNear = (
    element: Element,
    listener: ScrollListener,
    margin: string = NEAR_MARGIN,
) => {
    if (typeof IntersectionObserver === 'undefined') {
        return subscribeScroll(listener);
    }

    const phases: ScrollPhases = typeof listener === 'function' ? { write: listener } : listener;
    let stop: (() => void) | null = null;

    const observer = new IntersectionObserver((entries) => {
        const near = entries.some(entry => entry.isIntersecting);

        if (near && !stop) {
            stop = subscribeScroll(phases);
            phases.read?.(scrollState);
            phases.write?.(scrollState);
        }
        else if (!near && stop) {
            stop();
            stop = null;
        }
    }, { rootMargin: margin });

    observer.observe(element);

    return () => {
        observer.disconnect();
        stop?.();
        stop = null;
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
