/**
 * Tests for scroll-driven progress.
 *
 * The progress maths and the read-then-write batching are what matter: a
 * callback that writes styles must not be able to invalidate the measurement
 * of a scrub that has not run yet.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { stubRect } from '../../test/motionEnv';
import { registerScrub, runScrubs } from './scrollStore';

const VIEWPORT = 800;

const makeElement = (rect: Partial<DOMRect>) => {
    const element = document.createElement('div');

    document.body.appendChild(element);
    stubRect(element, rect);

    return element;
};

describe('registerScrub', () => {
    beforeEach(() => {
        window.innerHeight = VIEWPORT;
        document.body.innerHTML = '';
        // Settle the store's cached viewport height before each case.
        const warmup = makeElement({ top: 0, bottom: 0, height: 0 });
        const stop = registerScrub(warmup, () => undefined);

        window.dispatchEvent(new Event('load'));
        stop();
        warmup.remove();
    });

    it('should report 0 when the element has not started travelling', () => {
        const element = makeElement({ top: VIEWPORT, bottom: VIEWPORT + 400, height: 400 });
        const onProgress = vi.fn();
        const stop = registerScrub(element, onProgress);

        runScrubs();

        expect(onProgress).toHaveBeenCalledWith(0);
        stop();
    });

    it('should report 1 once the element has fully travelled', () => {
        const element = makeElement({ top: -400, bottom: 0, height: 400 });
        const onProgress = vi.fn();
        const stop = registerScrub(element, onProgress);

        runScrubs();

        expect(onProgress).toHaveBeenCalledWith(1);
        stop();
    });

    it('should report the midpoint halfway through the travel', () => {
        // travel = viewport - 0 + height = 1200; top of 200 is 600/1200 through.
        const element = makeElement({ top: 200, bottom: 600, height: 400 });
        const onProgress = vi.fn();
        const stop = registerScrub(element, onProgress);

        runScrubs();

        expect(onProgress).toHaveBeenCalledWith(0.5);
        stop();
    });

    it('should clamp progress to the 0..1 range', () => {
        const element = makeElement({ top: -5000, bottom: -4600, height: 400 });
        const onProgress = vi.fn();
        const stop = registerScrub(element, onProgress);

        runScrubs();

        expect(onProgress).toHaveBeenCalledWith(1);
        stop();
    });

    it('should track a single reading line when start equals end', () => {
        // A 400px element against a reading line at 62% of a 800px viewport:
        // progress runs from top=496 (0) to top=96 (1).
        const element = makeElement({ top: 496, bottom: 896, height: 400 });
        const onProgress = vi.fn();
        const stop = registerScrub(element, onProgress, { start: 0.62, end: 0.62 });

        runScrubs();

        expect(onProgress).toHaveBeenCalledWith(0);

        stubRect(element, { top: 296, bottom: 696, height: 400 });
        runScrubs();

        expect(onProgress).toHaveBeenLastCalledWith(0.5);
        stop();
    });

    it('should not call back while progress is unchanged', () => {
        const element = makeElement({ top: 200, bottom: 600, height: 400 });
        const onProgress = vi.fn();
        const stop = registerScrub(element, onProgress);

        runScrubs();
        runScrubs();
        runScrubs();

        expect(onProgress).toHaveBeenCalledTimes(1);
        stop();
    });

    it('should measure every scrub before running any callback', () => {
        const first = makeElement({ top: VIEWPORT, bottom: VIEWPORT + 400, height: 400 });
        const second = makeElement({ top: 200, bottom: 600, height: 400 });
        const secondProgress = vi.fn();

        // A callback that moves a later element must not change what that
        // element reports this frame — all reads happen before any write.
        const stopFirst = registerScrub(first, () => {
            stubRect(second, { top: -400, bottom: 0, height: 400 });
        });
        const stopSecond = registerScrub(second, secondProgress);

        runScrubs();

        expect(secondProgress).toHaveBeenCalledWith(0.5);
        stopFirst();
        stopSecond();
    });

    it('should stop calling back after cleanup', () => {
        const element = makeElement({ top: 200, bottom: 600, height: 400 });
        const onProgress = vi.fn();
        const stop = registerScrub(element, onProgress);

        runScrubs();
        onProgress.mockClear();
        stop();
        stubRect(element, { top: 0, bottom: 400, height: 400 });
        runScrubs();

        expect(onProgress).not.toHaveBeenCalled();
    });

    it('should drop a throwing scrub instead of breaking the others', () => {
        const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        const broken = makeElement({ top: 200, bottom: 600, height: 400 });
        const healthyElement = makeElement({ top: 200, bottom: 600, height: 400 });
        const healthy = vi.fn();
        const stopBroken = registerScrub(broken, () => {
            throw new Error('boom');
        });
        const stopHealthy = registerScrub(healthyElement, healthy);

        runScrubs();

        expect(healthy).toHaveBeenCalledTimes(1);

        stubRect(broken, { top: 0, bottom: 400, height: 400 });
        stubRect(healthyElement, { top: 0, bottom: 400, height: 400 });
        runScrubs();

        expect(healthy).toHaveBeenCalledTimes(2);
        stopBroken();
        stopHealthy();
        error.mockRestore();
    });
});
