/**
 * Tests for the project range formatting.
 */

import { describe, expect, it } from 'vitest';
import { FIRST_VERSION_RANGE_USD, RESCUE_RANGE_USD, usdRangeDe, usdRangeEn } from './pricing';

describe('pricing', () => {
    it('should write a range in thousands of dollars for English copy', () => {
        expect(usdRangeEn({ min: 5_000, max: 20_000 })).toBe('$5–20K');
    });

    it('should write a range with German thousands separators for German copy', () => {
        expect(usdRangeDe({ min: 12_000, max: 30_000 })).toBe('12.000–30.000 USD');
    });

    it('should keep every range ascending', () => {
        [RESCUE_RANGE_USD, FIRST_VERSION_RANGE_USD].forEach((range) => {
            expect(range.min).toBeGreaterThan(0);
            expect(range.max).toBeGreaterThan(range.min);
        });
    });
});
