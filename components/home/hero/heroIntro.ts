/**
 * The hero's scripted intro.
 *
 * The headline's words rise out of their masks while the rest of the section
 * cascades in, then an I-beam drags a selection across the highlighted phrase
 * and releases it — the page introducing itself by using its own editor.
 *
 * Three things end the timeline: it finishing, the visitor touching the
 * headline, or a failsafe. All three land on the same end state, and nothing
 * here is allowed to leave the headline altered: the masks are unwrapped and
 * the inline styles removed before the editor takes over.
 *
 * Nothing is ever hidden while waiting for this to start. The headline is
 * split and animated inside one synchronous block, and the animations hold
 * their own first frame (`fill: 'backwards'`), so until the timeline runs the
 * section is simply the finished page. There is no armed state to get stuck
 * in if the bundle never arrives.
 */

import { EASE, isIntroDone, onStage, prefersReducedMotion, startStage } from '@/lib/motion';
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

/** Above this scroll offset the intro is pointless — the hero is behind you. */
const SCROLL_LIMIT = 80;
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

    const rise = (element: Element | null, delay: number, distance = 24, duration = 900) => {
        if (!element) {
            return;
        }

        animations.push(element.animate([
            { opacity: 0, transform: `translate3d(0, ${distance}px, 0)` },
            { opacity: 1, transform: 'none' },
        ], { duration, delay, easing: EASE.out, fill: 'backwards' }));
    };

    /** The end state, reached by every path out of the intro. */
    const settle = () => {
        if (settled) {
            return;
        }

        settled = true;
        window.clearTimeout(failsafe);
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

    const cascade = () => {
        root.querySelectorAll(`.${classNames.status} > *`).forEach((element, index) => {
            rise(element, index * 60, 14, 800);
        });
        rise(root.querySelector(`.${classNames.lede}`), 380);
        root.querySelectorAll(`.${classNames.ctas} > *`).forEach((element, index) => {
            rise(element, 460 + index * 60, 18);
        });
        rise(root.querySelector(`.${classNames.tree}`), 560, 30, 1000);
    };

    const run = () => {
        if (settled) {
            return;
        }

        started = true;

        // Split and animate in one block: the browser never paints the split
        // headline, so the masks cost nothing visually, and the model only
        // collapses to a single leaf once the timeline that re-splits it is
        // actually running.
        units = splitIntoWordMasks(title);
        hooks.onArmed();

        const lines = wordLineIndices(units);

        units.forEach((unit, index) => {
            animations.push(unit.animate(
                [{ transform: 'translateY(112%)' }, { transform: 'none' }],
                {
                    duration: WORD_RISE_MS,
                    delay: WORD_DELAY_MS + index * WORD_STAGGER_MS + lines[index] * LINE_STAGGER_MS,
                    easing: EASE.out,
                    fill: 'backwards',
                },
            ));
        });

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
    startStage();

    const willAnimate = !prefersReducedMotion() && window.scrollY < SCROLL_LIMIT;

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
