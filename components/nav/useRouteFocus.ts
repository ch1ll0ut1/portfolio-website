'use client';

import { useEffect, useRef } from 'react';
import { focusTarget } from '@/components/chrome/scrollToSection';

/** The landmark every page renders, and the skip link's target. */
const MAIN_ID = 'main';

/**
 * Moves focus onto the new page after a client-side route change.
 *
 * Next swaps the page under a nav that stays mounted and scrolls, but leaves
 * focus alone: on the link that was clicked, or on `<body>` when that link
 * was part of the old page. Focus goes to the fragment's target when the URL
 * names one (a section link from a reading route), otherwise to `<main>`, so
 * the next Tab continues from the content the reader just arrived at.
 *
 * The first render is a full page load, where the browser has already placed
 * focus and the fragment, so it is left alone.
 */
export const useRouteFocus = (pathname: string | null) => {
    const previous = useRef(pathname);

    useEffect(() => {
        if (previous.current === pathname) {
            return;
        }

        previous.current = pathname;

        const fragment = window.location.hash.slice(1);
        const target = fragment === '' ? null : document.getElementById(fragment);

        focusTarget(target ?? document.getElementById(MAIN_ID));
    }, [pathname]);
};
