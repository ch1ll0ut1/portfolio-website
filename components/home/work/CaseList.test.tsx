/**
 * Tests for CaseList's focus handling: a focused link inside a stacked card
 * must never stay hidden under the card stacked on top of it.
 *
 * jsdom has no layout, so the geometry of a pinned stack is stubbed: the first
 * card stuck at its sticky top, and whichever top the second card is given.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { REDUCED_MOTION_QUERY } from '@/lib/motion';
import { itemAt } from '@/test/itemAt';
import { installAnimationFrames } from '../../../test/animationFrames';
import { installMatchMedia } from '../../../test/motionEnv';
import { CaseList } from './CaseList';

const STACK_TOP = 2000;
const SCROLL_Y = 500;
const STICKY_TOP = 88;
const GAP = 32;
const CARD_HEIGHT = 700;

const rect = (top: number, height: number) => ({
    top, bottom: top + height, left: 0, right: 600, x: 0, y: top, width: 600, height, toJSON: () => ({}),
});

const stubBox = (element: Element, top: number, height: number) => {
    Object.defineProperty(element, 'getBoundingClientRect', { value: () => rect(top, height), configurable: true });
};

/** Lays the stack out with the second card's top at `nextTop`, and a sticky or static position. */
const layOut = (nextTop: number, position: 'sticky' | 'relative' = 'sticky') => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-stack-card]'));
    const root = itemAt(cards, 0).parentElement;

    if (!root) {
        throw new Error('expected the cards to share a container');
    }

    stubBox(root, STACK_TOP - SCROLL_Y, 4 * CARD_HEIGHT);
    cards.forEach((card, index) => {
        Object.defineProperty(card, 'offsetHeight', { value: CARD_HEIGHT, configurable: true });
        stubBox(card, index === 0 ? STICKY_TOP : nextTop + (index - 1) * 18, CARD_HEIGHT);
    });

    const original = window.getComputedStyle.bind(window);

    // Only the properties the focus handling reads.
    vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
        if (element === root) {
            return { rowGap: `${GAP}px` } as CSSStyleDeclaration;
        }

        if (element instanceof HTMLElement && element.dataset.stackCard !== undefined) {
            return { position, top: `${STICKY_TOP}px` } as CSSStyleDeclaration;
        }

        return original(element);
    });
};

describe('<CaseList> focus inside the stack', () => {
    let restoreMedia: () => void;
    let frames: ReturnType<typeof installAnimationFrames>;
    let scrollTo: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        // Reduced motion keeps the stacking effect and the illustrations out of
        // it; the cards still stick, so focus handling must still run.
        restoreMedia = installMatchMedia([REDUCED_MOTION_QUERY]);
        frames = installAnimationFrames();
        scrollTo = vi.fn();
        vi.stubGlobal('scrollTo', scrollTo);
        Object.defineProperty(window, 'scrollY', { value: SCROLL_Y, configurable: true, writable: true });
        Object.defineProperty(window, 'innerHeight', { value: 900, configurable: true, writable: true });
    });

    afterEach(() => {
        frames.restore();
        restoreMedia();
        vi.restoreAllMocks();
    });

    const focusSourceLink = () => {
        const link = screen.getByRole('link', { name: /read the source/i });

        stubBox(link, 694, 28);
        link.focus();
        frames.step();
    };

    it('scrolls a covered card back to rest when focus lands in it', () => {
        render(<CaseList />);
        layOut(106);

        focusSourceLink();

        expect(scrollTo).toHaveBeenCalledWith({ top: STACK_TOP - STICKY_TOP, behavior: 'auto' });
    });

    it('leaves the scroll alone when nothing covers the focused link', () => {
        render(<CaseList />);
        layOut(STICKY_TOP + CARD_HEIGHT + GAP);

        focusSourceLink();

        expect(scrollTo).not.toHaveBeenCalled();
    });

    it('leaves the scroll to the browser when the cards are not stacked', () => {
        render(<CaseList />);
        layOut(106, 'relative');

        focusSourceLink();

        expect(scrollTo).not.toHaveBeenCalled();
    });
});
