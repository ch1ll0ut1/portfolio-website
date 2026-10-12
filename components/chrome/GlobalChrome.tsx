'use client';

import { type FC, useCallback, useEffect, useState } from 'react';
import { CaretCursor } from './CaretCursor';
import { CommandPalette } from './CommandPalette';
import { Grain } from './Grain';
import { KeyboardChords } from './KeyboardChords';
import { ScrollProgress } from './ScrollProgress';
import { ShortcutsOverlay } from './ShortcutsOverlay';
import { printConsoleGreeting } from './consoleGreeting';
import { toggleTheme } from './themeStore';

type OpenOverlay = 'none' | 'palette' | 'shortcuts';

interface Props {
    /**
     * Renders the document-wide reading hairline. Set `false` on a page that
     * shows its own, narrower progress bar — two bars measuring different
     * things paint as one stepped line at the top of the viewport.
     */
    scrollProgress?: boolean;
}

/**
 * The page's global shell: grain, scroll progress, the ⌘K palette, the
 * shortcuts list, the keyboard layer and the custom cursor.
 *
 * Only one overlay is ever open, so that is one piece of state rather than a
 * flag per overlay — opening the palette from the shortcuts list closes it
 * without either having to know about the other.
 *
 * Triggers are wired by attribute rather than by prop: a click on anything
 * matching `[data-cmdk]` or `[data-theme-toggle]`, anywhere in the document,
 * reaches this component. That keeps the nav free to style its own buttons.
 */
export const GlobalChrome: FC<Props> = ({ scrollProgress = true }) => {
    const [overlay, setOverlay] = useState<OpenOverlay>('none');

    const close = useCallback(() => {
        setOverlay('none');
    }, []);

    const togglePalette = useCallback(() => {
        setOverlay(current => (current === 'palette' ? 'none' : 'palette'));
    }, []);

    const openShortcuts = useCallback(() => {
        setOverlay('shortcuts');
    }, []);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (!(event.target instanceof Element)) {
                return;
            }

            if (event.target.closest('[data-cmdk]')) {
                togglePalette();

                return;
            }

            const toggle = event.target.closest('[data-theme-toggle]');

            if (toggle) {
                toggleTheme(toggle);
            }
        };

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [togglePalette]);

    useEffect(printConsoleGreeting, []);

    return (
        <>
            <Grain />
            {scrollProgress ? <ScrollProgress /> : null}
            <CommandPalette open={overlay === 'palette'} onClose={close} onOpenShortcuts={openShortcuts} />
            <ShortcutsOverlay open={overlay === 'shortcuts'} onClose={close} />
            <KeyboardChords
                overlayOpen={overlay !== 'none'}
                onTogglePalette={togglePalette}
                onOpenShortcuts={openShortcuts}
            />
            <CaretCursor overlayOpen={overlay !== 'none'} />
        </>
    );
};
