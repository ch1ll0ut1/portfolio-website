'use client';

import { type RefObject, useEffect, useRef } from 'react';
import { useScrollState } from '@/lib/motion';

/** Below this the header stays transparent, so the hero reads as full-bleed. */
const BLUR_AT = 24;
/** Above this the header gets out of the way on the way down. */
const HIDE_AFTER = 400;
/** Ignores sub-pixel scroll jitter when deciding on a direction. */
const DIRECTION_DELTA = 4;

/**
 * Gives the header its blurred background once the page is scrolled, and hides
 * it while scrolling down past the first screen.
 *
 * Classes are toggled directly rather than through React state: scroll fires
 * far too often to re-render on. Any `focusin` reveals the header again, so a
 * keyboard user can never tab into something parked off-screen.
 */
export const useHeaderScroll = (
    ref: RefObject<HTMLElement | null>,
    scrolledClass: string,
    hiddenClass: string,
) => {
    const lastY = useRef(0);

    useScrollState(({ y }) => {
        const header = ref.current;

        if (!header) {
            return;
        }

        header.classList.toggle(scrolledClass, y > BLUR_AT);

        const goingDown = y > lastY.current + DIRECTION_DELTA;
        const goingUp = y < lastY.current - DIRECTION_DELTA;

        if (goingDown && y > HIDE_AFTER) {
            header.classList.add(hiddenClass);
        }
        else if (goingUp || y < HIDE_AFTER) {
            header.classList.remove(hiddenClass);
        }

        lastY.current = y;
    });

    useEffect(() => {
        const header = ref.current;

        if (!header) {
            return;
        }

        // A page restored mid-document gets its scrolled state before the first
        // scroll event arrives.
        lastY.current = window.scrollY;
        header.classList.toggle(scrolledClass, window.scrollY > BLUR_AT);

        const reveal = () => {
            header.classList.remove(hiddenClass);
        };

        header.addEventListener('focusin', reveal);

        return () => {
            header.removeEventListener('focusin', reveal);
        };
    }, [ref, scrolledClass, hiddenClass]);
};
