/**
 * Tests for the bridge between the contenteditable headline and its model.
 *
 * Normalization is what keeps whatever a browser leaves behind from reaching
 * the document, and the offset mapping is what lets the DOM be rebuilt without
 * the caret jumping — both are worth pinning down precisely.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
    characterOffset,
    isInEditor,
    lastTextNode,
    leavesToFragment,
    markCovering,
    marksOfNode,
    normalizeEditor,
    readSelection,
    replaceLeaves,
    selectOffsets,
    serializeEditor,
} from './editorDom';

describe('editorDom', () => {
    let title: HTMLElement;

    const html = (markup: string) => {
        title.innerHTML = markup;
    };

    beforeEach(() => {
        title = document.createElement('h1');
        title.contentEditable = 'true';
        document.body.appendChild(title);
    });

    afterEach(() => {
        title.remove();
        window.getSelection()?.removeAllRanges();
    });

    describe('normalizeEditor', () => {
        it('should unwrap block and span wrappers', () => {
            html('<div>I build</div><p> the</p><span> hard part</span>');
            normalizeEditor(title);

            expect(title.innerHTML).toBe('I build the hard part');
        });

        it('should unwrap font tags a browser may inject', () => {
            html('<font color="red">red</font>');
            normalizeEditor(title);

            expect(title.innerHTML).toBe('red');
        });

        it('should strip line breaks, since the headline is one line', () => {
            html('one<br>two');
            normalizeEditor(title);

            expect(title.innerHTML).toBe('onetwo');
        });

        it('should remove mark tags left empty by an edit', () => {
            html('keep<b></b><mark></mark><i></i>');
            normalizeEditor(title);

            expect(title.innerHTML).toBe('keep');
        });

        it('should keep text plus b, i and mark intact', () => {
            html('I build the <mark><b><i>hard part</i></b></mark>.');
            normalizeEditor(title);

            expect(title.innerHTML).toBe('I build the <mark><b><i>hard part</i></b></mark>.');
        });

        it('should keep the text when unwrapping a span inside a mark', () => {
            html('<mark><span>hard part</span></mark>');
            normalizeEditor(title);

            expect(title.innerHTML).toBe('<mark>hard part</mark>');
        });
    });

    describe('marksOfNode', () => {
        it('should collect every formatting ancestor up to the editor', () => {
            html('<mark><b><i>x</i></b></mark>');

            const text = title.querySelector('i')?.firstChild;

            expect(text && marksOfNode(text, title)).toEqual({ bold: true, italic: true, highlight: true });
        });

        it('should treat strong and em as bold and italic', () => {
            html('<strong><em>x</em></strong>');

            const text = title.querySelector('em')?.firstChild;

            expect(text && marksOfNode(text, title)).toEqual({ bold: true, italic: true, highlight: false });
        });

        it('should ignore the intro word-mask wrappers', () => {
            html('<span class="sw"><span class="swi">x</span></span>');

            const text = title.querySelector('.swi')?.firstChild;

            expect(text && marksOfNode(text, title)).toEqual({ bold: false, italic: false, highlight: false });
        });
    });

    describe('serializeEditor', () => {
        it('should read plain text as a single leaf', () => {
            html('I build the hard part.');

            expect(serializeEditor(title)).toEqual([{ text: 'I build the hard part.' }]);
        });

        it('should read marked runs as their own leaves', () => {
            html('I build the <mark>hard part</mark>.');

            expect(serializeEditor(title)).toEqual([
                { text: 'I build the ' },
                { text: 'hard part', highlight: true },
                { text: '.' },
            ]);
        });

        it('should merge adjacent runs that share marks', () => {
            html('<b>hard</b><b> part</b>');

            expect(serializeEditor(title)).toEqual([{ text: 'hard part', bold: true }]);
        });

        it('should see through the intro word masks', () => {
            html('<span class="sw"><span class="swi">I</span></span> <span class="sw"><span class="swi">build</span></span>');

            expect(serializeEditor(title)).toEqual([{ text: 'I build' }]);
        });

        it('should report an empty headline as no leaves', () => {
            html('');

            expect(serializeEditor(title)).toEqual([]);
        });
    });

    describe('characterOffset', () => {
        it('should count text before a position, ignoring element boundaries', () => {
            html('I build the <mark>hard part</mark>.');

            const mark = title.querySelector('mark');
            const text = mark?.firstChild;

            expect(text && characterOffset(title, text, 0)).toBe(12);
            expect(text && characterOffset(title, text, 4)).toBe(16);
            expect(mark && characterOffset(title, mark, 0)).toBe(12);
        });

        it('should return zero for a node outside the editor', () => {
            const outside = document.createElement('p');

            outside.textContent = 'elsewhere';
            document.body.appendChild(outside);

            expect(characterOffset(title, outside, 0)).toBe(0);

            outside.remove();
        });
    });

    describe('selectOffsets and readSelection', () => {
        it('should round-trip a selection through character offsets', () => {
            html('I build the <mark>hard part</mark>.');
            selectOffsets(title, 12, 21);

            expect(readSelection(title)).toMatchObject({ start: 12, end: 21, collapsed: false });
        });

        it('should round-trip a selection that spans a mark boundary', () => {
            html('I build the <mark>hard part</mark>.');
            selectOffsets(title, 8, 16);

            expect(readSelection(title)).toMatchObject({ start: 8, end: 16, collapsed: false });
        });

        it('should report a collapsed caret', () => {
            html('I build the hard part.');
            selectOffsets(title, 4, 4);

            expect(readSelection(title)).toMatchObject({ start: 4, end: 4, collapsed: true });
        });

        it('should report no selection when it sits outside the editor', () => {
            const outside = document.createElement('p');

            outside.textContent = 'elsewhere';
            document.body.appendChild(outside);
            html('inside');

            const range = document.createRange();
            const selection = window.getSelection();

            range.selectNodeContents(outside);
            selection?.removeAllRanges();
            selection?.addRange(range);

            expect(readSelection(title)).toBeNull();

            outside.remove();
        });
    });

    describe('leavesToFragment', () => {
        it('should nest italic inside bold inside mark', () => {
            html('');
            title.appendChild(leavesToFragment([
                { text: 'x', bold: true, italic: true, highlight: true },
            ]));

            expect(title.innerHTML).toBe('<mark><b><i>x</i></b></mark>');
        });

        it('should emit plain text for an unmarked leaf', () => {
            html('');
            title.appendChild(leavesToFragment([{ text: 'plain' }]));

            expect(title.innerHTML).toBe('plain');
        });

        it('should skip empty leaves', () => {
            html('');
            title.appendChild(leavesToFragment([{ text: '' }, { text: 'a' }]));

            expect(title.innerHTML).toBe('a');
        });
    });

    describe('replaceLeaves', () => {
        it('should rebuild the headline from leaves', () => {
            html('whatever was there');
            replaceLeaves(title, [{ text: 'a ' }, { text: 'b', highlight: true }]);

            expect(title.innerHTML).toBe('a <mark>b</mark>');
        });

        it('should round-trip through serialization', () => {
            const leaves = [{ text: 'I build the ' }, { text: 'hard part', highlight: true }, { text: '.' }];

            replaceLeaves(title, leaves);

            expect(serializeEditor(title)).toEqual(leaves);
        });
    });

    describe('markCovering', () => {
        it('should find the mark containing a character offset', () => {
            html('I build the <mark>hard part</mark>.');

            expect(markCovering(title, 12)?.textContent).toBe('hard part');
            expect(markCovering(title, 20)?.textContent).toBe('hard part');
        });

        it('should return null for an offset outside every mark', () => {
            html('I build the <mark>hard part</mark>.');

            expect(markCovering(title, 3)).toBeNull();
            expect(markCovering(title, 21)).toBeNull();
        });
    });

    describe('lastTextNode', () => {
        it('should return the final non-empty text node', () => {
            html('a<mark>b</mark>c');

            expect(lastTextNode(title)?.data).toBe('c');
        });

        it('should return null for an empty headline', () => {
            html('');

            expect(lastTextNode(title)).toBeNull();
        });
    });

    describe('isInEditor', () => {
        it('should accept the editor and its descendants', () => {
            html('<mark>x</mark>');

            expect(isInEditor(title, title)).toBe(true);
            expect(isInEditor(title, title.querySelector('mark'))).toBe(true);
        });

        it('should reject null and outside nodes', () => {
            expect(isInEditor(title, null)).toBe(false);
            expect(isInEditor(title, document.body)).toBe(false);
        });
    });
});
