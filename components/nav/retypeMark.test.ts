/**
 * Tests for the retype scheduler.
 *
 * The guard against re-entry is the important one: the mark is hovered and
 * focused constantly, and a second run starting mid-sequence would leave
 * letters hidden.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { REDUCED_MOTION_QUERY } from '@/lib/motion';
import { installMatchMedia } from '../../test/motionEnv';
import { createRetype } from './retypeMark';

const TYPING = 'typing';
const GONE = 'gone';

describe('createRetype', () => {
    let restoreMedia: () => void;
    let mark: HTMLElement;
    let letters: HTMLElement[];

    const build = () => createRetype({ mark, letters, typingClass: TYPING, goneClass: GONE });
    const hidden = () => letters.filter(letter => letter.classList.contains(GONE)).length;

    beforeEach(() => {
        vi.useFakeTimers();
        restoreMedia = installMatchMedia([]);
        mark = document.createElement('span');
        letters = ['s', 'k'].map((text) => {
            const letter = document.createElement('span');

            letter.textContent = text;
            mark.appendChild(letter);

            return letter;
        });
        document.body.appendChild(mark);
    });

    afterEach(() => {
        mark.remove();
        restoreMedia();
        vi.useRealTimers();
    });

    it('should delete both letters, retype them and restore the mark', () => {
        const retype = build();

        retype.run();

        expect(mark.classList.contains(TYPING)).toBe(true);
        expect(mark.style.minWidth).not.toBe('');

        vi.advanceTimersByTime(140);
        expect(hidden()).toBe(2);

        vi.advanceTimersByTime(300);
        expect(hidden()).toBe(0);

        vi.advanceTimersByTime(600);
        expect(mark.classList.contains(TYPING)).toBe(false);
        expect(mark.style.minWidth).toBe('');
    });

    it('should ignore a second run while one is in flight', () => {
        const retype = build();

        retype.run();
        vi.advanceTimersByTime(70);
        retype.run();
        vi.advanceTimersByTime(80);

        // A restarted sequence would have re-hidden the first letter here.
        expect(hidden()).toBe(2);

        vi.advanceTimersByTime(1000);
        expect(hidden()).toBe(0);
        expect(mark.classList.contains(TYPING)).toBe(false);
    });

    it('should accept a new run once the previous one finished', () => {
        const retype = build();

        retype.run();
        vi.advanceTimersByTime(1000);
        retype.run();
        vi.advanceTimersByTime(80);

        expect(hidden()).toBe(1);
    });

    it('should restore the mark when cancelled mid-sequence', () => {
        const retype = build();

        retype.run();
        vi.advanceTimersByTime(80);
        retype.cancel();

        expect(hidden()).toBe(0);
        expect(mark.classList.contains(TYPING)).toBe(false);

        vi.advanceTimersByTime(1000);
        expect(hidden()).toBe(0);
    });

    it('should do nothing under reduced motion', () => {
        restoreMedia();
        restoreMedia = installMatchMedia([REDUCED_MOTION_QUERY]);

        const retype = build();

        retype.run();
        vi.advanceTimersByTime(1000);

        expect(hidden()).toBe(0);
        expect(mark.classList.contains(TYPING)).toBe(false);
    });
});
