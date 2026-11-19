/**
 * Tests for the illustrations' virtual clock.
 *
 * The point of the runner is that time is *not* wall time: it advances only
 * while the illustration is running, so a paused script resumes exactly where
 * it stopped. These tests drive the shared animation clock by hand and check
 * that nothing moves while paused.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRunner } from './runner';

describe('createRunner', () => {
    let frames: FrameRequestCallback[] = [];
    let clock = 0;
    let stage: HTMLElement;
    let originalRaf: typeof globalThis.requestAnimationFrame;

    const runFrame = (timestamp: number) => {
        const queued = frames;

        frames = [];
        queued.forEach((fn) => {
            fn(timestamp);
        });
    };

    /** Runs `count` animation frames, 16ms apart. */
    const advance = (count: number) => {
        for (let i = 0; i < count; i++) {
            clock += 16;
            runFrame(clock);
        }
    };

    /** Lets any promise continuations queued by a frame actually run. */
    const settle = async () => {
        await Promise.resolve();
        await Promise.resolve();
    };

    beforeEach(() => {
        frames = [];
        stage = document.createElement('div');
        originalRaf = globalThis.requestAnimationFrame;
        globalThis.requestAnimationFrame = vi.fn((fn: FrameRequestCallback) => {
            frames.push(fn);

            return frames.length;
        });
    });

    afterEach(() => {
        // Let the shared ticker notice it has no subscribers left.
        advance(2);
        globalThis.requestAnimationFrame = originalRaf;
    });

    it('should not start the script until it is told to run', () => {
        // Arrange
        const started = vi.fn();
        const runner = createRunner(stage, async (api) => {
            started();
            await api.wait(100);
        });

        // Act
        advance(4);

        // Assert
        expect(started).not.toHaveBeenCalled();
        expect(runner.isRunning()).toBe(false);

        runner.dispose();
    });

    it('should resolve a wait once enough virtual time has passed', async () => {
        // Arrange
        const reached = vi.fn();
        const runner = createRunner(stage, async (api) => {
            await api.wait(100);
            reached();
            await api.wait(10_000);
        });

        // Act
        runner.setRunning(true);
        advance(3);
        await settle();

        // Assert
        expect(reached).not.toHaveBeenCalled();

        // Act
        advance(5);
        await settle();

        // Assert
        expect(reached).toHaveBeenCalledTimes(1);

        runner.dispose();
    });

    it('should stop advancing while paused and continue where it left off', async () => {
        // Arrange
        const reached = vi.fn();
        const runner = createRunner(stage, async (api) => {
            await api.wait(100);
            reached();
            await api.wait(10_000);
        });

        // Act
        runner.setRunning(true);
        advance(3);
        await settle();
        runner.setRunning(false);
        advance(20);
        await settle();

        // Assert
        expect(runner.isRunning()).toBe(false);
        expect(reached).not.toHaveBeenCalled();

        // Act
        runner.setRunning(true);
        advance(5);
        await settle();

        // Assert
        expect(reached).toHaveBeenCalledTimes(1);

        runner.dispose();
    });

    it('should report the virtual time it has accumulated', async () => {
        // Arrange
        let elapsed = -1;
        const runner = createRunner(stage, async (api) => {
            await api.wait(100);
            elapsed = api.now();
            await api.wait(10_000);
        });

        // Act
        runner.setRunning(true);
        advance(8);
        await settle();

        // Assert: a 16ms frame cannot land exactly on 100.
        expect(elapsed).toBeGreaterThanOrEqual(100);
        expect(elapsed).toBeLessThan(140);

        runner.dispose();
    });

    it('should run frame callbacks only while running', () => {
        // Arrange
        const onFrame = vi.fn();
        const runner = createRunner(stage, async (api) => {
            api.frame(onFrame);
            await api.wait(10_000);
        });

        // Act
        runner.setRunning(true);
        advance(3);

        // Assert
        expect(onFrame).toHaveBeenCalledTimes(3);

        // Act
        runner.setRunning(false);
        advance(5);

        // Assert
        expect(onFrame).toHaveBeenCalledTimes(3);

        runner.dispose();
    });

    it('should drop pending waits on dispose so the script never resumes', async () => {
        // Arrange
        const reached = vi.fn();
        const runner = createRunner(stage, async (api) => {
            await api.wait(100);
            reached();
        });

        // Act
        runner.setRunning(true);
        advance(2);
        runner.dispose();
        advance(20);
        await settle();

        // Assert
        expect(reached).not.toHaveBeenCalled();
        expect(runner.isRunning()).toBe(false);
    });

    it('should ignore being started again after dispose', () => {
        // Arrange
        const runner = createRunner(stage, async (api) => {
            await api.wait(100);
        });

        // Act
        runner.dispose();
        runner.setRunning(true);

        // Assert
        expect(runner.isRunning()).toBe(false);
    });
});
