'use client';

import { type FocusEvent, type RefObject, useEffect, useRef } from 'react';

/** The landmark every page renders, and the skip link's target. */
const MAIN_ID = 'main';

/**
 * Keeps keyboard focus on the page when the consent banner goes away.
 *
 * A choice unmounts the banner under the button that made it, which would
 * drop focus to `<body>` and send the next Tab back to the top of the
 * document. Focus goes back to where it was before it entered the banner,
 * or to `<main>` when that is gone or focus came from outside the page.
 *
 * - `onFocus` goes on the banner, to remember where focus came from.
 * - `returnFocus` runs just before a banner button records a choice, while
 *   the banner is still mounted, so focus is never on a removed element.
 * - A choice saved in the preferences dialog removes the banner and the
 *   dialog together; the dialog closes first and cannot return focus to the
 *   banner's Customize button, so once the banner is gone focus is returned
 *   here, if nothing else has taken it.
 */
export const useBannerFocusReturn = (bannerRef: RefObject<HTMLElement | null>, showBanner: boolean) => {
    const returnRef = useRef<HTMLElement | null>(null);
    const wasShown = useRef(false);

    useEffect(() => {
        if (showBanner) {
            wasShown.current = true;

            return;
        }

        if (!wasShown.current) {
            return;
        }

        wasShown.current = false;

        const active = document.activeElement;

        if (active === null || active === document.body) {
            restoreFocus(returnRef);
        }
    }, [showBanner]);

    /** Remembers where focus came from, unless from the banner itself or a dialog. */
    const onFocus = (event: FocusEvent<HTMLElement>) => {
        const from = event.relatedTarget;

        if (from instanceof HTMLElement && !event.currentTarget.contains(from) && !from.closest('dialog')) {
            returnRef.current = from;
        }
    };

    /** Moves focus off the banner, if it is on it, before the banner unmounts. */
    const returnFocus = () => {
        if (bannerRef.current?.contains(document.activeElement)) {
            restoreFocus(returnRef);
        }
    };

    return { onFocus, returnFocus };
};

/**
 * Focuses the remembered element, or `<main>` when that is gone or will not
 * take focus (hidden or disabled since).
 */
const restoreFocus = (returnRef: RefObject<HTMLElement | null>) => {
    const target = returnRef.current;

    returnRef.current = null;

    if (target?.isConnected) {
        target.focus({ preventScroll: true });

        if (document.activeElement === target) {
            return;
        }
    }

    document.getElementById(MAIN_ID)?.focus({ preventScroll: true });
};
