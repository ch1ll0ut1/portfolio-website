'use client';

import { type FC, type RefObject, memo, useEffect } from 'react';
import { heroHeadline, heroKicker } from '@/config/hero';
import styles from './Hero.module.css';

const KICKER_SEPARATOR = ' · ';
const HEADLINE_TEXT = `${heroHeadline.before}${heroHeadline.highlight}${heroHeadline.after}`;
/** The kicker, then the shipped headline: the heading in reading order. */
const HEADING_NAME = `${heroKicker.join(KICKER_SEPARATOR)}. ${HEADLINE_TEXT}`;

export interface Props {
    titleRef: RefObject<HTMLElement | null>;
    /** Element describing the editor's shortcuts. */
    hintId: string;
    onInput: () => void;
    onKeyDown: (event: KeyboardEvent) => void;
    onPaste: (event: ClipboardEvent) => void;
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
        // keystrokes and their caret with it. The textbox role arrives with it,
        // so assistive technology is never promised an editor that is not one.
        //
        // `tabindex="-1"` keeps it out of the Tab order: the editor is opt-in,
        // through the "Edit headline" control or a click, so a keyboard user
        // walking the page is not dropped into a text field on the way.
        title.setAttribute('contenteditable', 'true');
        title.setAttribute('role', 'textbox');
        title.setAttribute('aria-multiline', 'false');
        title.setAttribute('aria-label', 'Headline');
        title.setAttribute('aria-describedby', hintId);
        title.tabIndex = -1;

        // Native listeners rather than JSX props: the element only becomes an
        // interactive widget here, and these handlers are stable for its life.
        title.addEventListener('input', onInput);
        title.addEventListener('keydown', onKeyDown);
        title.addEventListener('paste', onPaste);
        title.addEventListener('blur', onBlur);

        return () => {
            title.removeEventListener('input', onInput);
            title.removeEventListener('keydown', onKeyDown);
            title.removeEventListener('paste', onPaste);
            title.removeEventListener('blur', onBlur);
            title.removeAttribute('contenteditable');
            title.removeAttribute('role');
            title.removeAttribute('aria-multiline');
            title.removeAttribute('aria-label');
            title.removeAttribute('aria-describedby');
            title.removeAttribute('tabindex');
        };
    }, [titleRef, hintId, onInput, onKeyDown, onPaste, onBlur]);

    // The heading is named by the kicker and the shipped headline, not by
    // whatever the visitor has typed into the editor inside it: the page's
    // outline stays the page's, and the editor is a widget within it. A label
    // rather than a hidden copy of the text, so the heading's text content
    // carries the headline once.
    return (
        <h1 aria-label={HEADING_NAME}>
            <span className={styles.kicker}>
                {heroKicker.map((part, index) => (
                    <span key={part} className={styles.kickerPart}>
                        {index > 0 && <span aria-hidden="true">{KICKER_SEPARATOR}</span>}
                        {part}
                    </span>
                ))}
            </span>
            {' '}
            <span
                ref={titleRef}
                className={styles.title}
                spellCheck={false}
                autoCapitalize="off"
                data-cursor="text"
            >
                {heroHeadline.before}
                <mark>{heroHeadline.highlight}</mark>
                {heroHeadline.after}
            </span>
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
