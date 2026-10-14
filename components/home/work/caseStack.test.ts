/**
 * Tests for the stacking progress the sticky case cards are driven by.
 */

import { describe, expect, it } from 'vitest';
import { coverProgress } from './caseStack';

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
