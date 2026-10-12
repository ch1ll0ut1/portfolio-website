'use client';

import { type RefObject, useEffect, useRef } from 'react';
import { EASE, isIntroDone, prefersReducedMotion, tween, useIntro } from '@/lib/motion';

/** The entrance only makes sense when the reader starts at the top of the page. */
const MAX_START_SCROLL = 80;
/** Last resort: the pre-state is dropped even if the intro signal never arrives. */
const FAILSAFE_MS = 2500;
const DURATION_MS = 800;
const LEAD_IN_MS = 120;
const STAGGER_MS = 50;

/**
 * Drops the header's parts in behind the hero's intro.
 *
 * The pre-state is armed from an effect rather than from the markup, so the
 * server-rendered header is readable with JS disabled or still loading, and it
 * is released three independent ways — the intro signal, a failsafe timer, and
 * unmount — so the header can never be left invisible.
 *
 * Items are matched by data attribute: `[data-nav-item]` for parts this nav
 * owns, and every direct child of `[data-nav-tools]`, which covers buttons
 * slotted in from outside.
 */
export const useNavEntrance = (ref: RefObject<HTMLElement | null>, preClass: string) => {
    const armed = useRef(false);
    const intro = useIntro();

    useEffect(() => {
        const header = ref.current;

        if (!header || prefersReducedMotion() || isIntroDone() || window.scrollY > MAX_START_SCROLL) {
            return;
        }

        header.classList.add(preClass);
        armed.current = true;

        const failsafe = window.setTimeout(() => {
            header.classList.remove(preClass);
            armed.current = false;
        }, FAILSAFE_MS);

        return () => {
            window.clearTimeout(failsafe);
            header.classList.remove(preClass);
            armed.current = false;
        };
    }, [ref, preClass]);

    useEffect(() => {
        const header = ref.current;

        if (!intro || !armed.current || !header) {
            return;
        }

        armed.current = false;

        const items: HTMLElement[] = [];

        for (const item of header.querySelectorAll('[data-nav-item], [data-nav-tools] > *')) {
            // `offsetParent` is null for the parts the responsive breakpoints
            // hide, which must not be animated back into view.
            if (item instanceof HTMLElement && item.offsetParent !== null) {
                items.push(item);
            }
        }

        const animations = items.map((item, index) => tween(
            item,
            [
                { opacity: 0, transform: 'translate3d(0, -10px, 0)' },
                { opacity: 1, transform: 'none' },
            ],
            {
                duration: DURATION_MS,
                delay: LEAD_IN_MS + index * STAGGER_MS,
                easing: EASE.out,
                // `backwards` only: holding the end state would overwrite the
                // magnetic button's own transform for good.
                fill: 'backwards',
            },
        ));

        header.classList.remove(preClass);

        return () => {
            for (const animation of animations) {
                animation.cancel();
            }
        };
    }, [intro, ref, preClass]);
};
