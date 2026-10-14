/**
 * Tests for the idle scheduler: nothing runs before the page has loaded, the
 * idle callback is bounded by a timeout, and Safari's missing idle callback
 * falls back to a timer.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { whenIdle } from './whenIdle';

const setReadyState = (state: DocumentReadyState) => {
    Object.defineProperty(document, 'readyState', { value: state, configurable: true });
};

describe('whenIdle', () => {
    let idleCallbacks: IdleRequestCallback[];
    const requestIdle = vi.fn((callback: IdleRequestCallback) => idleCallbacks.push(callback));

    beforeEach(() => {
        idleCallbacks = [];
        vi.useFakeTimers();
        setReadyState('complete');
        requestIdle.mockClear();
        vi.stubGlobal('requestIdleCallback', requestIdle);
        vi.stubGlobal('cancelIdleCallback', vi.fn((handle: number) => {
            idleCallbacks.splice(handle - 1, 1);
        }));
    });

    afterEach(() => {
        Reflect.deleteProperty(document, 'readyState');
        vi.unstubAllGlobals();
        vi.useRealTimers();
    });

    const runIdle = () => {
        idleCallbacks.splice(0).forEach((callback) => {
            callback({ didTimeout: false, timeRemaining: () => 10 });
        });
    };

    it('should run the task on the next idle period once the page has loaded', () => {
        const task = vi.fn();

        whenIdle(task);
        expect(task).not.toHaveBeenCalled();

        runIdle();

        expect(task).toHaveBeenCalledTimes(1);
    });

    it('should bound the wait for an idle period with a timeout', () => {
        whenIdle(vi.fn());

        expect(requestIdle).toHaveBeenCalledWith(expect.any(Function), { timeout: expect.any(Number) });
    });

    it('should wait for the load event before asking for an idle period', () => {
        const task = vi.fn();

        setReadyState('interactive');
        whenIdle(task);

        expect(requestIdle).not.toHaveBeenCalled();

        window.dispatchEvent(new Event('load'));
        runIdle();

        expect(task).toHaveBeenCalledTimes(1);
    });

    it('should never run a task cancelled before the page loaded', () => {
        const task = vi.fn();

        setReadyState('interactive');
        whenIdle(task)();
        window.dispatchEvent(new Event('load'));
        runIdle();

        expect(task).not.toHaveBeenCalled();
    });

    it('should never run a task cancelled while it waits for idle', () => {
        const task = vi.fn();

        whenIdle(task)();
        runIdle();

        expect(task).not.toHaveBeenCalled();
    });

    it('should fall back to a timer where there is no idle callback', () => {
        const task = vi.fn();

        vi.stubGlobal('requestIdleCallback', undefined);
        whenIdle(task);
        expect(task).not.toHaveBeenCalled();

        vi.runAllTimers();

        expect(task).toHaveBeenCalledTimes(1);
    });

    it('should clear the fallback timer when cancelled', () => {
        const task = vi.fn();

        vi.stubGlobal('requestIdleCallback', undefined);
        whenIdle(task)();
        vi.runAllTimers();

        expect(task).not.toHaveBeenCalled();
    });
});
