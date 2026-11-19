'use client';

import { type RefObject, useEffect, useRef } from 'react';
import { useScrollState } from '@/lib/motion';
import { isEditingTarget } from '@/components/chrome/isEditingTarget';

/** Below this the header stays transparent, so the hero reads as full-bleed. */
const BLUR_AT = 24;
/** Above this the header gets out of the way on the way down. */
const HIDE_AFTER = 400;
/** Ignores sub-pixel scroll jitter when deciding on a direction. */
const DIRECTION_DELTA = 4;
/**
 * How long a wheel, touch or scrolling key keeps counting as the reader
 * scrolling: long enough to cover a smooth key scroll or the start of a fling.
 */
const INTENT_MS = 600;
/** Keys the browser scrolls the page down with. */
const SCROLL_DOWN_KEYS = new Set(['ArrowDown', 'PageDown', 'End', ' ']);

/**
 * Gives the header its blurred background once the page is scrolled, and hides
 * it while scrolling down past the first screen.
 *
 * Classes are toggled directly rather than through React state: scroll fires
 * far too often to re-render on. Any `focusin` reveals the header again, so a
 * keyboard user can never tab into something parked off-screen.
 *
 * Only the reader's own scrolling hides it — a wheel, a touch, a scrolling key
 * or a drag on the scrollbar. A jump to a fragment is a scroll down too: the
 * browser's on a deep link like `/#work`, `scrollToSection`'s from the nav,
 * the palette or a chord, and `next/link`'s on a hash link. Each takes the
 * reader to a place, and the header should be there when they arrive.
 */
export const useHeaderScroll = (
    ref: RefObject<HTMLElement | null>,
    scrolledClass: string,
    hiddenClass: string,
) => {
    const lastY = useRef(0);
    const intent = useRef(false);

    useScrollState(({ y }) => {
        const header = ref.current;

        if (!header) {
            return;
        }

        header.classList.toggle(scrolledClass, y > BLUR_AT);

        const goingDown = y > lastY.current + DIRECTION_DELTA;
        const goingUp = y < lastY.current - DIRECTION_DELTA;

        if (goingDown && y > HIDE_AFTER && intent.current) {
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

        const stopIntent = watchScrollIntent((scrolling) => {
            intent.current = scrolling;
        });

        return () => {
            header.removeEventListener('focusin', reveal);
            stopIntent();
        };
    }, [ref, scrolledClass, hiddenClass]);
};

/**
 * Reports whether the reader is scrolling the page themselves.
 *
 * True from a wheel, touch or unclaimed scrolling key until `INTENT_MS` after
 * the last of them, and for as long as the scrollbar is held. A key the page
 * already handled (the palette's arrows) or one typed into a field does not
 * count, since the browser does not scroll for it.
 */
const watchScrollIntent = (onChange: (scrolling: boolean) => void) => {
    let timer = 0;
    let dragging = false;

    const settle = () => {
        window.clearTimeout(timer);
        timer = window.setTimeout(() => {
            onChange(false);
        }, INTENT_MS);
    };

    const scroll = () => {
        onChange(true);

        if (!dragging) {
            settle();
        }
    };

    const handleKey = (event: KeyboardEvent) => {
        if (SCROLL_DOWN_KEYS.has(event.key) && !event.defaultPrevented && !isEditingTarget(event.target)) {
            scroll();
        }
    };

    // A press on the scrollbar lands on the root element; one on the page
    // lands on whatever is under the pointer.
    const handlePointerDown = (event: PointerEvent) => {
        if (event.target === document.documentElement) {
            dragging = true;
            scroll();
        }
    };

    const handlePointerUp = () => {
        if (dragging) {
            dragging = false;
            settle();
        }
    };

    const options = { passive: true };

    window.addEventListener('wheel', scroll, options);
    window.addEventListener('touchmove', scroll, options);
    window.addEventListener('keydown', handleKey);
    window.addEventListener('pointerdown', handlePointerDown, options);
    window.addEventListener('pointerup', handlePointerUp, options);
    window.addEventListener('pointercancel', handlePointerUp, options);

    return () => {
        window.clearTimeout(timer);
        window.removeEventListener('wheel', scroll);
        window.removeEventListener('touchmove', scroll);
        window.removeEventListener('keydown', handleKey);
        window.removeEventListener('pointerdown', handlePointerDown);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointercancel', handlePointerUp);
    };
};
