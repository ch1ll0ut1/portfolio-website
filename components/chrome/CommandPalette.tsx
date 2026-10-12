'use client';

import { type FC, type KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { watchMedia } from '@/lib/motion';
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
 * The ⌘K command palette.
 *
 * One source of truth for "where can I go and what can I do", filtered by a
 * plain substring match over label, hint and group.
 */
export const CommandPalette: FC<Props> = ({ open, onClose, onOpenShortcuts }) => {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState(0);
    const [intro, setIntro] = useState(false);
    const [narrow, setNarrow] = useState(false);

    const filtered = useMemo(() => filterCommands(commands, query), [query]);
    // The filter can shrink the list under the selection, so the rendered index
    // is derived rather than stored — nothing has to chase it back into range.
    const active = Math.min(selected, Math.max(0, filtered.length - 1));

    useEffect(() => {
        // Read once as well as subscribe: `watchMedia` only reports changes.
        setNarrow(window.matchMedia(NARROW_QUERY).matches);

        return watchMedia(NARROW_QUERY, setNarrow);
    }, []);

    useEffect(() => {
        if (!open) {
            return;
        }

        setQuery('');
        setSelected(0);
        setIntro(true);

        const timer = window.setTimeout(() => {
            setIntro(false);
        }, INTRO_MS);

        return () => {
            window.clearTimeout(timer);
        };
    }, [open]);

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

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (filtered.length === 0) {
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
        <Overlay
            open={open}
            label="Command menu"
            focusRef={inputRef}
            onClose={onClose}
            onKeyDown={handleKeyDown}
        >
            <div className={styles.search}>
                <input
                    className={styles.input}
                    ref={inputRef}
                    type="text"
                    placeholder={narrow ? 'Search commands' : 'Jump to a section or run a command'}
                    autoComplete="off"
                    spellCheck={false}
                    role="combobox"
                    aria-expanded
                    aria-controls={LIST_ID}
                    aria-activedescendant={filtered.length > 0 ? `${OPTION_PREFIX}-${active}` : undefined}
                    value={query}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setSelected(0);
                        setIntro(false);
                    }}
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
