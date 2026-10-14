/**
 * Page lifecycle signals shared across sections.
 *
 * `intro` fires exactly once, when the page is ready to start its entrance
 * animations: after web fonts settle, or after a failsafe timeout if they never
 * do. `layout` is the "re-measure now" signal — anything that caches a
 * getBoundingClientRect listens to it so font loading and resizes cannot leave
 * measurements stale.
 *
 * The entrance itself is armed before any of this runs. The boot script puts
 * `is-pre` on `<html>` before first paint whenever motion is allowed, and the
 * hero and nav hold their start state off that class, so the finished page is
 * never painted only to be blanked when the intro starts. The class is
 * released here: at once by `startStage` if the entrance cannot play, else
 * straight after the `intro` listeners have started their animations. The
 * hold rules carry their own CSS timeout, so a bundle that never runs cannot
 * leave the page blank either.
 */

import { prefersReducedMotion } from './env';

export type StageEvent = 'intro' | 'layout' | 'resize' | 'theme';

/** Grace period after fonts settle, so the first frame measures final metrics. */
const FONT_SETTLE_MS = 60;
/** Fires the intro even if fonts never resolve, so content never waits forever. */
const INTRO_FAILSAFE_MS = 900;
const RESIZE_DEBOUNCE_MS = 120;
/** Above this scroll offset the entrance is pointless: the hero is behind you. */
const INTRO_SCROLL_LIMIT = 80;
/** Set on `<html>` by `lib/bootScript.ts`. */
const PENDING_CLASS = 'is-pre';

const listeners = new Map<StageEvent, Set<() => void>>();

let introDone = false;
let started = false;

export const onStage = (event: StageEvent, fn: () => void) => {
    const existing = listeners.get(event) ?? new Set<() => void>();

    existing.add(fn);
    listeners.set(event, existing);

    return () => {
        existing.delete(fn);
    };
};

export const emitStage = (event: StageEvent) => {
    const set = listeners.get(event);

    if (!set) {
        return;
    }

    for (const fn of Array.from(set)) {
        try {
            fn();
        }
        catch (error) {
            console.error(`[motion] stage "${event}" listener failed`, error);
        }
    }
};

export const isIntroDone = () => introDone;

/**
 * Whether the page's entrance is still to come: the boot script armed it and
 * nothing has released it yet. Only then may the hero and nav play their
 * entrance, which is also what keeps it from replaying on client navigation.
 */
export const isIntroPending = () => {
    if (typeof document === 'undefined') {
        return false;
    }

    return document.documentElement.classList.contains(PENDING_CLASS);
};

/** Drops the entrance's start state, showing whatever it was holding back. */
export const releaseIntro = () => {
    if (typeof document !== 'undefined') {
        document.documentElement.classList.remove(PENDING_CLASS);
    }
};

const finishIntro = () => {
    if (introDone) {
        return;
    }

    introDone = true;
    document.documentElement.classList.add('is-ready');
    emitStage('layout');
    emitStage('intro');
    // After the listeners, in the same task: they have started animations that
    // hold their own first frame, so dropping the CSS start state paints nothing
    // in between.
    releaseIntro();
};

/**
 * Starts the lifecycle. Idempotent, so a double-invoked effect under Strict
 * Mode cannot register the listeners twice.
 */
export const startStage = () => {
    if (started || typeof window === 'undefined') {
        return;
    }

    started = true;

    // Reduced motion is caught by the boot script already; this also covers a
    // page restored or deep-linked below the hero, where it cannot know yet.
    if (prefersReducedMotion() || window.scrollY >= INTRO_SCROLL_LIMIT) {
        releaseIntro();
    }

    let resizeTimer = 0;

    window.addEventListener('resize', () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
            emitStage('resize');
            emitStage('layout');
        }, RESIZE_DEBOUNCE_MS);
    });

    void document.fonts.ready.then(() => {
        emitStage('layout');
        window.setTimeout(finishIntro, FONT_SETTLE_MS);
    });

    window.setTimeout(finishIntro, INTRO_FAILSAFE_MS);
};
