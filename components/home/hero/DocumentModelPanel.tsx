'use client';

import type { FC, RefObject } from 'react';
import { useApplePlatform } from '@/components/chrome/useApplePlatform';
import { heroCopy } from '@/config/home/hero';
import type { HeroPanelState } from '@/config/home/hero/types';
import { useLocale } from '@/lib/i18n/LocaleContext';
import type { HeadingDoc } from './editorModel';
import { type TokenKind, headlineJsonLines } from './headlineJson';
import styles from './Hero.module.css';

/** `normalizing` and `selecting` both read as "work in progress" in the bar. */
export type PanelState = HeroPanelState;

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
    const { editor } = heroCopy[useLocale()];
    const apple = useApplePlatform();
    const mod = apple ? '⌘' : `${editor.keys.ctrl}+`;
    const highlight = apple ? '⌘⇧H' : `${editor.keys.ctrl}+${editor.keys.shift}+H`;

    return (
        <aside className={styles.tree} aria-label={editor.panelLabel}>
            <div className={styles.treeBar}>
                <span className={styles.treeFile}>headline.json</span>
                <span className={styles.treePos} aria-hidden="true">{position}</span>
                <span className={`${styles.treeState} ${state === 'synced' ? '' : styles.isDirty}`}>
                    {editor.states[state]}
                </span>
            </div>
            <pre className={styles.treeCode} aria-live="off">
                {headlineJsonLines(doc, baseline).map(line => (
                    <span key={line.id} className={styles.row}>
                        <span className={styles.indent}>{line.indent}</span>
                        <span className={styles.code}>
                            <span className={`${styles.ln} ${line.leaf ? styles.leaf : ''} ${line.flash ? styles.flash : ''}`}>
                                {line.tokens.map((token, index) => (
                                    <span key={index} className={TOKEN_CLASS[token.kind]}>{token.text}</span>
                                ))}
                            </span>
                        </span>
                    </span>
                ))}
            </pre>
            <div className={styles.treeHint}>
                <p id={hintId}>
                    {editor.hint.intro}
                    {' '}
                    <kbd>{`${mod}B`}</kbd>
                    {editor.hint.comma}
                    <kbd>{`${mod}I`}</kbd>
                    {editor.hint.or}
                    <kbd>{highlight}</kbd>
                    {editor.hint.outro}
                    <span className="visually-hidden">
                        {' '}
                        {editor.hintKeyboard}
                    </span>
                </p>
                <button className={styles.editButton} ref={editButtonRef} type="button" onClick={onEdit}>
                    {editor.editButton}
                </button>
            </div>
        </aside>
    );
};
