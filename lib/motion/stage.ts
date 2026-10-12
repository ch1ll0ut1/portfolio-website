/**
 * Page lifecycle signals shared across sections.
 *
 * `intro` fires exactly once, when the page is ready to start its entrance
 * animations: after web fonts settle, or after a failsafe timeout if they never
 * do. `layout` is the "re-measure now" signal — anything that caches a
 * getBoundingClientRect listens to it so font loading and resizes cannot leave
 * measurements stale.
 */

export type StageEvent = 'intro' | 'layout' | 'resize' | 'theme';

/** Grace period after fonts settle, so the first frame measures final metrics. */
const FONT_SETTLE_MS = 60;
/** Fires the intro even if fonts never resolve, so content never waits forever. */
const INTRO_FAILSAFE_MS = 900;
const RESIZE_DEBOUNCE_MS = 120;

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

const finishIntro = () => {
    if (introDone) {
        return;
    }

    introDone = true;
    document.documentElement.classList.add('is-ready');
    emitStage('layout');
    emitStage('intro');
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
