/**
 * Tests for the headline editor's input handling: the format shortcuts, paste,
 * the length cap, and the keys that leave the editor or enter its toolbar.
 *
 * Driven through the rendered hero, the hook's only caller, so the tests hold
 * whatever the hook's internals become. Keys are sent as plain events on the
 * headline, because user-event re-syncs the selection on every key and would
 * collapse the one a shortcut is meant to act on.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { REDUCED_MOTION_QUERY } from '@/lib/motion';
import { heroHeadline } from '@/config/hero';
import { installMatchMedia } from '../../../test/motionEnv';
import { Hero } from './Hero';
import { selectOffsets } from './editorDom';
import { MAX_HEADLINE_LENGTH } from './editorModel';

const HEADLINE = `${heroHeadline.before}${heroHeadline.highlight}${heroHeadline.after}`;

const editor = () => screen.getByRole('textbox', { name: 'Headline' });

/** Focuses the headline and selects the characters from `start` to `end`. */
const select = (start: number, end = start) => {
    const textbox = editor();

    textbox.focus();
    act(() => {
        selectOffsets(textbox, start, end);
    });

    return textbox;
};

/** Sends a keydown to the headline; false when the editor prevented it. */
const press = (init: KeyboardEventInit) => {
    let allowed = true;

    act(() => {
        allowed = fireEvent.keyDown(editor(), init);
    });

    return allowed;
};

const paste = (text: string, html = '') => {
    let allowed = true;

    act(() => {
        allowed = fireEvent.paste(editor(), {
            clipboardData: { getData: (type: string) => (type === 'text/html' ? html : text) },
        });
    });

    return allowed;
};

/**
 * jsdom cannot lay out a selection, and the toolbar only shows over one with a
 * size, so the selection's rectangle is pinned.
 */
const pinSelectionRect = () => {
    Range.prototype.getBoundingClientRect = () => DOMRect.fromRect({ x: 40, y: 100, width: 100, height: 40 });
};

/** jsdom's Range has no `getBoundingClientRect` of its own to put back. */
const unpinSelectionRect = () => {
    Reflect.deleteProperty(Range.prototype, 'getBoundingClientRect');
};

const textOf = (selector: string) => Array.from(editor().querySelectorAll(selector)).map(element => element.textContent);

/** Fills the headline to exactly the cap with a typed edit. */
const fillToCap = () => {
    const textbox = editor();

    act(() => {
        textbox.textContent = 'x'.repeat(MAX_HEADLINE_LENGTH);
        fireEvent.input(textbox);
    });
};

describe('useHeadlineEditor', () => {
    let restoreMedia: () => void;

    beforeEach(() => {
        restoreMedia = installMatchMedia([REDUCED_MOTION_QUERY]);
        vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => null);
        render(<Hero />);
    });

    afterEach(() => {
        restoreMedia();
        window.getSelection()?.removeAllRanges();
        unpinSelectionRect();
        vi.restoreAllMocks();
    });

    describe('format shortcuts', () => {
        it('should bold the selection on Ctrl+B and keep the key from the browser', () => {
            select(2, 7);

            expect(press({ key: 'b', ctrlKey: true })).toBe(false);
            expect(textOf('b')).toEqual(['build']);
        });

        it('should italicise the selection on ⌘I', () => {
            select(2, 7);

            expect(press({ key: 'i', metaKey: true })).toBe(false);
            expect(textOf('i')).toEqual(['build']);
        });

        it('should highlight the selection on Ctrl+Shift+H', () => {
            select(2, 7);

            expect(press({ key: 'H', code: 'KeyH', ctrlKey: true, shiftKey: true })).toBe(false);
            expect(textOf('mark')).toContain('build');
        });

        it('should match the highlight shortcut on the physical key when the layout reports another character', () => {
            select(2, 7);

            expect(press({ key: 'Ĥ', code: 'KeyH', metaKey: true, shiftKey: true })).toBe(false);
            expect(textOf('mark')).toContain('build');
        });

        it('should turn bold off again when the whole selection is already bold', () => {
            select(2, 7);
            press({ key: 'b', ctrlKey: true });
            select(2, 7);
            press({ key: 'b', ctrlKey: true });

            expect(textOf('b')).toEqual([]);
        });

        it('should leave Shift and Alt variants of the shortcuts to the browser', () => {
            select(2, 7);

            expect(press({ key: 'B', ctrlKey: true, shiftKey: true })).toBe(true);
            expect(press({ key: 'b', ctrlKey: true, altKey: true })).toBe(true);
            expect(press({ key: 'h', code: 'KeyH', ctrlKey: true, altKey: true, shiftKey: true })).toBe(true);
            expect(editor().querySelector('b')).toBeNull();
        });

        it('should leave the letters alone without a modifier', () => {
            select(2, 7);

            expect(press({ key: 'b' })).toBe(true);
            expect(editor().querySelector('b')).toBeNull();
        });

        it('should swallow a shortcut with nothing selected without changing the headline', () => {
            const before = select(3).innerHTML;

            expect(press({ key: 'b', ctrlKey: true })).toBe(false);
            expect(editor().innerHTML).toBe(before);
        });

        it('should restore the shipped headline from the toolbar after edits', async () => {
            pinSelectionRect();
            select(2, 7);
            press({ key: 'b', ctrlKey: true });
            act(() => {
                document.dispatchEvent(new Event('selectionchange'));
            });

            const restore = await waitFor(() => screen.getByRole('button', { name: 'Restore original headline' }));

            act(() => {
                fireEvent.click(restore);
            });

            expect(editor()).toHaveTextContent(HEADLINE);
            expect(editor().querySelector('b')).toBeNull();
            expect(textOf('mark')).toEqual([heroHeadline.highlight]);
        });
    });

    describe('paste', () => {
        it('should insert the clipboard as plain text at the caret, collapsing line breaks and tabs', () => {
            select(HEADLINE.length);

            expect(paste('Hello\n\tworld')).toBe(false);
            expect(editor()).toHaveTextContent(`${HEADLINE}Hello world`);
        });

        it('should drop the clipboard\'s markup and keep only its text', () => {
            select(0, HEADLINE.length);
            paste('Plain words', '<b style="color:red">Plain</b> <script>x()</script>words');

            expect(editor()).toHaveTextContent('Plain words');
            expect(editor().querySelector('b, script, [style]')).toBeNull();
        });

        it('should replace the selection with the pasted text', () => {
            select(2, 7);
            paste('ship');

            expect(editor().textContent).toBe(`I ship the ${heroHeadline.highlight}${heroHeadline.after}`);
        });

        it('should cut a long paste off at the cap', () => {
            select(HEADLINE.length);
            paste('y'.repeat(MAX_HEADLINE_LENGTH * 2));

            expect(editor().textContent).toHaveLength(MAX_HEADLINE_LENGTH);
        });

        it('should publish the pasted text to the document model panel', () => {
            select(0, HEADLINE.length);
            paste('Pasted headline');

            expect(screen.getByRole('complementary', { name: /document model/i })).toHaveTextContent('Pasted headline');
        });
    });

    describe('length cap', () => {
        it('should refuse another character at the cap', () => {
            fillToCap();
            select(MAX_HEADLINE_LENGTH);

            expect(press({ key: 'a' })).toBe(false);
        });

        it('should still let a character replace a selection at the cap', () => {
            fillToCap();
            select(0, 4);

            expect(press({ key: 'a' })).toBe(true);
        });

        it('should still let editing keys and shortcuts through at the cap', () => {
            fillToCap();
            select(MAX_HEADLINE_LENGTH);

            expect(press({ key: 'Backspace' })).toBe(true);
            expect(press({ key: 'ArrowLeft' })).toBe(true);
            expect(press({ key: 'a', ctrlKey: true })).toBe(true);
        });

        it('should let characters through below the cap', () => {
            select(HEADLINE.length);

            expect(press({ key: 'a' })).toBe(true);
        });
    });

    describe('leaving the editor', () => {
        it('should prevent Enter and Escape from reaching the headline and move focus to the edit control', () => {
            for (const key of ['Enter', 'Escape']) {
                select(3);

                expect(press({ key })).toBe(false);
                expect(screen.getByRole('button', { name: 'Edit headline' })).toHaveFocus();
            }
        });

        it('should move focus into the toolbar on Alt+F10 while it is showing', async () => {
            pinSelectionRect();
            select(2, 7);
            act(() => {
                document.dispatchEvent(new Event('selectionchange'));
            });
            await waitFor(() => screen.getByRole('toolbar', { name: 'Format selection' }));

            expect(press({ key: 'F10', altKey: true })).toBe(false);
            expect(screen.getByRole('button', { name: 'Bold' })).toHaveFocus();
        });

        it('should leave Alt+F10 alone while the toolbar is hidden', () => {
            select(3);

            expect(press({ key: 'F10', altKey: true })).toBe(true);
            expect(editor()).toHaveFocus();
        });
    });
});
