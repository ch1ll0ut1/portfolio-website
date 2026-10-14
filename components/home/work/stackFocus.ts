'use client';

import { type RefObject, useEffect } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

/** Room kept between a lifted focus target and the fixed UI below it, for the focus ring. */
const LIFT_MARGIN = 8;

interface Box {
    top: number;
    bottom: number;
}

/**
 * The scroll position at which card `index` has just reached its sticky top:
 * fully shown, with the next card still a gap below its bottom edge.
 *
 * Built from the layout (the stack's document top, the cards' untransformed
 * heights and the gap between them), because a stuck card's own box reports
 * where it is pinned, not where it sits in the flow.
 */
export const restingScrollY = (stackTop: number, heights: readonly number[], gap: number, index: number, stickyTop: number) => {
    let flowTop = stackTop;

    for (let before = 0; before < index; before++) {
        flowTop += (heights[before] ?? 0) + gap;
    }

    return Math.max(0, flowTop - stickyTop);
};

/**
 * Whether a focused box is hidden: partly outside the viewport, under fixed UI
 * along the bottom edge (`bottomInset` tall), or overlapped by a later card in
 * the stack (any card whose top has risen above its bottom).
 */
export const isObscured = (box: Box, laterCardTops: readonly number[], viewportHeight: number, bottomInset = 0) => (
    box.top < 0
    || box.bottom > viewportHeight - bottomInset
    || laterCardTops.some(top => top < box.bottom)
);

/**
 * How far a card resting at its sticky top has to rise for a box inside it to
 * clear fixed UI along the bottom edge. `box` is measured from the card's top.
 *
 * A pinned card cannot be scrolled any higher — scrolling on only slides the
 * next card over it — so a box low in a tall card can sit under the consent
 * banner wherever the page is scrolled. Never lifts the box out of the top of
 * the viewport.
 */
export const liftToClear = (box: Box, stickyTop: number, viewportHeight: number, bottomInset: number) => {
    if (bottomInset <= 0) {
        return 0;
    }

    const needed = stickyTop + box.bottom - (viewportHeight - bottomInset - LIFT_MARGIN);

    return Math.max(0, Math.min(needed, stickyTop + box.top));
};

/**
 * Keeps keyboard focus inside the stack visible (WCAG 2.4.11).
 *
 * While a card is pinned, the cards after it slide over it, so a link the
 * browser considers "in view" can sit entirely under the next card, and
 * tabbing back up can leave it above the viewport. When focus lands in a card
 * and is hidden either way, the page scrolls to where that card has just come
 * to rest: on top of the stack, nothing covering it yet.
 *
 * Fixed UI along the bottom edge, such as the consent banner, counts too. It
 * publishes its height as the root's `scroll-padding-bottom`, which is also
 * what keeps the browser's own focus scrolling clear of it elsewhere on the
 * page. Where the resting card still leaves the target under it, the card is
 * lifted by a transform until focus leaves it.
 *
 * Runs whatever the motion preference, because the cards stick under reduced
 * motion too; only the scroll's smoothness follows it. Below the desktop
 * breakpoint the cards are in normal flow and the browser's own focus
 * scrolling is enough.
 */
export const useStackFocus = (ref: RefObject<HTMLElement | null>) => {
    useEffect(() => {
        const root = ref.current;

        if (!root) {
            return;
        }

        let frame = 0;
        let lifted: HTMLElement | null = null;

        const lift = (card: HTMLElement, by: number) => {
            if (lifted && lifted !== card) {
                lifted.style.transform = '';
            }

            lifted = by > 0 ? card : null;
            card.style.transform = by > 0 ? `translateY(${-by}px)` : '';
        };

        const reveal = (target: Element) => {
            const card = target.closest<HTMLElement>('[data-stack-card]');
            const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-stack-card]'));
            const index = card ? cards.indexOf(card) : -1;

            if (!card || index < 0 || window.getComputedStyle(card).position !== 'sticky') {
                return;
            }

            const stickyTop = Number.parseFloat(window.getComputedStyle(card).top) || 0;
            const inset = bottomInset();
            const cardTop = card.getBoundingClientRect().top;
            const box = target.getBoundingClientRect();
            const inCard = { top: box.top - cardTop, bottom: box.bottom - cardTop };
            // Judged from where the card sits without any lift it still has.
            const flowTop = cardTop - translateY(card);
            const laterTops = cards.slice(index + 1).map(later => later.getBoundingClientRect().top);

            if (!isObscured({ top: flowTop + inCard.top, bottom: flowTop + inCard.bottom }, laterTops, window.innerHeight, inset)) {
                lift(card, 0);

                return;
            }

            const top = restingScrollY(
                root.getBoundingClientRect().top + window.scrollY,
                cards.map(each => each.offsetHeight),
                Number.parseFloat(window.getComputedStyle(root).rowGap) || 0,
                index,
                stickyTop,
            );

            window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
            lift(card, liftToClear(inCard, stickyTop, window.innerHeight, inset));
        };

        // A frame later, so this runs after the browser's own focus scrolling
        // rather than being undone by it.
        const handleFocusIn = (event: FocusEvent) => {
            const target = event.target;

            if (!(target instanceof Element)) {
                return;
            }

            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                reveal(target);
            });
        };

        // The lift is for the focused card only: it settles back as soon as
        // focus or a click lands anywhere else.
        const handleElsewhere = (event: Event) => {
            if (lifted && event.target instanceof Node && !lifted.contains(event.target)) {
                lift(lifted, 0);
            }
        };

        root.addEventListener('focusin', handleFocusIn);
        document.addEventListener('focusin', handleElsewhere);
        document.addEventListener('pointerdown', handleElsewhere);

        return () => {
            cancelAnimationFrame(frame);
            root.removeEventListener('focusin', handleFocusIn);
            document.removeEventListener('focusin', handleElsewhere);
            document.removeEventListener('pointerdown', handleElsewhere);

            if (lifted) {
                lifted.style.transform = '';
            }
        };
    }, [ref]);
};

/** Fixed UI along the bottom edge, as published on the root's scroll padding. */
const bottomInset = () => Number.parseFloat(window.getComputedStyle(document.documentElement).scrollPaddingBottom) || 0;

/** How far a card is currently shifted by its lift, mid-transition included. */
const translateY = (card: HTMLElement) => {
    const transform = window.getComputedStyle(card).transform;

    return transform && transform !== 'none' ? new DOMMatrixReadOnly(transform).m42 : 0;
};
