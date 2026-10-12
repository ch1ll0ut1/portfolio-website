'use client';

import { type CSSProperties, type FC, type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Overlay } from './Overlay';
import { isApplePlatform } from './isApplePlatform';
import { orderedChordSections } from './orderedChordSections';
import styles from './ShortcutsOverlay.module.css';

/** `--i` drives the row stagger; the CSS reads it per row. */
interface RowStyle extends CSSProperties {
    '--i': number;
}

interface Shortcut {
    /** Keys to print, in order. A two-key row is a chord. */
    keys: string[];
    label: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
}

/**
 * The `?` overlay.
 *
 * The chord rows are derived from `sections.ts`, so a section added there shows
 * up here without anyone remembering to update a second list.
 */
export const ShortcutsOverlay: FC<Props> = ({ open, onClose }) => {
    const closeRef = useRef<HTMLButtonElement>(null);
    const [apple, setApple] = useState(false);

    useEffect(() => {
        setApple(isApplePlatform());
    }, []);

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        // `?` opened this, so `?` closes it again.
        if (event.key === '?') {
            event.preventDefault();
            onClose();
        }
    };

    return (
        <Overlay
            open={open}
            labelledBy="shortcuts-title"
            panelClassName={styles.panel}
            focusRef={closeRef}
            onClose={onClose}
            onKeyDown={handleKeyDown}
        >
            <div className={styles.head}>
                <p className={styles.title} id="shortcuts-title">Keyboard shortcuts</p>
                <button
                    className={styles.close}
                    ref={closeRef}
                    type="button"
                    aria-label="Close shortcuts"
                    onClick={onClose}
                >
                    <kbd>esc</kbd>
                </button>
            </div>
            <dl className={styles.list}>
                {buildShortcuts(apple).map((shortcut, index) => {
                    const style: RowStyle = { '--i': index };

                    return (
                        <div className={styles.row} key={shortcut.label} style={style}>
                            <dt>
                                {shortcut.keys.map((key, position) => (
                                    <kbd className={position === 0 && shortcut.keys.length > 1 ? styles.prefix : undefined} key={key}>
                                        {key}
                                    </kbd>
                                ))}
                            </dt>
                            <dd>{shortcut.label}</dd>
                        </div>
                    );
                })}
            </dl>
        </Overlay>
    );
};

const buildShortcuts = (apple: boolean): Shortcut[] => [
    { keys: [apple ? '⌘' : 'Ctrl', 'K'], label: 'Command menu' },
    { keys: ['T'], label: 'Switch color theme' },
    ...orderedChordSections.map(section => ({
        keys: ['G', section.chord.toUpperCase()],
        label: section.id === 'top' ? 'Back to top' : `Go to ${section.label.toLowerCase()}`,
    })),
    { keys: ['?'], label: 'This list' },
];
