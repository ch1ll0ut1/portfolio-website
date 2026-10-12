'use client';

import { type FC, useEffect, useRef, useState } from 'react';
import { chordSections } from '@/config/sections';
import { ChordHint } from './ChordHint';
import { isEditingTarget } from './isEditingTarget';
import { scrollToSection } from './scrollToSection';
import { toggleTheme } from './themeStore';

/** How long a `g` stays armed before it gives up. */
const CHORD_MS = 1400;

interface Props {
    /** True while the palette or the shortcuts list is open; page keys stand down. */
    overlayOpen: boolean;
    onTogglePalette: () => void;
    onOpenShortcuts: () => void;
}

/**
 * The page's keyboard layer: one document handler for ⌘K, `t`, `?` and the
 * `g` chords.
 *
 * Single-letter shortcuts are only safe because every path checks the event
 * target first — a `g` typed into the hero's editor must stay a `g`.
 */
export const KeyboardChords: FC<Props> = ({ overlayOpen, onTogglePalette, onOpenShortcuts }) => {
    const [armed, setArmed] = useState(false);
    const armedRef = useRef(false);
    const timerRef = useRef(0);

    useEffect(() => {
        const disarm = () => {
            armedRef.current = false;
            setArmed(false);
            window.clearTimeout(timerRef.current);
        };

        const arm = () => {
            armedRef.current = true;
            setArmed(true);
            window.clearTimeout(timerRef.current);
            timerRef.current = window.setTimeout(disarm, CHORD_MS);
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            const modifier = event.metaKey || event.ctrlKey;

            // The palette's own shortcut is the one thing that works from
            // inside an input, since it is how you leave the input.
            if (modifier && !event.altKey && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                disarm();
                onTogglePalette();

                return;
            }

            if (overlayOpen || modifier || event.altKey || isEditingTarget(event.target)) {
                return;
            }

            const key = event.key.toLowerCase();

            if (armedRef.current) {
                disarm();

                const section = chordSections.find(candidate => candidate.chord === key);

                if (section) {
                    event.preventDefault();
                    scrollToSection(section.id);
                }

                return;
            }

            if (event.key === '?') {
                event.preventDefault();
                onOpenShortcuts();
            }
            else if (key === 't' && !event.shiftKey) {
                toggleTheme();
            }
            else if (key === 'g' && !event.shiftKey) {
                arm();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            window.clearTimeout(timerRef.current);
        };
    }, [overlayOpen, onTogglePalette, onOpenShortcuts]);

    return <ChordHint armed={armed} />;
};
