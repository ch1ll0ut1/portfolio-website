/**
 * Tests for the headline's edit commands.
 *
 * These are the operations the keyboard shortcuts, the toolbar and paste all
 * funnel through, so they are checked against the live DOM rather than against
 * the model alone.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { readSelection, selectOffsets, serializeEditor } from './editorDom';
import { MAX_HEADLINE_LENGTH } from './editorModel';
import {
    insertPlainText,
    isAtCap,
    resetHeadline,
    selectionReadout,
    toggleSelectionMark,
} from './headlineCommands';

const ORIGINAL = [
    { text: 'I build the ' },
    { text: 'hard part', highlight: true },
    { text: '.' },
];

describe('headlineCommands', () => {
    let title: HTMLElement;

    beforeEach(() => {
        title = document.createElement('h1');
        title.contentEditable = 'true';
        title.innerHTML = 'I build the <mark>hard part</mark>.';
        document.body.appendChild(title);
    });

    afterEach(() => {
        title.remove();
        window.getSelection()?.removeAllRanges();
    });

    describe('toggleSelectionMark', () => {
        it('should bold the selected run and keep the selection', () => {
            selectOffsets(title, 2, 7);
            toggleSelectionMark(title, 'bold');

            expect(serializeEditor(title)).toEqual([
                { text: 'I ' },
                { text: 'build', bold: true },
                { text: ' the ' },
                { text: 'hard part', highlight: true },
                { text: '.' },
            ]);
            expect(readSelection(title)).toMatchObject({ start: 2, end: 7 });
        });

        it('should report the mark to sweep when a highlight is turned on', () => {
            selectOffsets(title, 2, 7);

            const result = toggleSelectionMark(title, 'highlight');

            expect(result?.sweep?.textContent).toBe('build');
        });

        it('should report nothing to sweep when a highlight is turned off', () => {
            selectOffsets(title, 12, 21);

            const result = toggleSelectionMark(title, 'highlight');

            expect(result?.sweep).toBeNull();
            expect(serializeEditor(title)).toEqual([{ text: 'I build the hard part.' }]);
        });

        it('should extend a highlight over a partially highlighted selection', () => {
            selectOffsets(title, 8, 21);
            toggleSelectionMark(title, 'highlight');

            expect(serializeEditor(title)).toEqual([
                { text: 'I build ' },
                { text: 'the hard part', highlight: true },
                { text: '.' },
            ]);
        });

        it('should do nothing for a collapsed caret', () => {
            selectOffsets(title, 4, 4);

            expect(toggleSelectionMark(title, 'bold')).toBeNull();
            expect(serializeEditor(title)).toEqual(ORIGINAL);
        });

        it('should do nothing when there is no selection in the headline', () => {
            window.getSelection()?.removeAllRanges();

            expect(toggleSelectionMark(title, 'bold')).toBeNull();
        });
    });

    describe('resetHeadline', () => {
        it('should restore the original headline and return its mark', () => {
            selectOffsets(title, 0, 22);
            toggleSelectionMark(title, 'bold');

            const mark = resetHeadline(title, ORIGINAL);

            expect(serializeEditor(title)).toEqual(ORIGINAL);
            expect(mark?.textContent).toBe('hard part');
        });
    });

    describe('insertPlainText', () => {
        it('should insert at the caret', () => {
            selectOffsets(title, 2, 2);
            insertPlainText(title, 'really ');

            expect(title.textContent).toBe('I really build the hard part.');
        });

        it('should replace the selection', () => {
            selectOffsets(title, 12, 21);
            insertPlainText(title, 'easy bit');

            expect(title.textContent).toBe('I build the easy bit.');
        });

        it('should collapse newlines and tabs into single spaces', () => {
            selectOffsets(title, 22, 22);
            insertPlainText(title, ' a\n\tb');

            expect(title.textContent).toBe('I build the hard part. a b');
        });

        it('should never let the headline exceed the cap', () => {
            selectOffsets(title, 22, 22);
            insertPlainText(title, 'x'.repeat(500));

            expect(title.textContent.length).toBe(MAX_HEADLINE_LENGTH);
        });

        it('should leave the caret after the inserted text', () => {
            selectOffsets(title, 2, 2);
            insertPlainText(title, 'abc');

            expect(readSelection(title)).toMatchObject({ start: 5, end: 5, collapsed: true });
        });

        it('should not inject markup from pasted HTML, since it only takes text', () => {
            selectOffsets(title, 22, 22);
            insertPlainText(title, '<b>bold</b>');

            expect(title.querySelectorAll('b')).toHaveLength(0);
            expect(title.textContent).toContain('<b>bold</b>');
        });
    });

    describe('isAtCap', () => {
        it('should be false for the shipped headline', () => {
            expect(isAtCap(title)).toBe(false);
        });

        it('should be true once the cap is reached', () => {
            title.textContent = 'x'.repeat(MAX_HEADLINE_LENGTH);

            expect(isAtCap(title)).toBe(true);
        });
    });

    describe('selectionReadout', () => {
        it('should be empty while the headline is not the active element', () => {
            selectOffsets(title, 4, 9);

            expect(selectionReadout(title)).toBe('');
        });
    });
});
