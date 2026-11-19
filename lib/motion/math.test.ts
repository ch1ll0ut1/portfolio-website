/**
 * Tests for the motion math helpers. Pure functions, so boundaries are the
 * interesting part.
 */

import { describe, expect, it } from 'vitest';
import { clamp, lerp, mapRange, smoothstep } from './math';

describe('motion math', () => {
    describe('clamp', () => {
        it('should return the value when inside the range', () => {
            expect(clamp(5, 0, 10)).toBe(5);
        });

        it('should clamp to the bounds when outside the range', () => {
            expect(clamp(-3, 0, 10)).toBe(0);
            expect(clamp(42, 0, 10)).toBe(10);
        });
    });

    describe('lerp', () => {
        it('should return the endpoints at 0 and 1', () => {
            expect(lerp(10, 20, 0)).toBe(10);
            expect(lerp(10, 20, 1)).toBe(20);
        });

        it('should interpolate between the endpoints', () => {
            expect(lerp(0, 100, 0.25)).toBe(25);
        });
    });

    describe('mapRange', () => {
        it('should remap a value from one range to another', () => {
            expect(mapRange(0.5, 0, 1, 0, 200)).toBe(100);
        });

        it('should extrapolate beyond the input range', () => {
            expect(mapRange(2, 0, 1, 0, 10)).toBe(20);
        });
    });

    describe('smoothstep', () => {
        it('should pin the endpoints', () => {
            expect(smoothstep(0)).toBe(0);
            expect(smoothstep(1)).toBe(1);
        });

        it('should pass through the midpoint', () => {
            expect(smoothstep(0.5)).toBeCloseTo(0.5);
        });

        it('should clamp out-of-range input', () => {
            expect(smoothstep(-1)).toBe(0);
            expect(smoothstep(5)).toBe(1);
        });

        it('should ease in rather than stay linear', () => {
            expect(smoothstep(0.25)).toBeLessThan(0.25);
            expect(smoothstep(0.75)).toBeGreaterThan(0.75);
        });
    });
});
