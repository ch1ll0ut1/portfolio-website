/**
 * Tests for the pointer magnet.
 *
 * What matters: it pulls the element toward the pointer and back to rest,
 * through `transform` when easing and through `--bx` / `--by` when springing;
 * it stops the clock at rest; and it does nothing on coarse pointers or under
 * reduced motion. Frames are stepped by hand through a stubbed
 * requestAnimationFrame, so nothing depends on real timing.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { type FC, useRef } from 'react';
import { installMatchMedia, stubRect } from '../../test/motionEnv';
import { FINE_POINTER_QUERY, REDUCED_MOTION_QUERY } from './env';
import { tickerCount } from './ticker';
import { type MagnetOptions, useMagnet } from './useMagnet';

const Probe: FC<{ options?: MagnetOptions }> = ({ options }) => {
    const ref = useRef<HTMLButtonElement>(null);

    useMagnet(ref, options);

    return <button ref={ref} type="button">Book</button>;
};

let frames: FrameRequestCallback[] = [];
let now = 0;
let restoreMedia: () => void = () => undefined;

const runFrames = (count: number) => {
    for (let index = 0; index < count && frames.length > 0; index++) {
        const queued = frames;

        frames = [];
        now += 16;
        queued.forEach((fn) => {
            fn(now);
        });
    }
};

/** Renders the probe with a 100x40 button whose centre is at (50, 20). */
const renderMagnet = (options?: MagnetOptions) => {
    const view = render(<Probe options={options} />);
    const button = view.getByRole('button');

    stubRect(button, { left: 0, top: 0, width: 100, height: 40 });

    return button;
};

// jsdom has no PointerEvent; a MouseEvent carries the same coordinates.
const pointAt = (element: HTMLElement, clientX: number, clientY: number) => {
    element.dispatchEvent(new MouseEvent('pointermove', { clientX, clientY }));
};

const leave = (element: HTMLElement) => {
    element.dispatchEvent(new MouseEvent('pointerleave'));
};

describe('useMagnet', () => {
    beforeEach(() => {
        frames = [];
        vi.stubGlobal('requestAnimationFrame', (fn: FrameRequestCallback) => {
            frames.push(fn);

            return frames.length;
        });
        restoreMedia = installMatchMedia([FINE_POINTER_QUERY]);
    });

    afterEach(() => {
        cleanup();
        // Let the shared loop see it has no subscribers and release its frame.
        runFrames(5);
        restoreMedia();
        vi.unstubAllGlobals();
    });

    describe('ease', () => {
        it('should pull the element toward the pointer by the given strength', () => {
            const button = renderMagnet({ strength: 0.5 });

            pointAt(button, 150, 20);
            runFrames(200);

            expect(button.style.transform).toBe('translate3d(50.00px, 0.00px, 0)');
        });

        it('should return to rest, clear its transform and stop the clock on leave', () => {
            const button = renderMagnet();

            pointAt(button, 150, 60);
            runFrames(10);
            leave(button);
            runFrames(200);

            expect(button.style.transform).toBe('');
            expect(tickerCount()).toBe(0);
        });

        it('should clear its transform on unmount', () => {
            const button = renderMagnet();

            pointAt(button, 150, 60);
            runFrames(10);
            cleanup();

            expect(button.style.transform).toBe('');
            expect(tickerCount()).toBe(0);
        });
    });

    describe('spring', () => {
        it('should write the pull to custom properties, not the transform', () => {
            const button = renderMagnet({ kind: 'spring', strength: 0.5 });

            pointAt(button, 150, 20);
            runFrames(400);

            expect(button.style.getPropertyValue('--bx')).toBe('50.00px');
            expect(button.style.getPropertyValue('--by')).toBe('0.00px');
            expect(button.style.transform).toBe('');
        });

        it('should overshoot the target before it settles', () => {
            const button = renderMagnet({ kind: 'spring', strength: 0.5 });
            let furthest = 0;

            pointAt(button, 150, 20);

            for (let frame = 0; frame < 60; frame++) {
                runFrames(1);
                furthest = Math.max(furthest, parseFloat(button.style.getPropertyValue('--bx')));
            }

            expect(furthest).toBeGreaterThan(50);
        });

        it('should come back to 0px and stop the clock on leave', () => {
            const button = renderMagnet({ kind: 'spring' });

            pointAt(button, 150, 60);
            runFrames(20);
            leave(button);
            runFrames(600);

            expect(button.style.getPropertyValue('--bx')).toBe('0px');
            expect(button.style.getPropertyValue('--by')).toBe('0px');
            expect(tickerCount()).toBe(0);
        });
    });

    it('should do nothing on a coarse pointer', () => {
        restoreMedia();
        restoreMedia = installMatchMedia([]);

        const button = renderMagnet();

        pointAt(button, 150, 60);
        runFrames(10);

        expect(button.style.transform).toBe('');
        expect(tickerCount()).toBe(0);
    });

    it('should do nothing under reduced motion', () => {
        restoreMedia();
        restoreMedia = installMatchMedia([FINE_POINTER_QUERY, REDUCED_MOTION_QUERY]);

        const button = renderMagnet({ kind: 'spring' });

        pointAt(button, 150, 60);
        runFrames(10);

        expect(button.style.getPropertyValue('--bx')).toBe('');
        expect(tickerCount()).toBe(0);
    });
});
