/**
 * A hand-cranked `requestAnimationFrame`, so code on the shared ticker can be
 * stepped one frame at a time with a known delta.
 */

import { vi } from 'vitest';

/** One 60fps frame. */
export const FRAME_MS = 16.7;

export const installAnimationFrames = () => {
    let queue: FrameRequestCallback[] = [];
    let now = 1000;

    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
        queue.push(callback);

        return queue.length;
    });
    vi.stubGlobal('cancelAnimationFrame', () => undefined);

    /** Runs `count` frames, each `ms` after the last. */
    const step = (count = 1, ms = FRAME_MS) => {
        for (let index = 0; index < count; index += 1) {
            now += ms;

            const due = queue;

            queue = [];
            due.forEach((callback) => {
                callback(now);
            });
        }
    };

    return {
        step,
        /** Whether anything has asked for another frame. */
        pending: () => queue.length > 0,
        /**
         * Runs whatever is still queued so the ticker sees its last subscriber
         * gone and resets, then puts the real functions back.
         */
        restore: () => {
            for (let guard = 0; guard < 10 && queue.length > 0; guard += 1) {
                step();
            }

            vi.unstubAllGlobals();
        },
    };
};
