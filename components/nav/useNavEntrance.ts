'use client';

import { type RefObject, useEffect } from 'react';
import { EASE, isIntroPending, onStage, startStage, tween } from '@/lib/motion';

const DURATION_MS = 800;
const LEAD_IN_MS = 120;
const STAGGER_MS = 50;

/**
 * Drops the header's parts in behind the hero's intro.
 *
 * The start state is not set here: the boot script arms the page (`is-pre` on
 * `<html>`) before first paint, and `SiteNav.module.css` holds the parts hidden
 * off that class, so the header is never painted finished and then blanked. On
 * the `intro` signal this starts the drop-in, and the stage releases the class
 * straight afterwards in the same task. A page the boot script did not arm
 * (reduced motion, a deep link), or one the stage or an early-settled hero has
 * already released, gets no entrance at all — which is also why it never
 * replays.
 *
 * Items are matched by data attribute: `[data-nav-item]` for parts this nav
 * owns, and every direct child of `[data-nav-tools]`, which covers buttons
 * slotted in from outside.
 */
export const useNavEntrance = (ref: RefObject<HTMLElement | null>) => {
    useEffect(() => {
        // Starting the lifecycle also releases a page that cannot play the
        // entrance, such as one restored scrolled past the hero.
        startStage();

        const header = ref.current;

        if (!header || !isIntroPending()) {
            return;
        }

        let animations: Animation[] = [];

        const stop = onStage('intro', () => {
            // Released already: the hero was settled early, and the header is
            // on screen in its final state.
            if (!isIntroPending()) {
                return;
            }

            animations = collectItems(header).map((item, index) => tween(
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
        });

        return () => {
            stop();

            for (const animation of animations) {
                animation.cancel();
            }
        };
    }, [ref]);
};

const collectItems = (header: HTMLElement) => {
    const items: HTMLElement[] = [];

    for (const item of header.querySelectorAll('[data-nav-item], [data-nav-tools] > *')) {
        // `offsetParent` is null for the parts the responsive breakpoints
        // hide, which must not be animated back into view.
        if (item instanceof HTMLElement && item.offsetParent !== null) {
            items.push(item);
        }
    }

    return items;
};
