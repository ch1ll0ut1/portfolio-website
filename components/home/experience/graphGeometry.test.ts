/**
 * Tests for the career graph geometry.
 * Covers fork detection, both branch paths and the y → x lookup.
 */

import { describe, it, expect } from 'vitest';
import {
    type RowMeasurement,
    buildGeometry,
    findForkIndex,
    findTipIndex,
    laneCenters,
    xAt,
} from './graphGeometry';

const rows: RowMeasurement[] = [
    { branch: 'indie', center: 20 },
    { branch: 'indie', center: 60 },
    { branch: 'indie', center: 100 },
    { branch: 'main', center: 140 },
    { branch: 'main', center: 180 },
];

const options = { lane: 26, width: 70, height: 200 };
const lanes = laneCenters(options.lane);

describe('graphGeometry', () => {
    describe('findForkIndex', () => {
        it('should find the last indie commit before the main branch', () => {
            // Assert
            expect(findForkIndex(rows)).toBe(2);
        });

        it('should return -1 when the log never forks', () => {
            // Arrange
            const single: RowMeasurement[] = [
                { branch: 'main', center: 10 },
                { branch: 'main', center: 30 },
            ];

            // Assert
            expect(findForkIndex(single)).toBe(-1);
        });
    });

    describe('findTipIndex', () => {
        it('should find the newest commit on main', () => {
            // Assert
            expect(findTipIndex(rows)).toBe(3);
        });
    });

    describe('buildGeometry', () => {
        it('should return null without rows', () => {
            // Assert
            expect(buildGeometry([], options)).toBeNull();
        });

        it('should place each node in its own branch lane', () => {
            // Act
            const geometry = buildGeometry(rows, options);

            // Assert
            expect(geometry?.nodes).toEqual([
                { x: lanes.indie, y: 20, branch: 'indie' },
                { x: lanes.indie, y: 60, branch: 'indie' },
                { x: lanes.indie, y: 100, branch: 'indie' },
                { x: lanes.main, y: 140, branch: 'main' },
                { x: lanes.main, y: 180, branch: 'main' },
            ]);
        });

        it('should run the indie branch down its lane and curve it into main', () => {
            // Act
            const geometry = buildGeometry(rows, options);

            // Assert
            expect(geometry?.indiePath).toBe(
                `M ${lanes.indie} 20 V 100 C ${lanes.indie} 124.8, ${lanes.main} 115.2, ${lanes.main} 140`,
            );
        });

        it('should run the main branch straight from its tip to the root', () => {
            // Act
            const geometry = buildGeometry(rows, options);

            // Assert
            expect(geometry?.mainPath).toBe(`M ${lanes.main} 140 V 180`);
        });

        it('should report the fork and tip indices', () => {
            // Act
            const geometry = buildGeometry(rows, options);

            // Assert
            expect(geometry?.forkIndex).toBe(2);
            expect(geometry?.tipIndex).toBe(3);
        });

        it('should fall back to the measured lane width when the graph is unmeasured', () => {
            // Act
            const geometry = buildGeometry(rows, { ...options, width: 0 });

            // Assert
            expect(geometry?.width).toBeGreaterThan(lanes.indie);
        });

        it('should draw a single lane when the log never forks', () => {
            // Arrange
            const single: RowMeasurement[] = [
                { branch: 'main', center: 10 },
                { branch: 'main', center: 30 },
            ];

            // Act
            const geometry = buildGeometry(single, options);

            // Assert
            expect(geometry?.mainPath).toBe(`M ${lanes.main} 10 V 30`);
            expect(geometry?.indiePath).toBe('');
        });
    });

    describe('xAt', () => {
        it('should sit in the indie lane above the fork', () => {
            // Arrange
            const geometry = buildGeometry(rows, options);
            const lookup = geometry?.lookup ?? [];

            // Assert
            expect(xAt(lookup, 20)).toBeCloseTo(lanes.indie);
            expect(xAt(lookup, 60)).toBeCloseTo(lanes.indie);
            expect(xAt(lookup, 100)).toBeCloseTo(lanes.indie);
        });

        it('should sit in the main lane at the branch tip and below', () => {
            // Arrange
            const geometry = buildGeometry(rows, options);
            const lookup = geometry?.lookup ?? [];

            // Assert
            expect(xAt(lookup, 140)).toBeCloseTo(lanes.main);
            expect(xAt(lookup, 180)).toBeCloseTo(lanes.main);
        });

        it('should cross between the lanes midway through the curve', () => {
            // Arrange
            const geometry = buildGeometry(rows, options);
            const lookup = geometry?.lookup ?? [];

            // Act
            const middle = xAt(lookup, 120);

            // Assert
            expect(middle).toBeLessThan(lanes.indie);
            expect(middle).toBeGreaterThan(lanes.main);
            expect(middle).toBeCloseTo((lanes.indie + lanes.main) / 2, 0);
        });

        it('should clamp outside the sampled range', () => {
            // Arrange
            const geometry = buildGeometry(rows, options);
            const lookup = geometry?.lookup ?? [];

            // Assert
            expect(xAt(lookup, -500)).toBeCloseTo(lanes.indie);
            expect(xAt(lookup, 5000)).toBeCloseTo(lanes.main);
        });

        it('should return 0 for an empty lookup', () => {
            // Assert
            expect(xAt([], 10)).toBe(0);
        });
    });
});
