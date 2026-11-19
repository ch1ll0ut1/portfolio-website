/**
 * Tests for visible-time milestones.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { trackVisibleTime } from './timeTracking';

let hidden = false;

const setHidden = (value: boolean) => {
    hidden = value;
    document.dispatchEvent(new Event('visibilitychange'));
};

describe('trackVisibleTime', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        hidden = false;
        Object.defineProperty(document, 'hidden', { configurable: true, get: () => hidden });
    });

    afterEach(() => {
        vi.useRealTimers();
        Reflect.deleteProperty(document, 'hidden');
    });

    it('should report each milestone once when its visible time has passed', () => {
        // Arrange
        const onMilestone = vi.fn();

        trackVisibleTime([30, 60], onMilestone);

        // Act
        vi.advanceTimersByTime(29_000);

        // Assert
        expect(onMilestone).not.toHaveBeenCalled();

        vi.advanceTimersByTime(31_000);

        expect(onMilestone.mock.calls).toEqual([[30], [60]]);
    });

    it('should not count time while the page is hidden', () => {
        // Arrange
        const onMilestone = vi.fn();

        trackVisibleTime([30], onMilestone);
        vi.advanceTimersByTime(20_000);

        // Act
        setHidden(true);
        vi.advanceTimersByTime(60_000);

        // Assert
        expect(onMilestone).not.toHaveBeenCalled();

        setHidden(false);
        vi.advanceTimersByTime(10_000);

        expect(onMilestone).toHaveBeenCalledWith(30);
    });

    it('should leave no timer or listener behind once the last milestone fired', () => {
        // Arrange
        const onMilestone = vi.fn();
        const removeListener = vi.spyOn(document, 'removeEventListener');

        trackVisibleTime([5], onMilestone);

        // Act
        vi.advanceTimersByTime(5_000);

        // Assert
        expect(vi.getTimerCount()).toBe(0);
        expect(removeListener).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
    });

    it('should stop early when asked', () => {
        // Arrange
        const onMilestone = vi.fn();
        const stop = trackVisibleTime([5], onMilestone);

        // Act
        stop();
        vi.advanceTimersByTime(10_000);

        // Assert
        expect(onMilestone).not.toHaveBeenCalled();
        expect(vi.getTimerCount()).toBe(0);
    });
});
