/**
 * Tests for the page lifecycle's handling of the armed entrance.
 *
 * The boot script puts `is-pre` on <html> before first paint; these pin down
 * who takes it off again and when. The stage is a module singleton, so each
 * test imports a fresh copy.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { installMatchMedia } from '../../test/motionEnv';
import { REDUCED_MOTION_QUERY } from './env';

const html = document.documentElement;

const freshStage = async () => {
    vi.resetModules();

    return import('./stage');
};

/** Runs the font-settle path: `fonts.ready` resolves, then its grace period. */
const runIntro = async () => {
    await vi.advanceTimersByTimeAsync(100);
};

const setScrollY = (value: number) => {
    Object.defineProperty(window, 'scrollY', { value, configurable: true, writable: true });
};

describe('stage: the armed entrance', () => {
    let restoreMedia: () => void = () => undefined;

    beforeEach(() => {
        vi.useFakeTimers();
        setScrollY(0);
        html.classList.add('is-pre');
    });

    afterEach(() => {
        restoreMedia();
        html.classList.remove('is-pre', 'is-ready');
        vi.useRealTimers();
    });

    it('should keep the page armed until the intro, then release it after the listeners ran', async () => {
        restoreMedia = installMatchMedia([]);
        const stage = await freshStage();
        const seenWhileListening = vi.fn();

        stage.onStage('intro', () => {
            seenWhileListening(stage.isIntroPending());
        });
        stage.startStage();

        expect(stage.isIntroPending()).toBe(true);

        await runIntro();

        // The listeners start their entrance while the start state still holds,
        // so nothing is painted between the two.
        expect(seenWhileListening).toHaveBeenCalledWith(true);
        expect(stage.isIntroPending()).toBe(false);
        expect(html).toHaveClass('is-ready');
    });

    it('should release the page at once under reduced motion', async () => {
        restoreMedia = installMatchMedia([REDUCED_MOTION_QUERY]);
        const stage = await freshStage();

        stage.startStage();

        expect(stage.isIntroPending()).toBe(false);
    });

    it('should release the page at once when it loads scrolled past the hero', async () => {
        restoreMedia = installMatchMedia([]);
        setScrollY(400);
        const stage = await freshStage();

        stage.startStage();

        expect(stage.isIntroPending()).toBe(false);
    });

    it('should release the page even if web fonts never settle', async () => {
        restoreMedia = installMatchMedia([]);
        const fonts = document.fonts;

        Object.defineProperty(document, 'fonts', {
            value: { ready: new Promise(() => undefined) },
            configurable: true,
            writable: true,
        });

        const stage = await freshStage();

        stage.startStage();
        await vi.advanceTimersByTimeAsync(1000);

        expect(stage.isIntroPending()).toBe(false);

        Object.defineProperty(document, 'fonts', { value: fonts, configurable: true, writable: true });
    });

    it('should let a section release the page early', async () => {
        restoreMedia = installMatchMedia([]);
        const stage = await freshStage();

        stage.releaseIntro();

        expect(html).not.toHaveClass('is-pre');
    });
});
