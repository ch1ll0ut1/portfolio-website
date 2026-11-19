/**
 * The idle hint.
 *
 * If nobody touches the headline for a while, a collaborator's caret appears
 * at the end of it with a small flag, the way a shared document shows someone
 * else's cursor. It is the only thing that tells a visitor the headline is
 * editable without saying so in words, so it waits politely and leaves at the
 * first sign of interaction or scrolling.
 */

import { hasFinePointer, prefersReducedMotion, subscribeScroll } from '@/lib/motion';
import { lastTextNode } from './editorDom';

export interface GhostClassNames {
    isGhost: string;
    isOn: string;
    hasFlag: string;
}

export interface GhostHintOptions {
    title: HTMLElement;
    /** Positioning context for the caret. */
    doc: HTMLElement;
    caret: HTMLElement;
    classNames: GhostClassNames;
}

export interface GhostHint {
    /** Arms the hint, unless the visitor has already interacted. */
    schedule: () => void;
    destroy: () => void;
}

const DELAY_MS = 6000;
/** Past this scroll offset the hero is behind you and the hint is noise. */
const SCROLL_LIMIT = 200;

export const createGhostHint = ({ title, doc, caret, classNames }: GhostHintOptions): GhostHint => {
    const cleanups: (() => void)[] = [];

    let touched = false;
    let timer = 0;

    const hide = () => {
        caret.classList.remove(classNames.isOn, classNames.hasFlag);
    };

    const show = () => {
        const last = lastTextNode(title);

        if (touched || document.activeElement === title || window.scrollY > SCROLL_LIMIT || !last) {
            return;
        }

        const range = document.createRange();

        range.setStart(last, Math.max(0, last.length - 1));
        range.setEnd(last, last.length);

        const rect = range.getBoundingClientRect();
        const docRect = doc.getBoundingClientRect();
        const fontSize = parseFloat(getComputedStyle(title).fontSize);
        const x = rect.right - docRect.left + 0.025 * fontSize;
        const y = rect.top - docRect.top + 0.17 * fontSize;

        caret.dataset.label = hasFinePointer() ? 'click to edit' : 'tap to edit';
        caret.style.height = `${rect.height - 0.27 * fontSize}px`;
        caret.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        caret.style.opacity = '';
        caret.classList.add(classNames.isGhost);
        // One frame later, so the opacity transition has a state to leave.
        requestAnimationFrame(() => {
            caret.classList.add(classNames.isOn, classNames.hasFlag);
        });
    };

    const schedule = () => {
        window.clearTimeout(timer);

        if (!touched && !prefersReducedMotion()) {
            timer = window.setTimeout(show, DELAY_MS);
        }
    };

    const markTouched = () => {
        touched = true;
        window.clearTimeout(timer);
        hide();
    };

    for (const event of ['pointerdown', 'focus', 'keydown'] as const) {
        title.addEventListener(event, markTouched);
        cleanups.push(() => {
            title.removeEventListener(event, markTouched);
        });
    }

    cleanups.push(subscribeScroll(({ y }) => {
        if (y > SCROLL_LIMIT) {
            hide();
        }
    }));

    return {
        schedule,
        destroy() {
            window.clearTimeout(timer);

            for (const cleanup of cleanups) {
                cleanup();
            }

            caret.classList.remove(classNames.isGhost, classNames.isOn, classNames.hasFlag);
            delete caret.dataset.label;
        },
    };
};
