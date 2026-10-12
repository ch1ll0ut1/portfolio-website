'use client';

import { type FC, type ReactNode, type RefObject, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { EASE, clamp, prefersReducedMotion } from '@/lib/motion';
import { readSelection, serializeEditor } from './editorDom';
import { type MarkName, type MarkSet, NO_MARKS, isMarkFullyApplied } from './editorModel';
import styles from './Hero.module.css';

export type FormatCommand = MarkName | 'reset';

export interface Props {
    editorRef: RefObject<HTMLElement | null>;
    /** Positioning context. The toolbar is clamped inside it. */
    hostRef: RefObject<HTMLElement | null>;
    onCommand: (command: FormatCommand) => void;
}

interface ToolbarButton {
    command: FormatCommand;
    label: string;
    content: ReactNode;
    /** Reset is an action, not a state. */
    toggle: boolean;
}

const BUTTONS: ToolbarButton[] = [
    { command: 'bold', label: 'Bold', content: <b>B</b>, toggle: true },
    { command: 'italic', label: 'Italic', content: <i>I</i>, toggle: true },
    { command: 'highlight', label: 'Highlight', content: <span className={styles.toolbarHl}>H</span>, toggle: true },
    { command: 'reset', label: 'Restore original headline', content: '↺', toggle: false },
];

/** Gap kept between the toolbar and the hero's edges. */
const EDGE_PADDING = 8;
const SELECTION_GAP = 12;

const isMarkOn = (marks: MarkSet, command: FormatCommand) => command !== 'reset' && marks[command];

/**
 * A button reads as pressed when the *whole* selection carries its mark, which
 * is exactly when pressing it would turn the mark off. Reading the anchor node
 * instead would misreport a selection that starts on a run boundary.
 */
const marksOfSelection = (editor: HTMLElement, start: number, end: number): MarkSet => {
    const leaves = serializeEditor(editor);

    return {
        bold: isMarkFullyApplied(leaves, start, end, 'bold'),
        italic: isMarkFullyApplied(leaves, start, end, 'italic'),
        highlight: isMarkFullyApplied(leaves, start, end, 'highlight'),
    };
};

/**
 * The floating format toolbar.
 *
 * Follows a non-collapsed selection inside the headline and reflects that
 * selection's marks. It lives outside the editable subtree, so it is free to
 * be ordinary React state; only its position is written imperatively, since it
 * is measured from the live selection rectangle.
 */
export const FormatToolbar: FC<Props> = ({ editorRef, hostRef, onCommand }) => {
    const barRef = useRef<HTMLDivElement>(null);
    const wasVisible = useRef(false);
    const [placement, setPlacement] = useState<{ x: number; y: number } | null>(null);
    const [marks, setMarks] = useState<MarkSet>(NO_MARKS);

    const place = useCallback(() => {
        const editor = editorRef.current;
        const host = hostRef.current;
        const selection = window.getSelection();

        if (!editor || !host || !selection) {
            setPlacement(null);

            return;
        }

        const current = readSelection(editor);

        if (!current || current.collapsed) {
            setPlacement(null);

            return;
        }

        const rect = selection.getRangeAt(0).getBoundingClientRect();

        if (rect.width === 0) {
            setPlacement(null);

            return;
        }

        const hostRect = host.getBoundingClientRect();

        setPlacement({
            x: rect.left + rect.width / 2 - hostRect.left,
            y: rect.top - hostRect.top - SELECTION_GAP,
        });
        setMarks(marksOfSelection(editor, current.start, current.end));
    }, [editorRef, hostRef]);

    useEffect(() => {
        let queued = false;
        const schedule = () => {
            if (queued) {
                return;
            }

            queued = true;
            requestAnimationFrame(() => {
                queued = false;
                place();
            });
        };

        document.addEventListener('selectionchange', schedule);
        window.addEventListener('scroll', schedule, { passive: true });

        return () => {
            document.removeEventListener('selectionchange', schedule);
            window.removeEventListener('scroll', schedule);
        };
    }, [place]);

    useLayoutEffect(() => {
        const element = barRef.current;
        const host = hostRef.current;

        if (!element || !host || !placement) {
            wasVisible.current = false;

            return;
        }

        const half = element.offsetWidth / 2 + EDGE_PADDING;
        const hostWidth = host.getBoundingClientRect().width;

        element.style.left = `${clamp(placement.x, half, hostWidth - half)}px`;
        element.style.top = `${placement.y}px`;

        if (!wasVisible.current && !prefersReducedMotion()) {
            element.animate([
                { opacity: 0, transform: 'translate(-50%, -100%) translateY(6px) scale(.92)' },
                { opacity: 1, transform: 'translate(-50%, -100%)' },
            ], { duration: 260, easing: EASE.out });
        }

        wasVisible.current = true;
    }, [placement, hostRef]);

    return (
        <div
            ref={barRef}
            className={styles.toolbar}
            role="toolbar"
            aria-label="Format selection"
            hidden={placement === null}
            onPointerDown={(event) => {
                // Keep the selection the toolbar is about to act on.
                event.preventDefault();
            }}
        >
            {BUTTONS.map(button => (
                <button
                    key={button.command}
                    type="button"
                    aria-label={button.label}
                    aria-pressed={button.toggle ? isMarkOn(marks, button.command) : undefined}
                    className={isMarkOn(marks, button.command) ? styles.isOn : undefined}
                    onClick={() => {
                        onCommand(button.command);
                    }}
                >
                    {button.content}
                </button>
            ))}
        </div>
    );
};
