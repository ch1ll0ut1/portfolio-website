'use client';

import { type CSSProperties, type FC, useLayoutEffect, useRef } from 'react';
import type { Command } from '@/config/commands';
import { buildCommandRows } from './commandFilter';
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
 * The palette's listbox.
 *
 * The selection is one absolutely positioned highlight that slides between
 * rows instead of a background on each row, so moving down the list reads as a
 * single object travelling. It animates only when the selection moved; a
 * changed filter re-places it instantly, since sliding between two unrelated
 * lists would be noise.
 */
export const CommandList: FC<Props> = ({ id, optionIdPrefix, commands, selected, intro, onHover, onRun }) => {
    const rows = buildCommandRows(commands);
    const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
    const highlightRef = useRef<HTMLLIElement>(null);
    const previousCommands = useRef<Command[] | null>(null);
    const solidTimer = useRef(0);

    useLayoutEffect(() => {
        const highlight = highlightRef.current;
        const item = itemRefs.current[selected];
        const animate = previousCommands.current === commands;

        previousCommands.current = commands;

        if (!highlight) {
            return;
        }

        if (!item) {
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

    useLayoutEffect(() => () => {
        window.clearTimeout(solidTimer.current);
    }, []);

    if (commands.length === 0) {
        return (
            <ul className={styles.list} id={id} role="listbox" aria-label="Commands">
                <li className={styles.empty}>No matches. Try “work” or “email”.</li>
            </ul>
        );
    }

    return (
        <ul
            className={intro ? `${styles.list} ${styles.intro}` : styles.list}
            id={id}
            role="listbox"
            aria-label="Commands"
        >
            <li className={styles.highlight} ref={highlightRef} role="presentation" aria-hidden="true" />
            {rows.map((row) => {
                const style: RowStyle = { '--i': row.order };

                if (row.kind === 'group') {
                    return (
                        <li className={styles.group} key={`group-${row.label}`} role="presentation" style={style}>
                            {row.label}
                        </li>
                    );
                }

                return (
                    <li
                        className={styles.item}
                        key={row.command.id}
                        id={`${optionIdPrefix}-${row.index}`}
                        role="option"
                        aria-selected={row.index === selected}
                        style={style}
                        ref={(node) => {
                            itemRefs.current[row.index] = node;
                        }}
                        onPointerMove={() => {
                            onHover(row.index);
                        }}
                        onClick={() => {
                            onRun(row.index);
                        }}
                    >
                        <span>{row.command.label}</span>
                        {row.command.hint ? <small>{row.command.hint}</small> : null}
                    </li>
                );
            })}
        </ul>
    );
};
