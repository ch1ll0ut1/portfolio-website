'use client';

import { type ClipboardEvent, type KeyboardEvent, type RefObject, useCallback } from 'react';
import { prefersReducedMotion } from '@/lib/motion';
import type { FormatCommand } from './FormatToolbar';
import type { PanelState } from './DocumentModelPanel';
import { insertPlainText, isAtCap, resetHeadline, toggleSelectionMark } from './headlineCommands';
import { normalizeEditor } from './editorDom';
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
    onKeyDown: (event: KeyboardEvent<HTMLHeadingElement>) => void;
    onPaste: (event: ClipboardEvent<HTMLHeadingElement>) => void;
    onBlur: () => void;
    applyCommand: (command: FormatCommand) => void;
    /** Called by the intro as its timeline passes each milestone. */
    onArmed: () => void;
    onSelecting: (start: number, end: number) => void;
    onRelease: () => void;
    onSettled: () => void;
}

export interface UseHeadlineEditorOptions {
    titleRef: RefObject<HTMLHeadingElement | null>;
    /** Sends a ripple through the hero's background field. */
    ripple: (clientX: number, clientY: number) => void;
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
export const useHeadlineEditor = ({ titleRef, ripple }: UseHeadlineEditorOptions): HeadlineEditorApi => {
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

    const onKeyDown = useCallback((event: KeyboardEvent<HTMLHeadingElement>) => {
        const title = titleRef.current;

        if (!title) {
            return;
        }

        const modifier = event.metaKey || event.ctrlKey;

        // A heading is one line, so Enter and Escape both mean "I'm done".
        if (event.key === 'Enter') {
            event.preventDefault();
            title.blur();

            return;
        }

        if (event.key === 'Escape') {
            title.blur();

            return;
        }

        const key = event.key.toLowerCase();

        if (modifier && (key === 'b' || key === 'i' || key === 'h')) {
            event.preventDefault();
            applyCommand(key === 'b' ? 'bold' : key === 'i' ? 'italic' : 'highlight');

            return;
        }

        const selection = window.getSelection();
        const inserting = event.key.length === 1 && !modifier;

        // Typing over a selection replaces it, so only a collapsed caret is capped.
        if (inserting && isAtCap(title) && selection?.isCollapsed === true) {
            event.preventDefault();
        }
    }, [applyCommand, titleRef]);

    const onPaste = useCallback((event: ClipboardEvent<HTMLHeadingElement>) => {
        event.preventDefault();

        const title = titleRef.current;

        if (!title) {
            return;
        }

        // Pasted markup is rebuilt from the model as plain text, which both
        // strips foreign styling and enforces the cap in one step.
        insertPlainText(title, event.clipboardData.getData('text'));
        sync();
    }, [sync, titleRef]);

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
        onArmed: model.onArmed,
        onSelecting: model.onSelecting,
        onRelease: model.onRelease,
        onSettled: model.onSettled,
    };
};
