/**
 * Tests for the floating format toolbar's keyboard model.
 *
 * It follows the APG toolbar pattern: one Tab stop, arrows and Home/End move
 * between the buttons, Escape hands focus back to the text being formatted.
 * Placement is measured from the live selection, which jsdom cannot lay out,
 * so the selection's rectangle is pinned.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type FC, useRef } from 'react';
import { REDUCED_MOTION_QUERY } from '@/lib/motion';
import { installMatchMedia } from '../../../test/motionEnv';
import { type FormatCommand, FormatToolbar } from './FormatToolbar';
import { selectOffsets } from './editorDom';

interface HarnessProps {
    onCommand: (command: FormatCommand) => void;
}

const Harness: FC<HarnessProps> = ({ onCommand }) => {
    const hostRef = useRef<HTMLElement>(null);
    const editorRef = useRef<HTMLElement>(null);
    const toolbarRef = useRef<HTMLDivElement>(null);

    return (
        <section ref={hostRef}>
            <span ref={editorRef} role="textbox" contentEditable suppressContentEditableWarning tabIndex={0} data-testid="editor">
                I build the hard part.
            </span>
            <FormatToolbar editorRef={editorRef} hostRef={hostRef} toolbarRef={toolbarRef} onCommand={onCommand} />
        </section>
    );
};

/**
 * Presses a key on whatever has focus. Plain events rather than user-event's
 * keyboard, which re-syncs the document selection on every key and would
 * collapse the selection the toolbar is following.
 */
const press = (key: string) => {
    act(() => {
        fireEvent.keyDown(document.activeElement ?? document.body, { key });
    });
};

const rect = { top: 100, left: 40, right: 140, bottom: 140, width: 100, height: 40, x: 40, y: 100, toJSON: () => ({}) };

describe('<FormatToolbar>', () => {
    let restoreMedia: () => void;
    let onCommand: ReturnType<typeof vi.fn>;

    /** Selects "build" in the editor and waits for the toolbar to follow it. */
    const showToolbar = async () => {
        const editor = screen.getByTestId('editor');

        editor.focus();
        act(() => {
            selectOffsets(editor, 2, 7);
            document.dispatchEvent(new Event('selectionchange'));
        });

        return waitFor(() => screen.getByRole('toolbar', { name: 'Format selection' }));
    };

    beforeEach(() => {
        // Reduced motion skips the entrance animation, which jsdom cannot run.
        restoreMedia = installMatchMedia([REDUCED_MOTION_QUERY]);
        onCommand = vi.fn();
        Range.prototype.getBoundingClientRect = () => rect;
        render(<Harness onCommand={onCommand} />);
    });

    afterEach(() => {
        restoreMedia();
        window.getSelection()?.removeAllRanges();
    });

    it('should stay hidden while nothing is selected', () => {
        expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
    });

    it('should appear over a selection with a single Tab stop', async () => {
        const toolbar = await showToolbar();
        const buttons = Array.from(toolbar.querySelectorAll('button'));

        expect(buttons.map(button => button.tabIndex)).toEqual([0, -1, -1, -1]);
    });

    it('should move between buttons with the arrow keys, wrapping at the ends', async () => {
        await showToolbar();
        screen.getByRole('button', { name: 'Bold' }).focus();

        press('ArrowRight');

        expect(screen.getByRole('button', { name: 'Italic' })).toHaveFocus();
        expect(screen.getByRole('button', { name: 'Italic' })).toHaveAttribute('tabindex', '0');
        expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('tabindex', '-1');

        press('ArrowLeft');
        press('ArrowLeft');

        expect(screen.getByRole('button', { name: 'Restore original headline' })).toHaveFocus();
    });

    it('should jump to the first and last buttons on Home and End', async () => {
        await showToolbar();
        screen.getByRole('button', { name: 'Bold' }).focus();

        press('End');

        expect(screen.getByRole('button', { name: 'Restore original headline' })).toHaveFocus();

        press('Home');

        expect(screen.getByRole('button', { name: 'Bold' })).toHaveFocus();
    });

    it('should run the command of the button it moved to', async () => {
        const user = userEvent.setup();

        await showToolbar();
        screen.getByRole('button', { name: 'Bold' }).focus();
        press('ArrowRight');
        await user.click(screen.getByRole('button', { name: 'Italic' }));

        expect(onCommand).toHaveBeenCalledWith('italic');
    });

    it('should hand focus back to the editor on Escape', async () => {
        await showToolbar();
        screen.getByRole('button', { name: 'Bold' }).focus();
        press('Escape');

        expect(screen.getByTestId('editor')).toHaveFocus();
    });

    it('should report which marks the whole selection carries', async () => {
        await showToolbar();

        expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'false');
        expect(screen.getByRole('button', { name: 'Restore original headline' })).not.toHaveAttribute('aria-pressed');
    });
});
