/**
 * DOM helpers the illustration modules share.
 *
 * The illustrations build their own markup in JavaScript, so they never touch
 * innerHTML and never hard-code a class name: every class arrives as part of
 * the class map the React wrapper hands them.
 */

import { EASE, prefersReducedMotion } from '@/lib/motion';
import type { IllustrationScript } from './runner';

/**
 * Chrome of the little editor window every illustration sits in.
 *
 * Deliberately kept as its own argument rather than merged into an
 * illustration's map: both sides name things like `bar`, and a merge would
 * silently let one win.
 */
export interface FrameClasses {
    viz: string;
    win: string;
    titleBar: string;
    path: string;
    body: string;
    bodyOut: string;
    chip: string;
    chipBusy: string;
    chipOk: string;
    chipErr: string;
    caret: string;
    caretSolid: string;
    caretInline: string;
}

export interface Illustration {
    /** Design-space width the stage is scaled from. */
    width: number;
    /** Design-space height the stage is scaled from. */
    height: number;
    /** Renders one meaningful static frame, used instead of animating. */
    still: () => void;
    /** Re-invoked in a loop by the runner. */
    script: IllustrationScript;
    /** Re-measures anything that depends on laid-out text. */
    onLayout?: () => void;
}

const DEFAULT_DURATION = 600;

export const h = <K extends keyof HTMLElementTagNameMap>(
    tag: K,
    className: string,
    parent?: Element | null,
    text?: string,
): HTMLElementTagNameMap[K] => {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text !== undefined) {
        element.textContent = text;
    }

    parent?.appendChild(element);

    return element;
};

/** jsdom has no Web Animations, and reduced motion opts out entirely. */
const canAnimate = (element: Element) => 'animate' in element && !prefersReducedMotion();

export const anim = (
    element: Element,
    keyframes: Keyframe[],
    options: KeyframeAnimationOptions = {},
) => {
    if (!canAnimate(element)) {
        return null;
    }

    return element.animate(keyframes, {
        duration: DEFAULT_DURATION,
        easing: EASE.out,
        fill: 'backwards',
        ...options,
    });
};

/**
 * Commits the final transform, then animates in from the old one.
 *
 * Writing the end state first means no animation is left filling forwards, so
 * a paused or skipped animation still leaves the element where it belongs.
 */
export const tf = (
    element: HTMLElement,
    from: string,
    to: string,
    options: KeyframeAnimationOptions = {},
) => {
    element.style.transform = to;

    if (from !== to) {
        anim(element, [{ transform: from }, { transform: to }], options);
    }
};

/** Builds the window chrome and returns the body to draw into. */
export const buildWindow = (
    stage: Element,
    frame: FrameClasses,
    pathPrefix: string,
    fileName: string,
    right?: Element,
) => {
    const win = h('div', frame.win, stage);
    const bar = h('div', frame.titleBar, win);
    const path = h('span', frame.path, bar, pathPrefix);

    h('b', '', path, fileName);

    if (right) {
        bar.appendChild(right);
    }

    return h('div', frame.body, win);
};
