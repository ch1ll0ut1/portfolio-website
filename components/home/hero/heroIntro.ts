/**
 * The hero's scripted intro.
 *
 * The headline's words rise into place one by one while the rest of the
 * section cascades in, then an I-beam drags a selection across the highlighted phrase
 * and releases it — the page introducing itself by using its own editor.
 *
 * Three things end the timeline: it finishing, the visitor touching the
 * headline, or a failsafe. All three land on the same end state, and nothing
 * here is allowed to leave the headline altered: the masks are unwrapped and
 * the inline styles removed before the editor takes over.
 *
 * The start state is not set here. The boot script arms the page (`is-pre` on
 * `<html>`) before first paint, and the section's CSS holds the hero off that
 * class: the headline, lede and document panel visible but lowered, so the
 * page's largest content paints at once, and the chips and calls to action
 * hidden. The headline, lede and panel rise from wherever that hold has them
 * (read back from the computed transform), so the timeline's first frame is
 * the one already painted; anything whose hold has already timed out is left
 * where it is rather than snapped back to the start. The stage releases the
 * class straight after the timeline has started, in the same task, and the
 * animations hold their own first frame (`fill: 'backwards'`) from there. An
 * intro cut short before it starts releases the class itself, and the CSS
 * hold times out on its own if the bundle never runs.
 *
 * The intro only plays while the page is still armed, so client navigation
 * back to the homepage shows the finished hero rather than replaying it.
 */

import { EASE, isIntroDone, isIntroPending, onStage, releaseIntro, startStage } from '@/lib/motion';
import { createGhostHint } from './heroGhost';
import { runSelectionDrag } from './heroSelectionDrag';
import { splitIntoWordMasks, unwrapWordMasks, wordLineIndices } from './heroWordMasks';

export interface HeroIntroClassNames {
    isDragging: string;
    isGhost: string;
    isOn: string;
    hasFlag: string;
    status: string;
    lede: string;
    ctas: string;
    tree: string;
}

export interface HeroIntroHooks {
    /** The timeline is about to start: the model collapses to one plain leaf. */
    onArmed: () => void;
    /** The selection is being dragged across the given character range. */
    onSelecting: (start: number, end: number) => void;
    /** The drag released: the model gains a highlight leaf. */
    onRelease: () => void;
    /** The timeline is over; from here the DOM is the visitor's. */
    onSettled: () => void;
    /** Sends a ripple through the background field. */
    ripple: (clientX: number, clientY: number) => void;
}

export interface HeroIntroOptions {
    root: HTMLElement;
    title: HTMLElement;
    /** Positioning context for the caret and the I-beam. */
    doc: HTMLElement;
    caret: HTMLElement;
    ibeam: HTMLElement;
    classNames: HeroIntroClassNames;
    hooks: HeroIntroHooks;
}

const FAILSAFE_MS = 2500;
const WORD_DELAY_MS = 60;
const WORD_STAGGER_MS = 55;
const LINE_STAGGER_MS = 60;
const WORD_RISE_MS = 1000;

export const createHeroIntro = ({ root, title, doc, caret, ibeam, classNames, hooks }: HeroIntroOptions) => {
    const animations: Animation[] = [];
    const cleanups: (() => void)[] = [];
    const ghost = createGhostHint({ title, doc, caret, classNames });

    let units: HTMLElement[] = [];
    let stopDrag: (() => void) | null = null;
    let started = false;
    let settled = false;
    let failsafe = 0;

    const unwrap = () => {
        if (units.length > 0) {
            unwrapWordMasks(title);
            units = [];
        }
    };

    /** Fades and lifts an element the CSS holds hidden. */
    const rise = (element: Element | null, delay: number, distance: number, duration = 900) => {
        // A hold that timed out before the timeline started has already shown it.
        if (!element || getComputedStyle(element).opacity === '1') {
            return;
        }

        animations.push(element.animate([
            { opacity: 0, transform: `translate3d(0, ${distance}px, 0)` },
            { opacity: 1, transform: 'none' },
        ], { duration, delay, easing: EASE.out, fill: 'backwards' }));
    };

    /** Moves elements from a held transform into place. */
    const lift = (elements: Element[], from: string | null, delay: (index: number) => number, duration: number) => {
        if (from === null) {
            return;
        }

        elements.forEach((element, index) => {
            animations.push(element.animate(
                [{ transform: from }, { transform: 'none' }],
                { duration, delay: delay(index), easing: EASE.out, fill: 'backwards' },
            ));
        });
    };

    /** The end state, reached by every path out of the intro. */
    const settle = () => {
        if (settled) {
            return;
        }

        settled = true;
        window.clearTimeout(failsafe);
        // Settled before the timeline ran (an early touch, or the failsafe):
        // the section must not stay held in its start state.
        releaseIntro();
        stopDrag?.();
        stopDrag = null;

        for (const animation of animations) {
            try {
                animation.finish();
            }
            catch {
                // An animation that cannot be finished is already irrelevant.
            }
        }

        unwrap();
        title.querySelector('mark')?.removeAttribute('style');
        title.classList.remove(classNames.isDragging);
        caret.style.opacity = '0';
        caret.style.transform = '';
        ibeam.style.opacity = '0';
        ibeam.style.transform = '';
        caret.classList.remove(classNames.hasFlag);
        hooks.onSettled();
        ghost.schedule();
    };

    const liftHeld = (element: Element | null, delay: number, duration: number) => {
        if (element) {
            lift([element], heldTransform(element), () => delay, duration);
        }
    };

    const cascade = () => {
        root.querySelectorAll(`.${classNames.status} > *`).forEach((element, index) => {
            rise(element, index * 60, 14, 800);
        });
        liftHeld(root.querySelector(`.${classNames.lede}`), 380, 900);
        root.querySelectorAll(`.${classNames.ctas} > *`).forEach((element, index) => {
            rise(element, 460 + index * 60, 18);
        });
        liftHeld(root.querySelector(`.${classNames.tree}`), 560, 1000);
    };

    const run = () => {
        if (settled) {
            return;
        }

        started = true;

        // Read before the split, while the CSS still holds the headline: each
        // word rises from the offset the whole headline was painted at.
        const from = heldTransform(title);

        // Split and animate in one block, so the split headline is only ever
        // painted in motion, and the model only collapses to a single leaf
        // once the timeline that re-splits it is actually running.
        units = splitIntoWordMasks(title);
        hooks.onArmed();

        const lines = wordLineIndices(units);

        lift(
            units,
            from,
            index => WORD_DELAY_MS + index * WORD_STAGGER_MS + (lines[index] ?? 0) * LINE_STAGGER_MS,
            WORD_RISE_MS,
        );

        const mark = title.querySelector('mark');

        if (mark) {
            // The drag writes --hl every frame, so the transition must not fight it.
            mark.style.setProperty('--hl', '0');
            title.classList.add(classNames.isDragging);
        }

        cascade();

        stopDrag = runSelectionDrag({
            title,
            doc,
            caret,
            ibeam,
            onSelecting: hooks.onSelecting,
            onRelease: (released) => {
                unwrap();
                hooks.onRelease();

                const rect = released.getBoundingClientRect();

                hooks.ripple(rect.right, rect.top + rect.height / 2);
            },
            onComplete: settle,
        });
    };

    const onIntro = (fn: () => void) => {
        if (isIntroDone()) {
            fn();

            return;
        }

        cleanups.push(onStage('intro', fn));
    };

    // The hero owns the page's first frame, so it is also what guarantees the
    // lifecycle is running rather than waiting for another section to start it.
    // Starting it also releases the armed page when the entrance cannot play
    // (reduced motion, or loaded scrolled past the hero).
    startStage();

    const willAnimate = isIntroPending();

    if (willAnimate) {
        // The failsafe settles an intro that never started; it must not cut
        // short one that is already running.
        failsafe = window.setTimeout(() => {
            if (!started) {
                settle();
            }
        }, FAILSAFE_MS);

        // Any interaction means the visitor is ahead of the script.
        for (const event of ['pointerdown', 'keydown', 'focus'] as const) {
            title.addEventListener(event, settle);
            cleanups.push(() => {
                title.removeEventListener(event, settle);
            });
        }

        onIntro(run);
    }
    else {
        hooks.onSettled();
        onIntro(ghost.schedule);
    }

    return {
        /** Whether the scripted timeline will run at all. */
        willAnimate,
        destroy() {
            window.clearTimeout(failsafe);
            stopDrag?.();
            ghost.destroy();

            for (const animation of animations) {
                animation.cancel();
            }

            for (const cleanup of cleanups) {
                cleanup();
            }

            unwrap();
            title.querySelector('mark')?.removeAttribute('style');
            title.classList.remove(classNames.isDragging);
        },
    };
};

/**
 * The transform the CSS start state holds an element at, or `null` once that
 * hold has timed out and the element is already in place.
 */
const heldTransform = (element: Element) => {
    const { transform } = getComputedStyle(element);

    return transform === '' || transform === 'none' ? null : transform;
};
