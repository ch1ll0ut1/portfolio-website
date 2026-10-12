/**
 * The closing paragraph's typing scheduler.
 *
 * Framework-agnostic on purpose: the component owns the markup and the (hashed)
 * class names, this module owns the word list, the frontier caret's position
 * and when the selection sweep is allowed to start.
 *
 * Nothing here hides text. "Unwritten" words are only dimmed, so the paragraph
 * reads as ordinary text to assistive tech at every point in the sequence.
 */

import type { EngagementNoteSegment } from '@/config/engagements';

/** One word of the paragraph, ready to render. */
export interface NoteWord {
    text: string;
    /** Part of the phrase that gets selected at the end. */
    selected: boolean;
    /** Index among the selected words, driving their stagger. Otherwise -1. */
    selectIndex: number;
}

export interface TypingClassNames {
    /** On the paragraph while the typing sequence owns it. */
    writing: string;
    /** On the paragraph once every word is written. */
    done: string;
    /** On the paragraph once the selection sweep may run. */
    selected: string;
    /** On a word that has been written. */
    on: string;
}

export interface TypingEngineOptions {
    paragraph: HTMLElement;
    /** The word spans, in reading order. */
    words: HTMLElement[];
    /** The frontier caret. */
    caret: HTMLElement;
    classNames: TypingClassNames;
}

export interface TypingEngine {
    /** Hands the paragraph to the sequence and rewinds it to zero words. */
    start: () => void;
    /** Renders exactly `count` written words. Cheap to call every frame. */
    render: (count: number) => void;
    /** Re-places the caret after a reflow, without changing the word count. */
    reposition: () => void;
    /** Jumps to the finished state: everything written, phrase selected. */
    finish: () => void;
    /** Releases the paragraph and cancels any pending sweep. */
    destroy: () => void;
}

/** Pause between the last word and the selection sweep, in ms. */
const SELECT_DELAY_MS = 260;
/** The caret's height as a multiple of the paragraph's font size. */
const CARET_HEIGHT_EM = 1.2;
/** Gap between the caret and the word it trails, in px. */
const CARET_GAP_PX = 2;
/** Inset of the caret when it is parked before the first word, in px. */
const CARET_LEAD_PX = 3;

/**
 * Splits the paragraph's segments into words.
 *
 * Whitespace runs collapse: the component re-inserts exactly one space between
 * neighbouring words, which is also what makes the selection band line up with
 * the phrase rather than with the gaps around it.
 */
export const splitNoteWords = (segments: EngagementNoteSegment[]): NoteWord[] => {
    const words: NoteWord[] = [];

    let selectIndex = 0;

    for (const segment of segments) {
        for (const text of segment.text.split(/\s+/)) {
            if (text === '') {
                continue;
            }

            words.push({
                text,
                selected: segment.selected,
                selectIndex: segment.selected ? selectIndex : -1,
            });

            if (segment.selected) {
                selectIndex += 1;
            }
        }
    }

    return words;
};

export const createTypingEngine = ({ paragraph, words, caret, classNames }: TypingEngineOptions): TypingEngine => {
    let shown = -1;
    let selectTimer = 0;

    const place = (count: number) => {
        if (words.length === 0) {
            return;
        }

        const word = words[Math.max(0, count - 1)];
        const fontSize = Number.parseFloat(window.getComputedStyle(paragraph).fontSize) || 18;
        const x = count === 0
            ? word.offsetLeft - CARET_LEAD_PX
            : word.offsetLeft + word.offsetWidth + CARET_GAP_PX;
        const y = word.offsetTop + (word.offsetHeight - fontSize * CARET_HEIGHT_EM) / 2;

        caret.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    };

    const render = (count: number) => {
        if (count === shown) {
            return;
        }

        shown = count;

        words.forEach((word, index) => {
            word.classList.toggle(classNames.on, index < count);
        });

        place(count);

        const done = count >= words.length;

        paragraph.classList.toggle(classNames.done, done);
        window.clearTimeout(selectTimer);

        if (done) {
            // The sweep waits a beat after the last word, so it reads as a
            // deliberate selection rather than part of the typing.
            selectTimer = window.setTimeout(() => {
                paragraph.classList.add(classNames.selected);
            }, SELECT_DELAY_MS);
        }
        else {
            paragraph.classList.remove(classNames.selected);
        }
    };

    const finish = () => {
        window.clearTimeout(selectTimer);
        paragraph.classList.add(classNames.selected);
    };

    return {
        start: () => {
            paragraph.classList.add(classNames.writing);
            render(0);
        },
        render,
        reposition: () => {
            if (shown >= 0) {
                place(shown);
            }
        },
        finish,
        destroy: () => {
            window.clearTimeout(selectTimer);
            paragraph.classList.remove(classNames.writing, classNames.done);

            for (const word of words) {
                word.classList.remove(classNames.on);
            }
        },
    };
};
