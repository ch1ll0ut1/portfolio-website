/**
 * The brand mark's "retypes itself" scheduler.
 *
 * Framework-agnostic on purpose: it owns the timing of the backspace-and-retype
 * sequence, and the component owns the DOM and the (hashed) class names it is
 * told to toggle.
 */

import { prefersReducedMotion } from '@/lib/motion';

/** Delay before each step, in document order: hide k, hide s, pause, show s, show k. */
const STEP_DELAYS = [70, 70, 200, 95] as const;
/** Settle time after the last keystroke before the caret resumes blinking. */
const SETTLE_MS = 500;

export interface RetypeOptions {
    /** The badge itself. Pinned to its measured width so hidden letters cannot collapse it. */
    mark: HTMLElement;
    /** The letter elements, in reading order. */
    letters: HTMLElement[];
    /** Class that holds the caret solid while typing. */
    typingClass: string;
    /** Class that takes a letter out of flow. */
    goneClass: string;
}

export interface Retype {
    /** Plays the sequence. A no-op while a run is already in flight. */
    run: () => void;
    /** Stops any run and restores the mark. Safe to call repeatedly. */
    cancel: () => void;
}

export const createRetype = ({ mark, letters, typingClass, goneClass }: RetypeOptions): Retype => {
    const timers: number[] = [];

    let running = false;

    const restore = () => {
        mark.classList.remove(typingClass);
        mark.style.minWidth = '';
        mark.style.justifyContent = '';

        for (const letter of letters) {
            letter.classList.remove(goneClass);
        }
    };

    const cancel = () => {
        for (const timer of timers) {
            window.clearTimeout(timer);
        }

        timers.length = 0;
        running = false;
        restore();
    };

    const run = () => {
        if (running || letters.length < 2 || prefersReducedMotion()) {
            return;
        }

        running = true;

        // Letters leave the flow as they are deleted, so the badge keeps the
        // width it had before the first keystroke.
        mark.style.minWidth = `${mark.offsetWidth}px`;
        mark.style.justifyContent = 'flex-start';
        mark.classList.add(typingClass);

        const steps = [
            () => {
                letters[1].classList.add(goneClass);
            },
            () => {
                letters[0].classList.add(goneClass);
            },
            () => {
                letters[0].classList.remove(goneClass);
            },
            () => {
                letters[1].classList.remove(goneClass);
            },
        ];

        let elapsed = 0;

        steps.forEach((step, index) => {
            elapsed += STEP_DELAYS[index];
            timers.push(window.setTimeout(step, elapsed));
        });

        timers.push(window.setTimeout(() => {
            timers.length = 0;
            running = false;
            restore();
        }, elapsed + SETTLE_MS));
    };

    return { run, cancel };
};
