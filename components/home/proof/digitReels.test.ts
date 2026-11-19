/**
 * Tests for the odometer reel geometry.
 */

import { describe, it, expect } from 'vitest';
import { itemAt } from '@/test/itemAt';
import { buildReels } from './digitReels';

describe('buildReels', () => {
    it('should build one reel per digit of the value', () => {
        // Act
        const reels = buildReels('2008', '1990');

        // Assert
        expect(reels).toHaveLength(4);
    });

    it('should start every reel on its digit from the starting value', () => {
        // Act
        const reels = buildReels('2008', '1990');

        // Assert
        expect(reels.map(reel => reel.digits[0])).toEqual([1, 9, 9, 0]);
    });

    it('should end every reel on its digit from the final value', () => {
        // Act
        const reels = buildReels('2008', '1990');

        // Assert
        expect(reels.map(reel => reel.digits[reel.digits.length - 1])).toEqual([2, 0, 0, 8]);
    });

    it('should wrap a reel through zero rather than counting backwards', () => {
        // Act
        const tens = itemAt(buildReels('2008', '1990'), 1);

        // Assert
        expect(tens.digits).toEqual([9, 0]);
    });

    it('should spin the last column a full extra turn', () => {
        // Act
        const reels = buildReels('2008', '1990');
        const units = itemAt(reels, reels.length - 1);

        // Assert
        expect(units.offset).toBe(18);
        expect(units.digits).toHaveLength(19);
    });

    it('should give a single digit value one reel that takes an extra turn', () => {
        // Act
        const reels = buildReels('4', '0');

        // Assert
        expect(reels).toHaveLength(1);
        expect(itemAt(reels, 0).offset).toBe(14);
        expect(itemAt(reels, 0).digits[0]).toBe(0);
        expect(itemAt(reels, 0).digits[14]).toBe(4);
    });

    it('should weight columns from right to left so the left lands first', () => {
        // Act
        const reels = buildReels('2008', '1990');

        // Assert
        expect(reels.map(reel => reel.weight)).toEqual([3, 2, 1, 0]);
    });

    it('should align a starting value of a different length', () => {
        // Act
        const reels = buildReels('2008', '0');

        // Assert
        expect(reels).toHaveLength(4);
        expect(reels.map(reel => reel.digits[0])).toEqual([0, 0, 0, 0]);
    });
});
