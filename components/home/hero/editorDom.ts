/**
 * The bridge between the contenteditable headline and its document model.
 *
 * The headline's DOM is allowed to hold exactly plain text plus `b`, `i` and
 * `mark`. Browsers do not agree on what they put there when someone types,
 * pastes or drags, so every edit is normalized back to that shape and then
 * read into leaves. Nesting is always italic → bold → mark, so rebuilding the
 * DOM from the same leaves always produces the same markup.
 */

import { type Leaf, type MarkName, type MarkSet, NO_MARKS, leafFrom, mergeLeaves } from './editorModel';

/** Tags the model understands. Anything else is unwrapped. */
const MARK_BY_TAG: Record<string, MarkName | undefined> = {
    B: 'bold',
    STRONG: 'bold',
    I: 'italic',
    EM: 'italic',
    MARK: 'highlight',
};

const UNWRAP_SELECTOR = 'div, p, span, font';
const MARK_SELECTOR = 'b, i, strong, em, mark';

export const isInEditor = (root: HTMLElement, node: Node | null) =>
    node !== null && (node === root || root.contains(node));

/**
 * Flattens whatever the browser left behind into plain text plus mark tags:
 * block wrappers and spans are unwrapped, line breaks removed (the headline is
 * one line) and empty mark tags dropped.
 */
export const normalizeEditor = (root: HTMLElement) => {
    for (const element of Array.from(root.querySelectorAll('br'))) {
        element.remove();
    }

    for (const element of Array.from(root.querySelectorAll(UNWRAP_SELECTOR))) {
        element.replaceWith(...Array.from(element.childNodes));
    }

    for (const element of Array.from(root.querySelectorAll(MARK_SELECTOR))) {
        if (element.textContent === '') {
            element.remove();
        }
    }
};

/**
 * The marks that apply to a node, by walking up to the editor root. Intro
 * wrappers are plain spans, so they never reach the model.
 */
export const marksOfNode = (node: Node, root: HTMLElement): MarkSet => {
    const marks = { ...NO_MARKS };

    for (let current = node.parentNode; current !== null && current !== root; current = current.parentNode) {
        const mark = MARK_BY_TAG[current.nodeName];

        if (mark) {
            marks[mark] = true;
        }
    }

    return marks;
};

const textNodes = (root: HTMLElement) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];

    for (let node = walker.nextNode(); node !== null; node = walker.nextNode()) {
        if (node instanceof Text) {
            nodes.push(node);
        }
    }

    return nodes;
};

/** Reads the headline's DOM into leaves, merging adjacent runs that match. */
export const serializeEditor = (root: HTMLElement): Leaf[] => mergeLeaves(
    textNodes(root)
        .filter(node => node.data !== '')
        .map(node => leafFrom(node.data, marksOfNode(node, root))),
);

/** Character offset of a DOM position, counted from the start of the headline. */
export const characterOffset = (root: HTMLElement, node: Node, offset: number) => {
    if (!isInEditor(root, node)) {
        return 0;
    }

    try {
        const range = document.createRange();

        range.setStart(root, 0);
        range.setEnd(node, offset);

        return range.toString().length;
    }
    catch {
        // An offset can be stale by the time it is read, e.g. the selection
        // pointing into a node the last edit replaced.
        return 0;
    }
};

export interface EditorSelection {
    /** Lower offset of the range. */
    start: number;
    /** Higher offset of the range. */
    end: number;
    /** Where the selection began — may be after `focus`. */
    anchor: number;
    /** Where the caret currently sits. */
    focus: number;
    collapsed: boolean;
}

export const readSelection = (root: HTMLElement): EditorSelection | null => {
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
        return null;
    }

    if (!isInEditor(root, selection.anchorNode) || !isInEditor(root, selection.focusNode)) {
        return null;
    }

    const range = selection.getRangeAt(0);
    const start = characterOffset(root, range.startContainer, range.startOffset);
    const end = characterOffset(root, range.endContainer, range.endOffset);
    const anchor = selection.anchorNode === null
        ? start
        : characterOffset(root, selection.anchorNode, selection.anchorOffset);
    const focus = selection.focusNode === null
        ? end
        : characterOffset(root, selection.focusNode, selection.focusOffset);

    return { start, end, anchor, focus, collapsed: selection.isCollapsed };
};

/** Restores a selection from character offsets after the DOM was rebuilt. */
export const selectOffsets = (root: HTMLElement, start: number, end: number) => {
    const selection = window.getSelection();

    if (!selection) {
        return;
    }

    let position = 0;
    let startNode: Text | null = null;
    let startOffset = 0;
    let endNode: Text | null = null;
    let endOffset = 0;

    for (const node of textNodes(root)) {
        if (startNode === null && start <= position + node.length) {
            startNode = node;
            startOffset = start - position;
        }

        if (endNode === null && end <= position + node.length) {
            endNode = node;
            endOffset = end - position;
        }

        position += node.length;
    }

    if (startNode === null || endNode === null) {
        return;
    }

    const range = document.createRange();

    range.setStart(startNode, startOffset);
    range.setEnd(endNode, endOffset);
    selection.removeAllRanges();
    selection.addRange(range);
};

/** Builds the headline's markup from leaves. Nesting order is fixed. */
export const leavesToFragment = (leaves: Leaf[]) => {
    const fragment = document.createDocumentFragment();

    for (const leaf of leaves) {
        if (leaf.text === '') {
            continue;
        }

        let node: Node = document.createTextNode(leaf.text);

        if (leaf.italic === true) {
            node = wrap('i', node);
        }

        if (leaf.bold === true) {
            node = wrap('b', node);
        }

        if (leaf.highlight === true) {
            node = wrap('mark', node);
        }

        fragment.appendChild(node);
    }

    return fragment;
};

/** Replaces the headline's content with the markup for `leaves`. */
export const replaceLeaves = (root: HTMLElement, leaves: Leaf[]) => {
    root.textContent = '';
    root.appendChild(leavesToFragment(leaves));
};

/** Last non-empty text node, used to park the idle ghost caret. */
export const lastTextNode = (root: HTMLElement): Text | null => {
    const nodes = textNodes(root).filter(node => node.data !== '');

    return nodes.at(-1) ?? null;
};

/** First `mark` element covering a character offset. */
export const markCovering = (root: HTMLElement, offset: number) => {
    for (const element of Array.from(root.querySelectorAll('mark'))) {
        const start = characterOffset(root, element, 0);
        const length = element.textContent.length;

        if (start <= offset && offset < start + length) {
            return element;
        }
    }

    return null;
};

function wrap(tag: 'i' | 'b' | 'mark', node: Node) {
    const element = document.createElement(tag);

    element.appendChild(node);

    return element;
}
