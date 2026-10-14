'use client';

import { type RefObject, useEffect, useRef } from 'react';
import { clamp, onStage, smoothstep, prefersReducedMotion, subscribeScrollWhileNear } from '@/lib/motion';

/** Cards only stack where there is room for two of them side by side. */
export const DESKTOP_QUERY = '(min-width: 901px)';
/** How far the covered card settles back. */
const SCALE_DEPTH = 0.06;
/** How dark the overlay on the covered card gets. */
const DIM_DEPTH = 0.62;
/** Past this the card is hidden enough that its illustration can pause. */
const COVERED_AT = 0.9;
/** Below this a progress change is not worth a style write. */
const EPSILON = 0.001;

/**
 * How far the next card has slid over this one, 0..1.
 *
 * 0 while the next card is still below the fold, 1 once it has reached its own
 * sticky resting position and fully covers this one.
 */
export const coverProgress = (viewportHeight: number, nextTop: number, nextSticky: number) => {
    const travel = Math.max(1, viewportHeight - nextSticky);

    return smoothstep(clamp((viewportHeight - nextTop) / travel, 0, 1));
};

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
 * Whether a focused box is hidden: partly outside the viewport, or overlapped
 * by a later card in the stack (any card whose top has risen above its bottom).
 */
export const isObscured = (box: { top: number; bottom: number }, laterCardTops: readonly number[], viewportHeight: number) => (
    box.top < 0
    || box.bottom > viewportHeight
    || laterCardTops.some(top => top < box.bottom)
);

/**
 * Keeps keyboard focus inside the stack visible (WCAG 2.4.11).
 *
 * While a card is pinned, the cards after it slide over it, so a link the
 * browser considers "in view" can sit entirely under the next card, and
 * tabbing back up can leave it above the viewport. When focus lands in a card
 * and is hidden either way, the page scrolls to where that card has just come
 * to rest: on top of the stack, nothing covering it yet.
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

        const reveal = (target: Element) => {
            const card = target.closest<HTMLElement>('[data-stack-card]');
            const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-stack-card]'));
            const index = card ? cards.indexOf(card) : -1;

            if (!card || index < 0 || window.getComputedStyle(card).position !== 'sticky') {
                return;
            }

            const box = target.getBoundingClientRect();
            const laterTops = cards.slice(index + 1).map(later => later.getBoundingClientRect().top);

            if (!isObscured(box, laterTops, window.innerHeight)) {
                return;
            }

            const top = restingScrollY(
                root.getBoundingClientRect().top + window.scrollY,
                cards.map(each => each.offsetHeight),
                Number.parseFloat(window.getComputedStyle(root).rowGap) || 0,
                index,
                Number.parseFloat(window.getComputedStyle(card).top) || 0,
            );

            window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
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

        root.addEventListener('focusin', handleFocusIn);

        return () => {
            cancelAnimationFrame(frame);
            root.removeEventListener('focusin', handleFocusIn);
        };
    }, [ref]);
};

export type CoveredHandler = (index: number, covered: boolean) => void;

/**
 * The sticky stacking effect: each card settles back and dims as the next one
 * slides over it.
 *
 * Desktop only, and skipped entirely under reduced motion — below 900px the
 * cards are in normal flow, so there is nothing to stack.
 */
export const useCaseStack = (ref: RefObject<HTMLElement | null>, onCovered: CoveredHandler) => {
    const latest = useRef(onCovered);

    useEffect(() => {
        latest.current = onCovered;
    });

    useEffect(() => {
        const root = ref.current;

        if (!root || prefersReducedMotion()) {
            return;
        }

        const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-stack-card]'));
        const inners = cards.map(card => card.querySelector<HTMLElement>('[data-stack-inner]'));
        const previous = cards.map(() => -1);
        const desktop = window.matchMedia(DESKTOP_QUERY);

        let stickyTops: number[] = [];

        /** The sticky `top` each card rests at, read from the stylesheet. */
        const measure = () => {
            stickyTops = cards.map((card) => {
                const top = Number.parseFloat(window.getComputedStyle(card).top);

                return Number.isFinite(top) ? top : 0;
            });
        };

        let viewportHeight = 0;
        let on = false;
        let nextTops: (number | undefined)[] = [];

        /** Read phase: where every next card currently sits. */
        const read = () => {
            viewportHeight = window.innerHeight;
            on = desktop.matches;
            nextTops = on
                ? cards.map((_, index) => cards[index + 1]?.getBoundingClientRect().top)
                : [];
        };

        /** Write phase: style each card from what `read` saw. Never measures. */
        const write = () => {
            for (let index = 0; index < cards.length; index++) {
                const nextTop = nextTops[index];
                const progress = on && nextTop !== undefined
                    ? coverProgress(viewportHeight, nextTop, stickyTops[index + 1] ?? 0)
                    : 0;

                if (Math.abs(progress - (previous[index] ?? -1)) < EPSILON) {
                    continue;
                }

                previous[index] = progress;

                const inner = inners[index];

                if (inner) {
                    inner.style.transform = progress > 0 ? `scale(${(1 - SCALE_DEPTH * progress).toFixed(4)})` : '';
                    inner.style.setProperty('--dim', (DIM_DEPTH * progress).toFixed(3));
                }

                latest.current(index, progress > COVERED_AT);
            }
        };

        const stack = () => {
            read();
            write();
        };

        const relayout = () => {
            measure();
            stack();
        };

        measure();

        const stopScroll = subscribeScrollWhileNear(root, { read, write });
        const stopLayout = onStage('layout', relayout);
        const frame = requestAnimationFrame(stack);

        return () => {
            cancelAnimationFrame(frame);
            stopScroll();
            stopLayout();
            inners.forEach((inner) => {
                if (inner) {
                    inner.style.transform = '';
                    inner.style.removeProperty('--dim');
                }
            });
        };
    }, [ref]);
};
