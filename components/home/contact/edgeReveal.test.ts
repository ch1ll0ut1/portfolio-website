/**
 * Tests for the closing band's edge geometry.
 */

import { describe, expect, it } from 'vitest';
import { edgeGeometry } from './edgeReveal';

const VW = 1200;
const VH = 800;

describe('edgeGeometry', () => {
    it('should return nothing while the section is far below the viewport', () => {
        // Act
        const geometry = edgeGeometry(VH * 1.5, VW, VH);

        // Assert
        expect(geometry).toBeNull();
    });

    it('should return nothing once the section has scrolled well past the top', () => {
        // Act
        const geometry = edgeGeometry(-VH * 1.5, VW, VH);

        // Assert
        expect(geometry).toBeNull();
    });

    it('should be fully inset and rounded when the section top sits at the viewport bottom', () => {
        // Act
        const geometry = edgeGeometry(VH, VW, VH);

        // Assert
        expect(geometry?.inset).toBeCloseTo(VW * 0.035);
        expect(geometry?.radius).toBeCloseTo(56);
    });

    it('should be fully open once the top has travelled the whole reveal distance', () => {
        // Act
        const geometry = edgeGeometry(VH * 0.25, VW, VH);

        // Assert
        expect(geometry?.inset).toBeCloseTo(0);
        expect(geometry?.radius).toBeCloseTo(0);
    });

    it('should open monotonically as the section travels up', () => {
        // Act
        const tops = [VH, VH * 0.8, VH * 0.6, VH * 0.4];
        const insets = tops.map(top => edgeGeometry(top, VW, VH)?.inset ?? 0);

        // Assert
        expect(insets).toEqual([...insets].sort((a, b) => b - a));
        expect(new Set(insets).size).toBe(insets.length);
    });

    it('should cap the inset and radius on very wide viewports', () => {
        // Act
        const geometry = edgeGeometry(VH, 4000, VH);

        // Assert
        expect(geometry?.inset).toBeCloseTo(48);
        expect(geometry?.radius).toBeCloseTo(56);
    });
});
