/**
 * Tests for the proof marquee's motion: when the row drifts, which way, how it
 * loops, and everything that holds it still.
 *
 * Runs on the real shared ticker with hand-cranked frames, and reads the one
 * thing the engine writes: the track's transform.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FINE_POINTER_QUERY, scrollState } from '@/lib/motion';
import { installAnimationFrames } from '@/test/animationFrames';
import { installIntersectionObserver, installMatchMedia } from '@/test/motionEnv';
import { type MarqueeEngine, startMarquee } from './marqueeEngine';

const LIVE = 'is-live';
/** Half the track: one copy of the names. */
const COPY_WIDTH = 300;

describe('startMarquee', () => {
    let frames: ReturnType<typeof installAnimationFrames>;
    let observers: ReturnType<typeof installIntersectionObserver>;
    let restoreMedia: () => void;
    let root: HTMLElement;
    let viewport: HTMLElement;
    let track: HTMLElement;
    let outside: HTMLButtonElement;
    let engine: MarqueeEngine;

    const offset = () => {
        const match = /translate3d\((-?[\d.]+)px/.exec(track.style.transform);

        return match ? Number(match[1]) : null;
    };

    const setOnScreen = (onScreen: boolean) => {
        observers.instances
            .filter(observer => observer.element === viewport && !observer.disconnected)
            .forEach((observer) => {
                observer.emit(onScreen);
            });
    };

    /** Lets the row reach full speed or full stop, then reports one frame's travel. */
    const settledTravel = () => {
        frames.step(60);

        const before = offset() ?? 0;

        frames.step();

        return (offset() ?? 0) - before;
    };

    beforeEach(() => {
        frames = installAnimationFrames();
        observers = installIntersectionObserver();
        restoreMedia = installMatchMedia([FINE_POINTER_QUERY]);

        root = document.createElement('div');
        viewport = document.createElement('div');
        track = document.createElement('div');
        outside = document.createElement('button');
        viewport.append(track);
        root.append(viewport, document.createElement('button'));
        document.body.append(root, outside);
        Object.defineProperty(track, 'scrollWidth', { configurable: true, value: COPY_WIDTH * 2 });

        engine = startMarquee({ root, viewport, track, liveClass: LIVE });
    });

    afterEach(() => {
        engine.destroy();
        frames.restore();
        observers.restore();
        restoreMedia();
        scrollState.vy = 0;
        Object.defineProperty(document, 'hidden', { configurable: true, value: false });
        document.body.replaceChildren();
    });

    it('should mark the row as live while it runs, and clean up after itself', () => {
        setOnScreen(true);
        frames.step(3);

        expect(viewport).toHaveClass(LIVE);
        expect(track.style.transform).not.toBe('');

        engine.destroy();

        expect(viewport).not.toHaveClass(LIVE);
        expect(track.style.transform).toBe('');
    });

    it('should not move until the row is on screen', () => {
        frames.step(10);

        expect(offset()).toBeNull();
        expect(frames.pending()).toBe(false);
    });

    it('should drift forward, to the left, with the page at rest', () => {
        setOnScreen(true);

        expect(settledTravel()).toBeLessThan(0);
    });

    it('should run faster while the page scrolls, and backwards when it scrolls up', () => {
        setOnScreen(true);

        const idle = settledTravel();

        scrollState.vy = 20;
        const down = settledTravel();

        scrollState.vy = -20;
        const up = settledTravel();

        expect(down).toBeLessThan(idle);
        expect(up).toBeGreaterThan(0);
        expect(up).toBeCloseTo(-down, 5);
    });

    it('should loop within one copy of the names, so the seam never shows', () => {
        setOnScreen(true);
        scrollState.vy = 40;

        for (let lap = 0; lap < 50; lap += 1) {
            frames.step(5, 64);

            const position = offset() ?? 0;

            expect(position).toBeLessThanOrEqual(0);
            expect(position).toBeGreaterThan(-COPY_WIDTH);
        }

        scrollState.vy = -40;

        for (let lap = 0; lap < 50; lap += 1) {
            frames.step(5, 64);

            const position = offset() ?? 0;

            expect(position).toBeLessThanOrEqual(0);
            expect(position).toBeGreaterThan(-COPY_WIDTH);
        }
    });

    it('should stop when it scrolls off screen or the tab is hidden', () => {
        setOnScreen(true);
        frames.step(5);
        setOnScreen(false);
        frames.step(5);

        expect(frames.pending()).toBe(false);

        setOnScreen(true);
        Object.defineProperty(document, 'hidden', { configurable: true, value: true });
        document.dispatchEvent(new Event('visibilitychange'));
        frames.step(5);

        expect(frames.pending()).toBe(false);
    });

    it('should hold still while paused, then ease back up to speed', () => {
        setOnScreen(true);

        const fullSpeed = settledTravel();

        engine.setPaused(true);
        const paused = offset();

        frames.step(10);

        expect(offset()).toBe(paused);

        engine.setPaused(false);
        frames.step();
        const firstStep = (offset() ?? 0) - (paused ?? 0);

        expect(firstStep).toBeLessThan(0);
        expect(Math.abs(firstStep)).toBeLessThan(Math.abs(fullSpeed));
    });

    it('should ease to a stop under a hovering pointer and move again when it leaves', () => {
        setOnScreen(true);
        viewport.dispatchEvent(new Event('pointerenter'));

        expect(settledTravel()).toBe(0);

        viewport.dispatchEvent(new Event('pointerleave'));

        expect(settledTravel()).toBeLessThan(0);
    });

    it('should hold still while focus is inside the row, including moves within it', () => {
        setOnScreen(true);

        const [, control] = Array.from(root.children);

        root.dispatchEvent(new FocusEvent('focusin'));
        root.dispatchEvent(new FocusEvent('focusout', { relatedTarget: control ?? null }));

        expect(settledTravel()).toBe(0);

        root.dispatchEvent(new FocusEvent('focusout', { relatedTarget: outside }));

        expect(settledTravel()).toBeLessThan(0);
    });
});
