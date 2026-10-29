/**
 * Tests for the geometry that keeps focus inside the case stack in view.
 */

import { describe, expect, it } from 'vitest';
import { isObscured, liftToClear, restingScrollY } from './stackFocus';

describe('restingScrollY', () => {
    it('should put the first card at its sticky top', () => {
        expect(restingScrollY(2000, [700, 720, 680], 32, 0, 88)).toBe(1912);
    });

    it('should add the cards and gaps above a later card', () => {
        // 2000 + 700 + 32 + 720 + 32, less a sticky top of 124.
        expect(restingScrollY(2000, [700, 720, 680], 32, 2, 124)).toBe(3360);
    });

    it('should never ask for a negative scroll', () => {
        expect(restingScrollY(20, [700], 32, 0, 88)).toBe(0);
    });
});

describe('isObscured', () => {
    const viewport = 900;

    it('should be false for a box in view with every later card below it', () => {
        expect(isObscured({ top: 694, bottom: 722 }, [810, 1600], viewport)).toBe(false);
    });

    it('should be true when a later card has slid over the box', () => {
        expect(isObscured({ top: 694, bottom: 722 }, [106, 900], viewport)).toBe(true);
    });

    it('should be true when the box is above or below the viewport', () => {
        expect(isObscured({ top: -363, bottom: -336 }, [], viewport)).toBe(true);
        expect(isObscured({ top: 890, bottom: 918 }, [], viewport)).toBe(true);
    });

    it('should be true when fixed UI along the bottom edge covers the box', () => {
        // The consent banner at 1440 × 900 starts 183px above the bottom edge.
        expect(isObscured({ top: 709, bottom: 738 }, [], viewport, 183)).toBe(true);
        expect(isObscured({ top: 509, bottom: 538 }, [], viewport, 183)).toBe(false);
    });
});

describe('liftToClear', () => {
    // The Edithing source link: 621px into a card resting 88px from the top.
    const link = { top: 621, bottom: 650 };

    it('should not lift without fixed UI along the bottom edge', () => {
        expect(liftToClear(link, 88, 768, 0)).toBe(0);
    });

    it('should not lift a box that already clears it', () => {
        expect(liftToClear(link, 88, 900, 100)).toBe(0);
    });

    it('should lift the card just far enough to clear it, with room for the focus ring', () => {
        // 88 + 650 = 738 must end 8px above 768 - 183 = 585.
        expect(liftToClear(link, 88, 768, 183)).toBe(161);
    });

    it('should never lift the box out of the top of the viewport', () => {
        expect(liftToClear(link, 88, 300, 290)).toBe(88 + 621);
    });
});
