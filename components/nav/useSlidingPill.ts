'use client';

import { type RefObject, useCallback, useEffect } from 'react';
import { useEventCallback, useStageEvent } from '@/lib/motion';

/** Links are found by data attribute so the hashed CSS Module names stay in the component. */
const LINK_SELECTOR = '[data-nav-id]';

/**
 * Moves the link row's background pill to the hovered or focused link, and back
 * to the active section's link when the pointer leaves.
 *
 * The pill is positioned from `offsetLeft`/`offsetWidth` rather than React
 * state: it has to follow the pointer at input speed, and the browser already
 * animates the transition. Measurements are refreshed on the `layout` signal,
 * so a font swap or a resize cannot leave the pill misaligned.
 */
export const useSlidingPill = (
    listRef: RefObject<HTMLElement | null>,
    pillRef: RefObject<HTMLElement | null>,
    activeId: string | null,
) => {
    const readActiveId = useEventCallback(() => activeId);

    const moveTo = useCallback((link: HTMLElement | null) => {
        const pill = pillRef.current;

        if (!pill) {
            return;
        }

        if (!link) {
            pill.style.opacity = '0';

            return;
        }

        pill.style.opacity = '1';
        pill.style.width = `${link.offsetWidth}px`;
        pill.style.transform = `translateX(${link.offsetLeft}px)`;
    }, [pillRef]);

    const moveToActive = useCallback(() => {
        const list = listRef.current;
        const id = readActiveId();
        const link = list && id ? list.querySelector(`[data-nav-id="${id}"]`) : null;

        moveTo(link instanceof HTMLElement ? link : null);
    }, [listRef, moveTo, readActiveId]);

    useEffect(() => {
        const list = listRef.current;

        if (!list) {
            return;
        }

        const handlePoint = (event: Event) => {
            const target = event.target;
            const link = target instanceof Element ? target.closest(LINK_SELECTOR) : null;

            if (link instanceof HTMLElement) {
                moveTo(link);
            }
        };

        // Delegated: `pointerover` and `focusin` bubble, so one pair of
        // listeners covers every link and survives the list re-rendering.
        list.addEventListener('pointerover', handlePoint);
        list.addEventListener('focusin', handlePoint);
        list.addEventListener('pointerleave', moveToActive);

        return () => {
            list.removeEventListener('pointerover', handlePoint);
            list.removeEventListener('focusin', handlePoint);
            list.removeEventListener('pointerleave', moveToActive);
        };
    }, [listRef, moveTo, moveToActive]);

    useEffect(() => {
        moveToActive();
    }, [activeId, moveToActive]);

    useStageEvent('layout', moveToActive);
};
