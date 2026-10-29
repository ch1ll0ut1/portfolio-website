/**
 * Defers low-priority work — warming a lazily loaded chunk, mostly — until the
 * page has finished loading and the main thread has a moment to spare.
 */

/** Longest the idle callback may be put off; an animated page is rarely idle. */
const IDLE_TIMEOUT_MS = 2000;
/** Stand-in for an idle period where the browser has no idle callback (Safari). */
const FALLBACK_DELAY_MS = 1000;

/**
 * Runs `task` once, after the window's `load` event and then on the first idle
 * period, or `IDLE_TIMEOUT_MS` later at the latest. Returns a cancel function
 * that is safe to call at any point, including after the task has run.
 */
export const whenIdle = (task: () => void) => {
    let cancelWait: () => void = () => undefined;

    const schedule = () => {
        // Typed as always present, but Safari has no idle callback.
        if (typeof window.requestIdleCallback === 'function') {
            const handle = window.requestIdleCallback(task, { timeout: IDLE_TIMEOUT_MS });

            cancelWait = () => {
                window.cancelIdleCallback(handle);
            };

            return;
        }

        const timer = window.setTimeout(task, FALLBACK_DELAY_MS);

        cancelWait = () => {
            window.clearTimeout(timer);
        };
    };

    if (document.readyState === 'complete') {
        schedule();
    }
    else {
        window.addEventListener('load', schedule, { once: true });
        cancelWait = () => {
            window.removeEventListener('load', schedule);
        };
    }

    return () => {
        cancelWait();
    };
};
