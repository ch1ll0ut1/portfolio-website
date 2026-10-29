'use client';

import {
    type FC,
    type KeyboardEvent,
    type ReactNode,
    type RefObject,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
import { EASE, clamp, prefersReducedMotion } from '@/lib/motion';
import { readSelection, serializeEditor } from './editorDom';
import { type MarkName, type MarkSet, NO_MARKS, isMarkFullyApplied } from './editorModel';
import styles from './Hero.module.css';

export type FormatCommand = MarkName | 'reset';

export interface Props {
    editorRef: RefObject<HTMLElement | null>;
    /** Positioning context. The toolbar is clamped inside it. */
    hostRef: RefObject<HTMLElement | null>;
    /** The toolbar element, shared so the editor can send focus into it. */
    toolbarRef: RefObject<HTMLDivElement | null>;
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

/** Where an arrow, Home or End key moves the toolbar's focus, or null for other keys. */
const nextIndex = (key: string, current: number, count: number) => {
    switch (key) {
        case 'ArrowRight':
            return (current + 1) % count;
        case 'ArrowLeft':
            return (current - 1 + count) % count;
        case 'Home':
            return 0;
        case 'End':
            return count - 1;
        default:
            return null;
    }
};

/**
 * The floating format toolbar.
 *
 * Follows a non-collapsed selection inside the headline and reflects that
 * selection's marks. It lives outside the editable subtree, so it is free to
 * be ordinary React state; only its position is written imperatively, since it
 * is measured from the live selection rectangle.
 *
 * Keyboard support follows the APG toolbar pattern: one Tab stop, with the
 * arrows, Home and End moving between buttons (a roving tabindex). Alt+F10 in
 * the editor comes here; Escape goes back to the editor with the selection
 * intact.
 */
export const FormatToolbar: FC<Props> = ({ editorRef, hostRef, toolbarRef, onCommand }) => {
    const wasVisible = useRef(false);
    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const [placement, setPlacement] = useState<{ x: number; y: number } | null>(null);
    const [marks, setMarks] = useState<MarkSet>(NO_MARKS);
    const [focusIndex, setFocusIndex] = useState(0);

    const place = useCallback(() => {
        const editor = editorRef.current;
        const host = hostRef.current;
        const selection = window.getSelection();
        const current = editor ? readSelection(editor) : null;
        const rect = current && !current.collapsed ? selection?.getRangeAt(0).getBoundingClientRect() : null;

        if (!editor || !host || !current || !rect || rect.width === 0) {
            // A toolbar that vanishes while it holds focus would drop focus on
            // the page body; hand it back to the text it was formatting.
            if (toolbarRef.current?.contains(document.activeElement)) {
                editor?.focus();
            }

            setPlacement(null);

            return;
        }

        const hostRect = host.getBoundingClientRect();

        setPlacement({
            x: rect.left + rect.width / 2 - hostRect.left,
            y: rect.top - hostRect.top - SELECTION_GAP,
        });
        setMarks(marksOfSelection(editor, current.start, current.end));
    }, [editorRef, hostRef, toolbarRef]);

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
        const element = toolbarRef.current;
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
    }, [placement, hostRef, toolbarRef]);

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            editorRef.current?.focus();

            return;
        }

        const next = nextIndex(event.key, index, BUTTONS.length);

        if (next === null) {
            return;
        }

        event.preventDefault();
        setFocusIndex(next);
        buttonRefs.current[next]?.focus();
    };

    return (
        <div
            ref={toolbarRef}
            className={styles.toolbar}
            role="toolbar"
            aria-label="Format selection"
            hidden={placement === null}
            onPointerDown={(event) => {
                // Keep the selection the toolbar is about to act on.
                event.preventDefault();
            }}
        >
            {BUTTONS.map((button, index) => (
                <button
                    key={button.command}
                    ref={(node) => {
                        buttonRefs.current[index] = node;
                    }}
                    type="button"
                    tabIndex={index === focusIndex ? 0 : -1}
                    aria-label={button.label}
                    aria-pressed={button.toggle ? isMarkOn(marks, button.command) : undefined}
                    className={isMarkOn(marks, button.command) ? styles.isOn : undefined}
                    onKeyDown={(event) => {
                        handleKeyDown(event, index);
                    }}
                    onFocus={() => {
                        setFocusIndex(index);
                    }}
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
