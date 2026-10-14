'use client';

import { type RefObject, useCallback } from 'react';
import { prefersReducedMotion } from '@/lib/motion';
import type { FormatCommand } from './FormatToolbar';
import type { PanelState } from './DocumentModelPanel';
import { insertPlainText, isAtCap, resetHeadline, toggleSelectionMark } from './headlineCommands';
import { normalizeEditor, selectOffsets } from './editorDom';
import type { HeadingDoc } from './editorModel';
import { INITIAL_HEADLINE } from './initialHeadline';
import { useHeadlineModel } from './useHeadlineModel';
import styles from './Hero.module.css';

/** The highlight sweep is one frame of setup, then a transition. */
const RIPPLE_DELAY_MS = 120;

export interface HeadlineEditorApi {
    doc: HeadingDoc;
    baseline: string[];
    position: string;
    panelState: PanelState;
    onInput: () => void;
    onKeyDown: (event: KeyboardEvent) => void;
    onPaste: (event: ClipboardEvent) => void;
    onBlur: () => void;
    applyCommand: (command: FormatCommand) => void;
    /**
     * Opts into editing from the keyboard: puts the headline in the Tab
     * order, focuses it and parks the caret at the end.
     */
    activate: () => void;
    /** Called by the intro as its timeline passes each milestone. */
    onArmed: () => void;
    onSelecting: (start: number, end: number) => void;
    onRelease: () => void;
    onSettled: () => void;
}

export interface UseHeadlineEditorOptions {
    titleRef: RefObject<HTMLElement | null>;
    /** Sends a ripple through the hero's background field. */
    ripple: (clientX: number, clientY: number) => void;
    /** Where focus goes when the visitor finishes editing with Enter or Escape. */
    exitRef: RefObject<HTMLElement | null>;
    /** The format toolbar, which Alt+F10 moves focus into. */
    toolbarRef: RefObject<HTMLElement | null>;
}

/**
 * Every edit that reaches the headline.
 *
 * This half writes: it mutates the contenteditable DOM, then asks
 * `useHeadlineModel` to re-read it. Formatting is computed in the model and
 * written back rather than going through `document.execCommand`, which reads
 * the headline's 640 weight as already bold.
 *
 * Every callback it returns is stable, which is what lets `HeadlineEditor`
 * render exactly once and then be left alone.
 */
export const useHeadlineEditor = ({ titleRef, ripple, exitRef, toolbarRef }: UseHeadlineEditorOptions): HeadlineEditorApi => {
    const model = useHeadlineModel(titleRef);
    const { sync, clearPosition } = model;

    /** The highlight wipes in from the left, then sends a ripple outward. */
    const sweep = useCallback((mark: HTMLElement | null) => {
        if (!mark || prefersReducedMotion()) {
            return;
        }

        const rect = mark.getBoundingClientRect();

        mark.classList.add(styles.sweeping);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                mark.classList.remove(styles.sweeping);

                // Removing the last class leaves an empty attribute behind, and
                // the whole point of this section is a headline whose markup
                // stays exactly as clean as its document model.
                if (mark.getAttribute('class') === '') {
                    mark.removeAttribute('class');
                }
            });
        });
        window.setTimeout(() => {
            ripple(rect.right, rect.top + rect.height / 2);
        }, RIPPLE_DELAY_MS);
    }, [ripple]);

    const applyCommand = useCallback((command: FormatCommand) => {
        const title = titleRef.current;

        if (!title) {
            return;
        }

        if (command === 'reset') {
            sweep(resetHeadline(title, INITIAL_HEADLINE));
            sync();

            return;
        }

        const result = toggleSelectionMark(title, command);

        if (!result) {
            return;
        }

        sync();
        sweep(result.sweep);
    }, [sweep, sync, titleRef]);

    const onInput = useCallback(() => {
        const title = titleRef.current;

        if (!title) {
            return;
        }

        normalizeEditor(title);
        sync();
    }, [sync, titleRef]);

    const onKeyDown = useCallback((event: KeyboardEvent) => {
        const title = titleRef.current;

        if (!title) {
            return;
        }

        // A heading is one line, so Enter and Escape both mean "I'm done".
        // Focus goes back to the control that opens the editor, rather than
        // being dropped on the page body.
        if (event.key === 'Enter' || event.key === 'Escape') {
            event.preventDefault();
            finishEditing(title, exitRef.current);

            return;
        }

        // The usual way into an editor's toolbar from its text.
        if (event.altKey && event.key === 'F10') {
            const toolbar = toolbarRef.current;
            const entry = toolbar?.querySelector<HTMLElement>('[tabindex="0"]');

            if (toolbar && entry && !toolbar.hidden) {
                event.preventDefault();
                entry.focus();
            }

            return;
        }

        const command = formatShortcut(event);

        if (command) {
            event.preventDefault();
            applyCommand(command);

            return;
        }

        const selection = window.getSelection();
        const inserting = event.key.length === 1 && !event.metaKey && !event.ctrlKey;

        // Typing over a selection replaces it, so only a collapsed caret is capped.
        if (inserting && isAtCap(title) && selection?.isCollapsed === true) {
            event.preventDefault();
        }
    }, [applyCommand, exitRef, titleRef, toolbarRef]);

    const onPaste = useCallback((event: ClipboardEvent) => {
        event.preventDefault();

        const title = titleRef.current;

        if (!title) {
            return;
        }

        // Pasted markup is rebuilt from the model as plain text, which both
        // strips foreign styling and enforces the cap in one step.
        insertPlainText(title, event.clipboardData?.getData('text') ?? '');
        sync();
    }, [sync, titleRef]);

    const activate = useCallback(() => {
        const title = titleRef.current;

        if (!title) {
            return;
        }

        // Opted in once, it stays in the Tab order for the rest of the visit.
        title.tabIndex = 0;
        title.focus();

        const length = title.textContent.length;

        selectOffsets(title, length, length);
    }, [titleRef]);

    return {
        doc: model.doc,
        baseline: model.baseline,
        position: model.position,
        panelState: model.panelState,
        onInput,
        onKeyDown,
        onPaste,
        onBlur: clearPosition,
        applyCommand,
        activate,
        onArmed: model.onArmed,
        onSelecting: model.onSelecting,
        onRelease: model.onRelease,
        onSettled: model.onSettled,
    };
};

/**
 * The format shortcuts: ⌘B and ⌘I, and ⌘⇧H for highlight (Ctrl on other
 * platforms). Plain ⌘H never reaches a page on macOS, where it hides the
 * browser. The highlight key is matched on the physical key as well, since
 * Shift or Option can change which character `key` reports.
 */
const formatShortcut = (event: KeyboardEvent): FormatCommand | null => {
    if (!(event.metaKey || event.ctrlKey) || event.altKey) {
        return null;
    }

    const key = event.key.toLowerCase();

    if (key === 'h' || event.code === 'KeyH') {
        return event.shiftKey ? 'highlight' : null;
    }

    if (event.shiftKey) {
        return null;
    }

    if (key === 'b') {
        return 'bold';
    }

    return key === 'i' ? 'italic' : null;
};

const finishEditing = (title: HTMLElement, exit: HTMLElement | null) => {
    if (exit) {
        exit.focus();

        return;
    }

    title.blur();
};
