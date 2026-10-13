'use client';

import { type FC, Fragment, type RefObject } from 'react';
import { useApplePlatform } from '@/components/chrome/useApplePlatform';
import type { HeadingDoc } from './editorModel';
import { type TokenKind, headlineJsonLines } from './headlineJson';
import styles from './Hero.module.css';

/** `normalizing` and `selecting` both read as "work in progress" in the bar. */
export type PanelState = 'synced' | 'normalizing' | 'selecting';

export interface Props {
    doc: HeadingDoc;
    /**
     * Leaf keys that were already in the model before this update. Leaves
     * outside it flash; an empty baseline flashes nothing.
     */
    baseline: string[];
    /** `col 3` or `sel 12–21`, empty when the headline is not being edited. */
    position: string;
    state: PanelState;
    /** Id the headline points its `aria-describedby` at. */
    hintId: string;
    /** The "Edit headline" control, which is also where editing hands focus back. */
    editButtonRef: RefObject<HTMLButtonElement | null>;
    onEdit: () => void;
}

const NEWLINE = '\n';

const TOKEN_CLASS: Record<TokenKind, string> = {
    punct: styles.punct,
    key: styles.key,
    str: styles.str,
    bool: styles.bool,
};

/**
 * `headline.json` — the headline's live document model.
 *
 * Derived state only: it never writes to the editor. The point is to show that
 * the headline really is a document, so the JSON is syntax-coloured the way an
 * editor would and only the leaves that actually changed flash.
 */
export const DocumentModelPanel: FC<Props> = ({ doc, baseline, position, state, hintId, editButtonRef, onEdit }) => {
    const apple = useApplePlatform();
    const mod = apple ? '⌘' : 'Ctrl+';
    const highlight = apple ? '⌘⇧H' : 'Ctrl+Shift+H';

    return (
        <aside className={styles.tree} aria-label="Live document model of the headline">
            <div className={styles.treeBar}>
                <span className={styles.treeFile}>headline.json</span>
                <span className={styles.treePos} aria-hidden="true">{position}</span>
                <span className={`${styles.treeState} ${state === 'synced' ? '' : styles.isDirty}`}>
                    {state}
                </span>
            </div>
            <pre className={styles.treeCode} aria-live="off">
                {headlineJsonLines(doc, baseline).map(line => (
                    <Fragment key={line.id}>
                        {line.indent}
                        <span className={`${styles.ln} ${line.flash ? styles.flash : ''}`}>
                            {line.tokens.map((token, index) => (
                                <span key={index} className={TOKEN_CLASS[token.kind]}>{token.text}</span>
                            ))}
                        </span>
                        {NEWLINE}
                    </Fragment>
                ))}
            </pre>
            <div className={styles.treeHint}>
                <p id={hintId}>
                    The headline is a working editor. Select a word, press
                    {' '}
                    <kbd>{`${mod}B`}</kbd>
                    {', '}
                    <kbd>{`${mod}I`}</kbd>
                    {' or '}
                    <kbd>{highlight}</kbd>
                    , or type over it.
                    <span className="visually-hidden">
                        {' '}
                        With text selected, Alt+F10 moves to the format toolbar. Enter or Escape finishes editing.
                    </span>
                </p>
                <button className={styles.editButton} ref={editButtonRef} type="button" onClick={onEdit}>
                    Edit headline
                </button>
            </div>
        </aside>
    );
};
