/**
 * The headline's document model.
 *
 * The DOM inside the contenteditable headline is the source of truth for what
 * the visitor typed; this module is the source of truth for what that *means*.
 * Everything here is pure: leaves in, leaves out, no DOM. Formatting runs
 * through it rather than through `document.execCommand`, which misreads the
 * headline's 640 weight as "already bold".
 *
 * A leaf only ever carries the marks that are on, so two leaves with the same
 * text and the same formatting always produce the same key.
 */

export type MarkName = 'bold' | 'italic' | 'highlight';

export const MARK_NAMES: readonly MarkName[] = ['bold', 'italic', 'highlight'];

/** Single-line heading, so the cap is a character count rather than a line count. */
export const MAX_HEADLINE_LENGTH = 64;

export interface MarkSet {
    bold: boolean;
    italic: boolean;
    highlight: boolean;
}

/** A run of text sharing one set of marks. Absent keys mean "off". */
export interface Leaf extends Partial<MarkSet> {
    text: string;
}

export interface MarkedChar extends MarkSet {
    char: string;
}

export interface HeadingDoc {
    type: 'heading';
    level: 1;
    children: Leaf[];
}

export const NO_MARKS: MarkSet = { bold: false, italic: false, highlight: false };

export const marksOfLeaf = (leaf: Leaf): MarkSet => ({
    bold: leaf.bold === true,
    italic: leaf.italic === true,
    highlight: leaf.highlight === true,
});

export const sameMarks = (a: MarkSet, b: MarkSet) => MARK_NAMES.every(mark => a[mark] === b[mark]);

/** Builds a leaf that carries only the marks that are on. */
export const leafFrom = (text: string, marks: MarkSet): Leaf => {
    const leaf: Leaf = { text };

    if (marks.bold) {
        leaf.bold = true;
    }

    if (marks.italic) {
        leaf.italic = true;
    }

    if (marks.highlight) {
        leaf.highlight = true;
    }

    return leaf;
};

/** Drops empty leaves and merges neighbours whose marks match. */
export const mergeLeaves = (leaves: Leaf[]): Leaf[] => {
    const merged: Leaf[] = [];

    let previous: Leaf | undefined;

    for (const leaf of leaves) {
        if (leaf.text === '') {
            continue;
        }

        if (previous !== undefined && sameMarks(marksOfLeaf(previous), marksOfLeaf(leaf))) {
            previous.text += leaf.text;
            continue;
        }

        previous = leafFrom(leaf.text, marksOfLeaf(leaf));
        merged.push(previous);
    }

    return merged;
};

export const charsFromLeaves = (leaves: Leaf[]): MarkedChar[] => {
    const chars: MarkedChar[] = [];

    for (const leaf of leaves) {
        const marks = marksOfLeaf(leaf);

        for (const char of Array.from(leaf.text)) {
            chars.push({ char, ...marks });
        }
    }

    return chars;
};

export const leavesFromChars = (chars: MarkedChar[]): Leaf[] =>
    mergeLeaves(chars.map(char => leafFrom(char.char, char)));

export const headlineLength = (leaves: Leaf[]) => charsFromLeaves(leaves).length;

/** Stable identity of a leaf, used to decide which panel rows flash. */
export const leafKey = (leaf: Leaf) => JSON.stringify([
    leaf.text,
    leaf.bold === true,
    leaf.italic === true,
    leaf.highlight === true,
]);

export const createDoc = (children: Leaf[]): HeadingDoc => ({
    type: 'heading',
    level: 1,
    children: children.length > 0 ? children : [{ text: '' }],
});

/**
 * Whether a toggle should turn the mark off.
 *
 * Whitespace is ignored while any visible character is selected, so selecting
 * "hard part" does not read as mixed just because the space between the words
 * sits outside the highlight.
 */
export const isMarkFullyApplied = (
    leaves: Leaf[],
    start: number,
    end: number,
    mark: MarkName,
) => {
    const selected = charsFromLeaves(leaves).slice(start, end);

    if (selected.length === 0) {
        return false;
    }

    const visible = selected.filter(char => char.char.trim() !== '');
    const considered = visible.length > 0 ? visible : selected;

    return considered.every(char => char[mark]);
};

const withMark = (char: MarkedChar, mark: MarkName, value: boolean): MarkedChar => ({
    char: char.char,
    bold: mark === 'bold' ? value : char.bold,
    italic: mark === 'italic' ? value : char.italic,
    highlight: mark === 'highlight' ? value : char.highlight,
});

/**
 * Toggles a mark across a character range.
 *
 * A partially marked range turns fully on; a fully marked one turns off. The
 * result is re-merged, so toggling a mark off again restores the original
 * leaves exactly.
 */
export const toggleMark = (
    leaves: Leaf[],
    start: number,
    end: number,
    mark: MarkName,
): Leaf[] => {
    const chars = charsFromLeaves(leaves);
    const from = Math.max(0, Math.min(start, chars.length));
    const to = Math.max(0, Math.min(end, chars.length));

    if (to <= from) {
        return mergeLeaves(leaves);
    }

    const value = !isMarkFullyApplied(leaves, from, to, mark);
    const next = chars.map((char, index) => (
        index >= from && index < to ? withMark(char, mark, value) : char
    ));

    return leavesFromChars(next);
};

export interface InsertResult {
    leaves: Leaf[];
    /** Character offset the caret should land on. */
    caret: number;
}

/**
 * Replaces a character range with plain text, inheriting the formatting of the
 * character before the insertion point. Truncates to the headline's cap.
 */
export const insertText = (
    leaves: Leaf[],
    start: number,
    end: number,
    text: string,
): InsertResult => {
    const chars = charsFromLeaves(leaves);
    const from = Math.max(0, Math.min(start, chars.length));
    const to = Math.max(from, Math.min(end, chars.length));
    const room = MAX_HEADLINE_LENGTH - (chars.length - (to - from));
    const inserted = Array.from(text).slice(0, Math.max(0, room));
    // Pasted text picks up the formatting it lands in, like typing would.
    const templateIndex = from > 0 ? from - 1 : to;
    const template = templateIndex < chars.length ? chars[templateIndex] : { char: '', ...NO_MARKS };
    const next = [
        ...chars.slice(0, from),
        ...inserted.map(char => ({
            char,
            bold: template.bold,
            italic: template.italic,
            highlight: template.highlight,
        })),
        ...chars.slice(to),
    ];

    return { leaves: leavesFromChars(next), caret: from + inserted.length };
};
