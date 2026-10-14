/**
 * Tests for the stacking progress the sticky case cards are driven by.
 */

import { describe, expect, it } from 'vitest';
import { coverProgress, isObscured, restingScrollY } from './caseStack';

describe('coverProgress', () => {
    const viewport = 900;
    const sticky = 100;

    it('should be zero while the next card is still below the fold', () => {
        // Assert
        expect(coverProgress(viewport, viewport, sticky)).toBe(0);
        expect(coverProgress(viewport, viewport + 400, sticky)).toBe(0);
    });

    it('should be one once the next card has reached its resting position', () => {
        // Assert
        expect(coverProgress(viewport, sticky, sticky)).toBe(1);
        expect(coverProgress(viewport, sticky - 200, sticky)).toBe(1);
    });

    it('should ramp smoothly in between', () => {
        // Act
        const half = coverProgress(viewport, (viewport + sticky) / 2, sticky);

        // Assert
        expect(half).toBeCloseTo(0.5, 5);
        expect(coverProgress(viewport, 700, sticky)).toBeLessThan(half);
        expect(coverProgress(viewport, 300, sticky)).toBeGreaterThan(half);
    });

    it('should stay within bounds for a degenerate viewport', () => {
        // Assert
        expect(coverProgress(0, 0, 0)).toBeGreaterThanOrEqual(0);
        expect(coverProgress(0, 0, 0)).toBeLessThanOrEqual(1);
    });
});

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
});
