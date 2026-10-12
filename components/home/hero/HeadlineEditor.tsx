'use client';

import { type ClipboardEvent, type FC, type KeyboardEvent, type RefObject, memo, useEffect } from 'react';
import { heroHeadline } from '@/config/hero';
import styles from './Hero.module.css';

export interface Props {
    titleRef: RefObject<HTMLHeadingElement | null>;
    /** Element describing the editor's shortcuts. */
    hintId: string;
    onInput: () => void;
    onKeyDown: (event: KeyboardEvent<HTMLHeadingElement>) => void;
    onPaste: (event: ClipboardEvent<HTMLHeadingElement>) => void;
    onBlur: () => void;
}

const HeadlineEditorView: FC<Props> = ({ titleRef, hintId, onInput, onKeyDown, onPaste, onBlur }) => {
    useEffect(() => {
        const title = titleRef.current;

        if (!title) {
            return;
        }

        // Editing turns on only once this subtree has hydrated. Shipping
        // contentEditable in the server markup would invite a visitor to type
        // into a headline nothing is listening to yet, and hydration would then
        // find text it never rendered and discard the subtree — taking their
        // keystrokes and their caret with it.
        title.setAttribute('contenteditable', 'true');

        return () => {
            title.removeAttribute('contenteditable');
        };
    }, [titleRef]);

    return (
        <h1
            ref={titleRef}
            className={styles.title}
            spellCheck={false}
            autoCapitalize="off"
            aria-describedby={hintId}
            data-cursor="text"
            onInput={onInput}
            onKeyDown={onKeyDown}
            onPaste={onPaste}
            onBlur={onBlur}
        >
            {heroHeadline.before}
            <mark>{heroHeadline.highlight}</mark>
            {heroHeadline.after}
        </h1>
    );
};

/**
 * The editable headline.
 *
 * Deliberately frozen after mount: the comparator always reports equal, so
 * React renders this subtree exactly once and then never reconciles it again.
 * From that point the DOM belongs to the browser's editing engine and to
 * `editorDom`, and the JSON panel is derived by reading it — never the other
 * way round. React diffing a tree the visitor is typing into would fight the
 * caret and drop characters.
 *
 * The consequence for callers: every handler passed in must be stable, because
 * the ones captured at mount are the ones that keep running.
 */
export const HeadlineEditor = memo(HeadlineEditorView, () => true);
