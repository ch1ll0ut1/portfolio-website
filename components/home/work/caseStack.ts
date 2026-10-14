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
