/**
 * The edits the headline supports, as operations on the live DOM.
 *
 * Each one computes the result in the document model and writes the whole
 * headline back, which is what keeps the markup to plain text plus `b`, `i`
 * and `mark` no matter how the edit arrived. The character offsets of the
 * selection survive the rebuild, so the caret does not jump.
 */

import {
    markCovering,
    normalizeEditor,
    readSelection,
    replaceLeaves,
    selectOffsets,
    serializeEditor,
} from './editorDom';
import {
    type Leaf,
    MAX_HEADLINE_LENGTH,
    type MarkName,
    headlineLength,
    insertText,
    isMarkFullyApplied,
    toggleMark,
} from './editorModel';

export interface MarkResult {
    /** The mark element to sweep, set only when a highlight was turned on. */
    sweep: HTMLElement | null;
}

/**
 * Toggles a mark over the current selection. Returns null when there is
 * nothing selected inside the headline.
 */
export const toggleSelectionMark = (title: HTMLElement, mark: MarkName): MarkResult | null => {
    const selection = readSelection(title);

    if (!selection || selection.collapsed) {
        return null;
    }

    const { start, end } = selection;
    const leaves = toggleMark(serializeEditor(title), start, end, mark);

    replaceLeaves(title, leaves);
    normalizeEditor(title);
    selectOffsets(title, start, end);

    const turnedOn = mark === 'highlight' && isMarkFullyApplied(leaves, start, end, 'highlight');

    return { sweep: turnedOn ? markCovering(title, start) : null };
};

/** Restores the original headline. Returns its mark, for the sweep. */
export const resetHeadline = (title: HTMLElement, leaves: Leaf[]) => {
    replaceLeaves(title, leaves);

    return title.querySelector('mark');
};

/**
 * Inserts text over the selection as plain text, collapsing whitespace and
 * truncating to the headline's cap. Used for paste, which is intercepted so
 * foreign markup never reaches the document.
 */
export const insertPlainText = (title: HTMLElement, text: string) => {
    const leaves = serializeEditor(title);
    const selection = readSelection(title);
    const start = selection?.start ?? headlineLength(leaves);
    const end = selection?.end ?? start;
    const result = insertText(leaves, start, end, text.replace(/\s+/g, ' '));

    replaceLeaves(title, result.leaves);
    normalizeEditor(title);
    selectOffsets(title, result.caret, result.caret);
};

export const isAtCap = (title: HTMLElement) => title.textContent.length >= MAX_HEADLINE_LENGTH;

/** `col 7`, `sel 12–21`, or empty when the headline is not being edited. */
export const selectionReadout = (title: HTMLElement) => {
    const selection = readSelection(title);

    if (!selection || document.activeElement !== title) {
        return '';
    }

    const { anchor, focus } = selection;

    if (anchor === focus) {
        return `col ${anchor}`;
    }

    return `sel ${Math.min(anchor, focus)}–${Math.max(anchor, focus)}`;
};
