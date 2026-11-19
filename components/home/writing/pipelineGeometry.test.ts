/**
 * Tests for the pipeline's edge geometry.
 * Covers which side of a box an edge leaves from, not how it animates.
 */

import { describe, it, expect } from 'vitest';
import { anchorOn, edgePath } from './pipelineGeometry';

const box = { x: 0, y: 0, w: 100, h: 40 };

describe('anchorOn', () => {
    it('should leave the right side when the target is mostly to the right', () => {
        // Act
        const anchor = anchorOn(box, 200, 10);

        // Assert
        expect(anchor).toEqual({ x: 100, y: 20, horizontal: true });
    });

    it('should leave the left side when the target is mostly to the left', () => {
        // Act
        const anchor = anchorOn(box, -200, 10);

        // Assert
        expect(anchor).toEqual({ x: 0, y: 20, horizontal: true });
    });

    it('should leave the bottom when the target is mostly below', () => {
        // Act
        const anchor = anchorOn(box, 10, 200);

        // Assert
        expect(anchor).toEqual({ x: 50, y: 40, horizontal: false });
    });

    it('should leave the top when the target is mostly above', () => {
        // Act
        const anchor = anchorOn(box, 10, -200);

        // Assert
        expect(anchor).toEqual({ x: 50, y: 0, horizontal: false });
    });
});

describe('edgePath', () => {
    it('should draw a cubic curve between the facing sides of two boxes', () => {
        // Act
        const path = edgePath(box, { x: 300, y: 0, w: 100, h: 40 });

        // Assert
        expect(path).toMatch(/^M 100 20 C .+, .+, 300 20$/);
    });

    it('should connect vertically stacked boxes bottom to top', () => {
        // Act
        const path = edgePath(box, { x: 0, y: 200, w: 100, h: 40 });

        // Assert
        expect(path).toMatch(/^M 50 40 C .+, .+, 50 200$/);
    });
});
