/**
 * Decides how the cursor should treat an element.
 *
 * The cursor knows nothing about any specific component: elements opt in
 * through `data-cursor`, and a value on an ancestor wins outright, which lets a
 * section opt its whole subtree out without this file knowing what it is.
 */

export type CursorMode = 'caret' | 'select' | 'block' | 'text' | 'native';

/** Gets the selection box. Links and buttons are in by default. */
const SELECTABLE = 'a[href], button, [role="button"], summary, label[for], select, [data-cursor="select"]';
/** Keeps the OS cursor: fields and embedded documents the browser owns. */
const NATIVE = 'input, textarea, select, iframe, [data-cursor="native"]';
const TEXT = '[contenteditable="true"], [contenteditable=""], [data-cursor="text"]';

/** Past this a card is too large to box; the caret only takes its colour. */
const BLOCK_HEIGHT = 110;
const BLOCK_AREA = 90000;

export interface CursorPick {
    mode: CursorMode;
    /** The element the selection box should wrap, when there is one. */
    target: Element | null;
}

export const pickCursorMode = (element: Element | null): CursorPick => {
    if (!element) {
        return { mode: 'caret', target: null };
    }

    const forced = element.closest('[data-cursor]')?.getAttribute('data-cursor');

    if (forced === 'none') {
        return { mode: 'native', target: null };
    }

    if (forced === 'caret') {
        return { mode: 'caret', target: null };
    }

    if (element.closest(NATIVE)) {
        return { mode: 'native', target: null };
    }

    // Palette rows already have their own sliding highlight.
    if (element.closest('[role="option"]')) {
        return { mode: 'caret', target: null };
    }

    const text = element.closest(TEXT);

    if (text) {
        return { mode: 'text', target: text };
    }

    const selectable = element.closest(SELECTABLE);

    if (selectable) {
        const rect = selectable.getBoundingClientRect();
        const oversized = rect.height > BLOCK_HEIGHT || rect.width * rect.height > BLOCK_AREA;

        return { mode: oversized ? 'block' : 'select', target: selectable };
    }

    return { mode: 'caret', target: null };
};
