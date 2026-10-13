'use client';

import { type FC, type KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from '@/lib/motion';
import { commands } from '@/config/commands';
import { CommandList } from './CommandList';
import { Overlay } from './Overlay';
import { filterCommands } from './commandFilter';
import { runCommand } from './runCommand';
import styles from './CommandPalette.module.css';

const LIST_ID = 'cmdk-list';
const OPTION_PREFIX = 'cmdk-option';
const NARROW_QUERY = '(max-width: 479px)';
/** How long the entrance stagger stays armed after opening. */
const INTRO_MS = 900;
/** Lets the overlay start closing before the command does anything visible. */
const RUN_DELAY_MS = 30;

interface Props {
    open: boolean;
    onClose: () => void;
    onOpenShortcuts: () => void;
}

/**
 * The ⌘K command palette, built to the APG combobox-with-listbox pattern.
 *
 * One source of truth for "where can I go and what can I do", filtered by a
 * plain substring match over label, hint and group. Focus never leaves the
 * input: the arrows move `aria-activedescendant`, and a polite status line
 * reports how many commands the query left.
 */
export const CommandPalette: FC<Props> = ({ open, onClose, onOpenShortcuts }) => {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState(0);
    const [intro, setIntro] = useState(false);
    const [wasOpen, setWasOpen] = useState(false);
    const narrow = useMediaQuery(NARROW_QUERY);

    // Every opening starts from a clean palette. Adjusted during render, as
    // React recommends for state that follows a prop, so the first painted
    // frame is already the fresh one.
    if (open !== wasOpen) {
        setWasOpen(open);

        if (open) {
            setQuery('');
            setSelected(0);
            setIntro(true);
        }
    }

    useEffect(() => {
        if (!intro) {
            return;
        }

        const timer = window.setTimeout(() => {
            setIntro(false);
        }, INTRO_MS);

        return () => {
            window.clearTimeout(timer);
        };
    }, [intro]);

    const filtered = useMemo(() => filterCommands(commands, query), [query]);
    // The filter can shrink the list under the selection, so the rendered index
    // is derived rather than stored — nothing has to chase it back into range.
    const active = Math.min(selected, Math.max(0, filtered.length - 1));
    const expanded = filtered.length > 0;

    const run = (index: number) => {
        // `.at` rather than an index: a stale hover index must not crash the run.
        const command = filtered.at(index);

        if (!command) {
            return;
        }

        onClose();

        const handlers = {
            openShortcuts: onOpenShortcuts,
            navigate: (href: string) => {
                router.push(href);
            },
        };

        // Opening a tab has to stay inside the click's gesture or the popup
        // blocker eats it; everything else can wait for the overlay to leave.
        if (command.action.type === 'external') {
            runCommand(command.action, handlers);

            return;
        }

        window.setTimeout(() => {
            runCommand(command.action, handlers);
        }, RUN_DELAY_MS);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (!expanded) {
            return;
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setSelected((active + 1) % filtered.length);
        }
        else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setSelected((active - 1 + filtered.length) % filtered.length);
        }
        else if (event.key === 'Enter') {
            event.preventDefault();
            run(active);
        }
    };

    return (
        <Overlay open={open} label="Command menu" focusRef={inputRef} onClose={onClose}>
            <div className={styles.search}>
                <input
                    className={styles.input}
                    ref={inputRef}
                    type="text"
                    placeholder={narrow ? 'Search commands' : 'Jump to a section or run a command'}
                    autoComplete="off"
                    spellCheck={false}
                    role="combobox"
                    aria-label="Search commands"
                    aria-autocomplete="list"
                    aria-expanded={expanded}
                    aria-controls={LIST_ID}
                    aria-activedescendant={expanded ? `${OPTION_PREFIX}-${active}` : undefined}
                    value={query}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setSelected(0);
                        setIntro(false);
                    }}
                    onKeyDown={handleKeyDown}
                />
                <kbd>esc</kbd>
            </div>
            <CommandList
                id={LIST_ID}
                optionIdPrefix={OPTION_PREFIX}
                commands={filtered}
                selected={active}
                intro={intro}
                onHover={setSelected}
                onRun={run}
            />
            {expanded ? null : <p className={styles.empty}>No matches. Try “work” or “email”.</p>}
            <p className="visually-hidden" role="status">{resultStatus(query, filtered.length)}</p>
            <div className={styles.foot} aria-hidden="true">
                <span>
                    <kbd>↑</kbd>
                    <kbd>↓</kbd>
                    {' '}
                    move
                </span>
                <span>
                    <kbd>↵</kbd>
                    {' '}
                    run
                </span>
                <span>
                    <kbd>?</kbd>
                    {' '}
                    shortcuts
                </span>
            </div>
        </Overlay>
    );
};

/**
 * What the status line announces. Silent until something is typed: on open the
 * dialog's name and the input are announced already, and a count on top would
 * talk over them.
 */
const resultStatus = (query: string, count: number) => {
    if (query.trim() === '') {
        return '';
    }

    if (count === 0) {
        return 'No matching commands';
    }

    return count === 1 ? '1 command' : `${count} commands`;
};
