'use client';

import { type FC, useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { emitStage } from '@/lib/motion';
import { whenIdle } from '@/lib/whenIdle';
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
 * function so the preload below warms exactly the chunk `dynamic` uses.
 */
const loadPalette = () => import('./CommandPalette').then(module => module.CommandPalette);
const loadShortcuts = () => import('./ShortcutsOverlay').then(module => module.ShortcutsOverlay);

const CommandPalette = dynamic(loadPalette, { ssr: false });
const ShortcutsOverlay = dynamic(loadShortcuts, { ssr: false });

/** Anything that opens the palette when clicked. */
const PALETTE_TRIGGER = '[data-cmdk]';

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
 * preloaded overlays survive client-side navigation. The document-wide reading
 * hairline steps aside while a page claims the strip for its own progress bar.
 */
export const GlobalChrome: FC = () => {
    const [overlay, setOverlay] = useState<OpenOverlay>('none');
    // Each overlay mounts, closed, as soon as its chunk is in, and then stays.
    // Mounting is what the first open used to pay for even with the chunk
    // cached: `dynamic` suspends on its first render, and React holds the
    // revealed boundary back for a few hundred milliseconds. Done ahead of
    // time, the first open only flips `open`. Staying mounted also lets an
    // overlay play its exit.
    const [paletteMounted, setPaletteMounted] = useState(false);
    const [shortcutsMounted, setShortcutsMounted] = useState(false);

    const close = useCallback(() => {
        setOverlay('none');
    }, []);

    const togglePalette = useCallback(() => {
        setPaletteMounted(true);
        setOverlay(current => (current === 'palette' ? 'none' : 'palette'));
    }, []);

    const openShortcuts = useCallback(() => {
        setShortcutsMounted(true);
        setOverlay('shortcuts');
    }, []);

    const preloadPalette = useCallback(() => {
        loadPalette().then(() => {
            setPaletteMounted(true);
        }, ignoreFailedPreload);
    }, []);

    // Warm both overlays once the page has loaded and gone idle, so a shortcut
    // pressed later opens straight away rather than waiting on the network.
    useEffect(() => whenIdle(() => {
        preloadPalette();
        loadShortcuts().then(() => {
            setShortcutsMounted(true);
        }, ignoreFailedPreload);
    }), [preloadPalette]);

    // A pointer arriving on the palette's button, or focus landing on it, is
    // the earliest sign the palette is about to be wanted.
    useEffect(() => {
        const handleIntent = (event: Event) => {
            if (!(event.target instanceof Element) || !event.target.closest(PALETTE_TRIGGER)) {
                return;
            }

            stopListening();
            preloadPalette();
        };

        const stopListening = () => {
            document.removeEventListener('pointerover', handleIntent);
            document.removeEventListener('focusin', handleIntent);
        };

        document.addEventListener('pointerover', handleIntent);
        document.addEventListener('focusin', handleIntent);

        return stopListening;
    }, [preloadPalette]);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (!(event.target instanceof Element)) {
                return;
            }

            if (event.target.closest(PALETTE_TRIGGER)) {
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
            {paletteMounted
                ? <CommandPalette open={overlay === 'palette'} onClose={close} onOpenShortcuts={openShortcuts} />
                : null}
            {shortcutsMounted ? <ShortcutsOverlay open={overlay === 'shortcuts'} onClose={close} /> : null}
            <KeyboardChords
                overlayOpen={overlay !== 'none'}
                onTogglePalette={togglePalette}
                onOpenShortcuts={openShortcuts}
            />
            <CaretCursor overlayOpen={overlay !== 'none'} />
        </>
    );
};

/**
 * A preload that fails (offline, or a deploy replaced the chunks) is not worth
 * a console error: opening the overlay asks `dynamic` to load it again.
 */
const ignoreFailedPreload = () => undefined;
