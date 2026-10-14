'use client';

import { type CSSProperties, type FC, useEffect, useRef } from 'react';
import type { Command } from '@/config/commands';
import { groupCommands } from './commandFilter';
import styles from './CommandPalette.module.css';

/** How long the caret is held solid while the highlight travels. */
const SOLID_MS = 400;

/** `--i` drives the entrance stagger; the CSS reads it per row. */
interface RowStyle extends CSSProperties {
    '--i': number;
}

interface Props {
    id: string;
    /** Option ids are `${optionIdPrefix}-${index}`, matching aria-activedescendant. */
    optionIdPrefix: string;
    commands: Command[];
    selected: number;
    /** Runs the entrance stagger. Dropped once the user starts typing. */
    intro: boolean;
    onHover: (index: number) => void;
    onRun: (index: number) => void;
}

/**
 * The palette's listbox, with one `group` per heading.
 *
 * Options are never focused: focus stays in the combobox input, which points
 * at the active option with `aria-activedescendant`. That is also why the
 * options take clicks without key handlers — the keyboard runs them from the
 * input.
 *
 * The selection is one absolutely positioned highlight that slides between
 * rows instead of a background on each row, so moving down the list reads as a
 * single object travelling. It animates only when the selection moved; a
 * changed filter re-places it instantly, since sliding between two unrelated
 * lists would be noise. A fresh opening mounts a fresh list, so the first
 * placement never animates either.
 *
 * The rows are measured in a passive effect, not a layout effect: the list
 * mounts inside the `<dialog>`, and a child's layout effect runs before the
 * `Overlay`'s layout effect has called `showModal()`, when the dialog is still
 * `display: none` and every row measures 0. Passive effects run after every
 * layout effect, and for a key press or click before the frame is painted.
 */
export const CommandList: FC<Props> = ({ id, optionIdPrefix, commands, selected, intro, onHover, onRun }) => {
    const groups = groupCommands(commands);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const highlightRef = useRef<HTMLDivElement>(null);
    const previousCommands = useRef<Command[] | null>(null);
    const solidTimer = useRef(0);

    useEffect(() => {
        const highlight = highlightRef.current;
        const item = itemRefs.current[selected];
        const animate = previousCommands.current === commands;

        previousCommands.current = commands;

        if (!highlight) {
            return;
        }

        if (!item || commands.length === 0) {
            highlight.style.opacity = '0';

            return;
        }

        highlight.classList.toggle(styles.live, animate);
        highlight.style.opacity = '1';
        highlight.style.setProperty('--y', `${item.offsetTop}px`);
        highlight.style.height = `${item.offsetHeight}px`;

        if (animate) {
            item.scrollIntoView({ block: 'nearest' });
        }

        highlight.classList.add(styles.solid);
        window.clearTimeout(solidTimer.current);
        solidTimer.current = window.setTimeout(() => {
            highlight.classList.remove(styles.solid);
        }, SOLID_MS);
    }, [commands, selected]);

    useEffect(() => () => {
        window.clearTimeout(solidTimer.current);
    }, []);

    return (
        <div
            className={intro ? `${styles.list} ${styles.intro}` : styles.list}
            id={id}
            role="listbox"
            aria-label="Commands"
            hidden={commands.length === 0}
        >
            <div className={styles.highlight} ref={highlightRef} aria-hidden="true" />
            {groups.map((group) => {
                const headingId = `${id}-group-${group.order}`;
                const headingStyle: RowStyle = { '--i': group.order };

                return (
                    <div role="group" aria-labelledby={headingId} key={group.label}>
                        <div className={styles.group} id={headingId} role="presentation" style={headingStyle}>
                            {group.label}
                        </div>
                        {group.items.map((item) => {
                            const style: RowStyle = { '--i': item.order };

                            return (
                                // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- the combobox input runs options from the keyboard
                                <div
                                    className={styles.item}
                                    key={item.command.id}
                                    id={`${optionIdPrefix}-${item.index}`}
                                    role="option"
                                    tabIndex={-1}
                                    aria-selected={item.index === selected}
                                    style={style}
                                    ref={(node) => {
                                        itemRefs.current[item.index] = node;
                                    }}
                                    onPointerMove={() => {
                                        onHover(item.index);
                                    }}
                                    onClick={() => {
                                        onRun(item.index);
                                    }}
                                >
                                    <span>{item.command.label}</span>
                                    {item.command.hint ? <small>{item.command.hint}</small> : null}
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};
