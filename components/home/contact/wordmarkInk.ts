/**
 * Cursor proximity for the footer wordmark.
 *
 * Letters near the pointer ink in and thicken on the variable font's weight and
 * width axes, falling off as a Gaussian so the effect has no visible edge. Each
 * letter lerps towards its own target on the shared ticker, and the subscription
 * drops itself the moment every letter has settled, so an untouched footer costs
 * nothing.
 *
 * Fine pointers only — the caller decides that. Letter widths are frozen by
 * `wordmarkFit`, so the weight changes here cannot reflow the line.
 */

import { lerp, onStage, subscribeScroll, subscribeTick } from '@/lib/motion';

/** Falloff radius, as a multiple of a letter's own width. */
const RADIUS_SCALE = 1.6;
/** Vertical falloff is slacker, so the effect survives a cursor above the word. */
const VERTICAL_SLACK = 1.4;
/** Fallback radius when no letter has been measured yet. */
const FALLBACK_WIDTH = 100;
const EASE = 0.14;
/** Below this, a letter is close enough to its target to snap and stop. */
const SETTLED = 0.003;

const BASE_WIDTH = 80;
const WIDTH_RANGE = 5;
const BASE_WEIGHT = 620;
const WEIGHT_RANGE = 180;

interface LetterState {
    /** Current value, 0..1. */
    value: number;
    /** Target value, 0..1. */
    target: number;
}

interface Centre {
    x: number;
    y: number;
    width: number;
}

export interface WordmarkInkTargets {
    /** The element whose pointer movement drives the effect. */
    area: HTMLElement;
    /** The letter spans, in reading order. */
    letters: HTMLElement[];
}

const write = (letter: HTMLElement, value: number) => {
    const width = (BASE_WIDTH - value * WIDTH_RANGE).toFixed(1);
    const weight = (BASE_WEIGHT + value * WEIGHT_RANGE).toFixed(0);

    letter.style.fontVariationSettings = `"wdth" ${width}, "wght" ${weight}, "opsz" 96`;
    letter.style.setProperty('--ink', value.toFixed(3));
};

/**
 * Starts the effect. Returns a teardown that stops the ticker, removes every
 * listener and restores the letters to their resting state.
 */
export const createWordmarkInk = ({ area, letters }: WordmarkInkTargets) => {
    const states: LetterState[] = letters.map(() => ({ value: 0, target: 0 }));

    let centres: Centre[] = [];
    let stop: (() => void) | null = null;
    let pointerX = 0;
    let pointerY = 0;

    const tick = () => {
        let settled = 0;

        letters.forEach((letter, index) => {
            const state = states[index];

            state.value = lerp(state.value, state.target, EASE);

            if (Math.abs(state.value - state.target) < SETTLED) {
                state.value = state.target;
                settled += 1;
            }

            write(letter, state.value);
        });

        // Every letter has reached its target, so drop off the shared clock
        // until the pointer gives it something new to do.
        if (settled === letters.length) {
            stop?.();
            stop = null;
        }
    };

    const start = () => {
        stop ??= subscribeTick(tick);
    };

    const measure = () => {
        centres = letters.map((letter) => {
            const rect = letter.getBoundingClientRect();

            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, width: rect.width };
        });
    };

    const aim = () => {
        if (centres.length === 0) {
            measure();
        }

        const radius = (centres.length > 0 ? centres[0].width : FALLBACK_WIDTH) * RADIUS_SCALE;

        centres.forEach((centre, index) => {
            const dx = (pointerX - centre.x) / radius;
            const dy = (pointerY - centre.y) / (radius * VERTICAL_SLACK);

            states[index].target = Math.exp(-(dx * dx + dy * dy));
        });

        start();
    };

    const handleMove = (event: PointerEvent) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        aim();
    };

    const handleLeave = () => {
        for (const state of states) {
            state.target = 0;
        }

        start();
    };

    // Measurements are viewport-relative, so any scroll or relayout invalidates
    // them. Clearing is cheaper than re-measuring on every scroll frame.
    const invalidate = () => {
        centres = [];
    };

    area.addEventListener('pointerenter', measure);
    area.addEventListener('pointermove', handleMove);
    area.addEventListener('pointerleave', handleLeave);

    const stopScroll = subscribeScroll(invalidate);
    const stopLayout = onStage('layout', invalidate);

    return () => {
        area.removeEventListener('pointerenter', measure);
        area.removeEventListener('pointermove', handleMove);
        area.removeEventListener('pointerleave', handleLeave);
        stopScroll();
        stopLayout();
        stop?.();

        for (const letter of letters) {
            letter.style.fontVariationSettings = '';
            letter.style.removeProperty('--ink');
        }
    };
};
