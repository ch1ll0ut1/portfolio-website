'use client';

import { type FC, useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { emitStage } from '@/lib/motion';
import { CaretCursor } from './CaretCursor';
import { Grain } from './Grain';
import { KeyboardChords } from './KeyboardChords';
import { ScrollProgress } from './ScrollProgress';
import { printConsoleGreeting } from './consoleGreeting';
import { useReadingProgressClaimed } from './readingProgressClaim';
import { followThemeAcrossTabs, toggleTheme } from './themeStore';

/*
 * The overlays are only code the first time someone opens one, so they load
 * on demand instead of shipping with every route. Each loader is a named
 * function so the idle prefetch below warms exactly the chunk `dynamic` uses.
 */
const loadPalette = () => import('./CommandPalette').then(module => module.CommandPalette);
const loadShortcuts = () => import('./ShortcutsOverlay').then(module => module.ShortcutsOverlay);

const CommandPalette = dynamic(loadPalette, { ssr: false });
const ShortcutsOverlay = dynamic(loadShortcuts, { ssr: false });

/** Fallback when the browser has no idle callback (Safari). */
const PREFETCH_DELAY_MS = 2000;

type OpenOverlay = 'none' | 'palette' | 'shortcuts';

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
 *
 * Rendered once by the root layout, so an open overlay, the cursor and the
 * prefetched chunks survive client-side navigation. The document-wide reading
 * hairline steps aside while a page claims the strip for its own progress bar.
 */
export const GlobalChrome: FC = () => {
    const [overlay, setOverlay] = useState<OpenOverlay>('none');
    // Each overlay mounts on its first open and then stays, so it can still
    // play its exit and every later open is instant.
    const [paletteUsed, setPaletteUsed] = useState(false);
    const [shortcutsUsed, setShortcutsUsed] = useState(false);

    const close = useCallback(() => {
        setOverlay('none');
    }, []);

    const togglePalette = useCallback(() => {
        setPaletteUsed(true);
        setOverlay(current => (current === 'palette' ? 'none' : 'palette'));
    }, []);

    const openShortcuts = useCallback(() => {
        setShortcutsUsed(true);
        setOverlay('shortcuts');
    }, []);

    // Fetch both chunks once the page is idle, so a shortcut pressed later
    // opens without waiting on the network.
    useEffect(() => {
        const prefetch = () => {
            void loadPalette();
            void loadShortcuts();
        };

        // Typed as always present, but Safari has no idle callback.
        if (typeof window.requestIdleCallback === 'function') {
            const handle = window.requestIdleCallback(prefetch);

            return () => {
                window.cancelIdleCallback(handle);
            };
        }

        const timer = window.setTimeout(prefetch, PREFETCH_DELAY_MS);

        return () => {
            window.clearTimeout(timer);
        };
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

    // A theme picked in another tab applies here too, like the preferences do.
    useEffect(followThemeAcrossTabs, []);

    // A client-side navigation swaps the document under the long-lived chrome,
    // so everything that cached a measurement (the scroll range above all) has
    // to take it again. The first run, on mount, is harmless.
    const pathname = usePathname();

    useEffect(() => {
        emitStage('layout');
    }, [pathname]);

    const pageOwnsProgress = useReadingProgressClaimed();

    return (
        <>
            <Grain />
            {pageOwnsProgress ? null : <ScrollProgress />}
            {paletteUsed
                ? <CommandPalette open={overlay === 'palette'} onClose={close} onOpenShortcuts={openShortcuts} />
                : null}
            {shortcutsUsed ? <ShortcutsOverlay open={overlay === 'shortcuts'} onClose={close} /> : null}
            <KeyboardChords
                overlayOpen={overlay !== 'none'}
                onTogglePalette={togglePalette}
                onOpenShortcuts={openShortcuts}
            />
            <CaretCursor overlayOpen={overlay !== 'none'} />
        </>
    );
};
