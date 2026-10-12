/**
 * A pausable virtual clock for the case illustrations.
 *
 * An illustration script is an async function that awaits `wait(ms)`. Those
 * milliseconds are counted on a clock that only advances while the runner is
 * running, so a script paused halfway through a 900ms type-out resumes exactly
 * where it stopped instead of snapping forward. Web Animations already in
 * flight inside the stage are paused and resumed alongside it.
 *
 * Framework-agnostic on purpose: `CaseVisual` decides *when* to run, this
 * decides *what time means*.
 */

import { subscribeTick } from '@/lib/motion';

export type FrameFn = (delta: number, now: number) => void;

export interface RunnerApi {
    /** Resolves once `ms` of virtual time has passed. Never resolves if disposed. */
    wait: (ms: number) => Promise<void>;
    /** Runs every frame while the runner runs. Returns an unsubscribe. */
    frame: (fn: FrameFn) => () => void;
    /** Virtual time elapsed since the runner first started, in ms. */
    now: () => number;
}

/** Re-invoked in a loop for as long as the runner lives. */
export type IllustrationScript = (api: RunnerApi) => Promise<void>;

export interface Runner {
    /** Starts or pauses the clock. Idempotent. */
    setRunning: (running: boolean) => void;
    /** True while the clock is advancing. */
    isRunning: () => boolean;
    /** Stops for good and drops every pending wait. */
    dispose: () => void;
}

interface Timer {
    at: number;
    resolve: () => void;
}

/** Caps a single step so a long pause cannot jump the narrative forward. */
const MAX_STEP = 40;

/** Element.getAnimations is absent in jsdom, so it is probed rather than trusted. */
const stageAnimations = (stage: Element): Animation[] => (
    'getAnimations' in stage ? stage.getAnimations({ subtree: true }) : []
);

export const createRunner = (stage: Element, script: IllustrationScript): Runner => {
    const frames = new Set<FrameFn>();

    let now = 0;
    let timers: Timer[] = [];
    let unsubscribe: (() => void) | null = null;
    let running = false;
    let started = false;
    let disposed = false;

    const api: RunnerApi = {
        wait: (ms: number) => new Promise<void>((resolve) => {
            if (disposed) {
                return;
            }

            timers.push({ at: now + ms, resolve });
        }),
        frame: (fn: FrameFn) => {
            frames.add(fn);

            return () => {
                frames.delete(fn);
            };
        },
        now: () => now,
    };

    const tick = (_timestamp: number, delta: number) => {
        now += Math.min(delta, MAX_STEP);

        if (timers.length > 0) {
            const due = timers.filter(timer => timer.at <= now);

            if (due.length > 0) {
                timers = timers.filter(timer => timer.at > now);
                due.forEach((timer) => {
                    timer.resolve();
                });
            }
        }

        // Iterate a copy: a frame callback may unsubscribe itself.
        for (const fn of Array.from(frames)) {
            fn(delta, now);
        }
    };

    const run = async () => {
        try {
            for (;;) {
                await script(api);
            }
        }
        catch (error) {
            console.error('[work] illustration script failed', error);
        }
    };

    const setRunning = (next: boolean) => {
        if (disposed || next === running) {
            return;
        }

        running = next;

        if (next) {
            stageAnimations(stage).forEach((animation) => {
                if (animation.playState === 'paused') {
                    animation.play();
                }
            });

            unsubscribe = subscribeTick(tick);

            if (!started) {
                started = true;
                void run();
            }

            return;
        }

        unsubscribe?.();
        unsubscribe = null;

        stageAnimations(stage).forEach((animation) => {
            if (animation.playState === 'running') {
                animation.pause();
            }
        });
    };

    return {
        setRunning,
        isRunning: () => running,
        dispose: () => {
            setRunning(false);
            disposed = true;
            // Dropping the pending waits makes the suspended script unreachable,
            // so it is collected instead of resuming against a detached stage.
            timers = [];
            frames.clear();
        },
    };
};
