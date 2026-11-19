/**
 * Tests for the shared animation clock.
 *
 * The behaviour that matters: one loop for the whole page, it stops when idle,
 * and a single broken subscriber cannot take the loop down with it.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { subscribeTick, tickerCount } from './ticker';

describe('motion ticker', () => {
    let frames: FrameRequestCallback[] = [];
    let rafCalls = 0;

    const runFrame = (timestamp: number) => {
        const queued = frames;

        frames = [];
        queued.forEach((fn) => {
            fn(timestamp);
        });
    };

    /**
     * Runs queued frames until none remain. The loop only releases its frame id
     * when a frame actually executes and finds no subscribers, so each test has
     * to let that happen or the module stays armed for the next one.
     */
    const drain = () => {
        let guard = 0;

        while (frames.length > 0 && guard < 10) {
            guard += 1;
            runFrame(guard * 16);
        }
    };

    beforeEach(() => {
        frames = [];
        rafCalls = 0;
        vi.stubGlobal('requestAnimationFrame', (fn: FrameRequestCallback) => {
            rafCalls += 1;
            frames.push(fn);

            return rafCalls;
        });
    });

    afterEach(() => {
        drain();
        vi.unstubAllGlobals();
    });

    it('should run a subscriber on each frame', () => {
        const tick = vi.fn();
        const stop = subscribeTick(tick);

        runFrame(0);
        runFrame(16);

        expect(tick).toHaveBeenCalledTimes(2);
        stop();
    });

    it('should drive many subscribers from a single animation frame loop', () => {
        const a = vi.fn();
        const b = vi.fn();
        const stopA = subscribeTick(a);
        const stopB = subscribeTick(b);

        // One scheduled frame, not one per subscriber.
        expect(rafCalls).toBe(1);

        runFrame(0);

        expect(a).toHaveBeenCalledTimes(1);
        expect(b).toHaveBeenCalledTimes(1);

        stopA();
        stopB();
    });

    it('should stop scheduling frames once the last subscriber leaves', () => {
        const stop = subscribeTick(vi.fn());

        runFrame(0);
        stop();
        // Let the loop observe the empty set and release its frame id.
        runFrame(16);

        const settled = rafCalls;

        runFrame(32);

        expect(rafCalls).toBe(settled);
        expect(tickerCount()).toBe(0);
    });

    it('should clamp the delta so a resumed tab does not jump', () => {
        const deltas: number[] = [];
        const stop = subscribeTick((_now, delta) => {
            deltas.push(delta);
        });

        runFrame(0);
        runFrame(5000);

        expect(deltas[1]).toBeLessThanOrEqual(64);
        stop();
    });

    it('should drop a throwing subscriber and keep the others running', () => {
        const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        const healthy = vi.fn();
        const broken = vi.fn(() => {
            throw new Error('boom');
        });
        const stopBroken = subscribeTick(broken);
        const stopHealthy = subscribeTick(healthy);

        runFrame(0);
        runFrame(16);

        expect(broken).toHaveBeenCalledTimes(1);
        expect(healthy).toHaveBeenCalledTimes(2);

        stopBroken();
        stopHealthy();
        error.mockRestore();
    });
});
