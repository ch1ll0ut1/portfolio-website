/**
 * Tests for the headline's document model.
 *
 * This is the riskiest logic on the site: every edit to the hero's headline is
 * computed here and then written back over the live DOM, so a wrong answer
 * corrupts what the visitor typed. The toggle rules and the re-merge are
 * covered exhaustively on purpose.
 */

import { describe, expect, it } from 'vitest';
import {
    type Leaf,
    MAX_HEADLINE_LENGTH,
    charsFromLeaves,
    createDoc,
    headlineLength,
    insertText,
    isMarkFullyApplied,
    leafKey,
    leavesFromChars,
    mergeLeaves,
    toggleMark,
} from './editorModel';

/** The shipped headline: "I build the hard part." with "hard part" highlighted. */
const headline = (): Leaf[] => [
    { text: 'I build the ' },
    { text: 'hard part', highlight: true },
    { text: '.' },
];

describe('editorModel', () => {
    describe('mergeLeaves', () => {
        it('should merge adjacent runs with identical marks', () => {
            expect(mergeLeaves([{ text: 'hello ' }, { text: 'world' }])).toEqual([{ text: 'hello world' }]);
        });

        it('should keep runs with differing marks apart', () => {
            expect(mergeLeaves([{ text: 'a' }, { text: 'b', bold: true }])).toEqual([
                { text: 'a' },
                { text: 'b', bold: true },
            ]);
        });

        it('should merge runs that share the same marks', () => {
            expect(mergeLeaves([
                { text: 'a', bold: true, italic: true },
                { text: 'b', italic: true, bold: true },
            ])).toEqual([{ text: 'ab', bold: true, italic: true }]);
        });

        it('should drop empty runs', () => {
            expect(mergeLeaves([{ text: '' }, { text: 'a' }, { text: '' }])).toEqual([{ text: 'a' }]);
        });

        it('should omit marks that are off rather than storing them as false', () => {
            expect(mergeLeaves([{ text: 'a', bold: false }])).toEqual([{ text: 'a' }]);
        });

        it('should not mutate the input leaves', () => {
            const input = [{ text: 'a' }, { text: 'b' }];

            mergeLeaves(input);

            expect(input).toEqual([{ text: 'a' }, { text: 'b' }]);
        });
    });

    describe('characters and leaves', () => {
        it('should round-trip leaves through characters unchanged', () => {
            expect(leavesFromChars(charsFromLeaves(headline()))).toEqual(headline());
        });

        it('should give every character the marks of its leaf', () => {
            const chars = charsFromLeaves([{ text: 'ab', bold: true }]);

            expect(chars).toEqual([
                { char: 'a', bold: true, italic: false, highlight: false },
                { char: 'b', bold: true, italic: false, highlight: false },
            ]);
        });

        it('should count characters across all leaves', () => {
            expect(headlineLength(headline())).toBe(22);
        });
    });

    describe('leafKey', () => {
        it('should match for leaves that differ only in key order', () => {
            expect(leafKey({ text: 'a', bold: true, italic: true }))
                .toBe(leafKey({ text: 'a', italic: true, bold: true }));
        });

        it('should differ when the marks differ', () => {
            expect(leafKey({ text: 'a', bold: true })).not.toBe(leafKey({ text: 'a' }));
        });
    });

    describe('isMarkFullyApplied', () => {
        it('should be true when every selected character carries the mark', () => {
            expect(isMarkFullyApplied(headline(), 12, 21, 'highlight')).toBe(true);
        });

        it('should be false when only part of the selection carries the mark', () => {
            expect(isMarkFullyApplied(headline(), 8, 21, 'highlight')).toBe(false);
        });

        it('should be false for an empty selection', () => {
            expect(isMarkFullyApplied(headline(), 5, 5, 'bold')).toBe(false);
        });

        it('should ignore whitespace while visible characters are selected', () => {
            const leaves: Leaf[] = [{ text: 'a', bold: true }, { text: ' ' }, { text: 'b', bold: true }];

            expect(isMarkFullyApplied(leaves, 0, 3, 'bold')).toBe(true);
        });

        it('should fall back to whitespace when nothing else is selected', () => {
            expect(isMarkFullyApplied([{ text: ' ' }], 0, 1, 'bold')).toBe(false);
        });
    });

    describe('toggleMark', () => {
        it('should turn a mark on across an unmarked range', () => {
            expect(toggleMark([{ text: 'hard part' }], 0, 4, 'bold')).toEqual([
                { text: 'hard', bold: true },
                { text: ' part' },
            ]);
        });

        it('should turn a fully marked range off', () => {
            expect(toggleMark([{ text: 'hard', bold: true }], 0, 4, 'bold')).toEqual([{ text: 'hard' }]);
        });

        it('should turn a partially marked range fully on', () => {
            const leaves: Leaf[] = [{ text: 'ab', bold: true }, { text: 'cd' }];

            expect(toggleMark(leaves, 0, 4, 'bold')).toEqual([{ text: 'abcd', bold: true }]);
        });

        it('should re-merge into the original leaves when a mark is toggled back off', () => {
            const once = toggleMark(headline(), 2, 7, 'bold');

            expect(toggleMark(once, 2, 7, 'bold')).toEqual(headline());
        });

        it('should leave other marks untouched', () => {
            const bolded = toggleMark(headline(), 12, 21, 'bold');

            expect(bolded).toEqual([
                { text: 'I build the ' },
                { text: 'hard part', bold: true, highlight: true },
                { text: '.' },
            ]);
        });

        it('should split a leaf when only part of it is toggled', () => {
            expect(toggleMark([{ text: 'hard part', highlight: true }], 0, 4, 'italic')).toEqual([
                { text: 'hard', italic: true, highlight: true },
                { text: ' part', highlight: true },
            ]);
        });

        it('should return the merged input for a collapsed range', () => {
            expect(toggleMark(headline(), 5, 5, 'bold')).toEqual(headline());
        });

        it('should return the merged input for an inverted range', () => {
            expect(toggleMark(headline(), 9, 4, 'bold')).toEqual(headline());
        });

        it('should clamp a range that runs past the end of the text', () => {
            expect(toggleMark([{ text: 'ab' }], 1, 99, 'italic')).toEqual([
                { text: 'a' },
                { text: 'b', italic: true },
            ]);
        });
    });

    describe('insertText', () => {
        it('should insert at a collapsed caret and report the new caret', () => {
            const result = insertText([{ text: 'ab' }], 1, 1, 'XY');

            expect(result.leaves).toEqual([{ text: 'aXYb' }]);
            expect(result.caret).toBe(3);
        });

        it('should replace the selected range', () => {
            const result = insertText([{ text: 'abcd' }], 1, 3, 'X');

            expect(result.leaves).toEqual([{ text: 'aXd' }]);
            expect(result.caret).toBe(2);
        });

        it('should inherit the marks of the character before the caret', () => {
            const result = insertText([{ text: 'ab', bold: true }, { text: 'cd' }], 2, 2, 'X');

            expect(result.leaves).toEqual([{ text: 'abX', bold: true }, { text: 'cd' }]);
        });

        it('should inherit the following marks when inserting at the start', () => {
            const result = insertText([{ text: 'ab', highlight: true }], 0, 0, 'X');

            expect(result.leaves).toEqual([{ text: 'Xab', highlight: true }]);
        });

        it('should truncate the insertion at the headline cap', () => {
            const result = insertText([{ text: 'a' }], 1, 1, 'b'.repeat(200));

            expect(headlineLength(result.leaves)).toBe(MAX_HEADLINE_LENGTH);
            expect(result.caret).toBe(MAX_HEADLINE_LENGTH);
        });

        it('should count the replaced selection as free space', () => {
            const full = [{ text: 'a'.repeat(MAX_HEADLINE_LENGTH) }];
            const result = insertText(full, 0, 10, 'bbb');

            expect(headlineLength(result.leaves)).toBe(MAX_HEADLINE_LENGTH - 7);
        });

        it('should insert nothing when the headline is already full', () => {
            const full = [{ text: 'a'.repeat(MAX_HEADLINE_LENGTH) }];
            const result = insertText(full, 5, 5, 'bbb');

            expect(result.leaves).toEqual(full);
            expect(result.caret).toBe(5);
        });
    });

    describe('createDoc', () => {
        it('should wrap leaves in a level-one heading', () => {
            expect(createDoc([{ text: 'a' }])).toEqual({
                type: 'heading',
                level: 1,
                children: [{ text: 'a' }],
            });
        });

        it('should always expose at least one leaf', () => {
            expect(createDoc([]).children).toEqual([{ text: '' }]);
        });
    });
});
