'use client';

import { type RefObject, useEffect } from 'react';

/** Read by the root's `scroll-padding-bottom` in globals.css. */
const FIXED_BOTTOM_PROPERTY = '--fixed-bottom';

/**
 * Publishes the height of fixed UI docked to the bottom edge, so focus never
 * lands underneath it (WCAG 2.4.11).
 *
 * The root's `scroll-padding-bottom` reads the property, which makes the
 * browser's own focus scrolling stop short of the docked element; the body's
 * bottom padding reads it too, so the end of the page can scroll clear; and the
 * case stack's focus handling (which scrolls pinned cards itself) reads the
 * same padding back. Kept current as the element resizes — the banner's copy
 * rewraps with the viewport — and removed once it is gone.
 */
export const useFixedBottomInset = (ref: RefObject<HTMLElement | null>, active: boolean) => {
    useEffect(() => {
        const element = ref.current;

        if (!active || !element) {
            return;
        }

        const root = document.documentElement;
        const publish = () => {
            root.style.setProperty(FIXED_BOTTOM_PROPERTY, `${element.offsetHeight}px`);
        };

        publish();

        const observer = new ResizeObserver(publish);

        observer.observe(element);

        return () => {
            observer.disconnect();
            root.style.removeProperty(FIXED_BOTTOM_PROPERTY);
        };
    }, [ref, active]);
};
