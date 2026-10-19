/**
 * Tests for the project range formatting.
 */

import { describe, expect, it } from 'vitest';
import {
    FIRST_VERSION_RANGE_EUR,
    FIRST_VERSION_RANGE_USD,
    RESCUE_RANGE_EUR,
    RESCUE_RANGE_USD,
    eurRangeDe,
    usdRangeEn,
} from './pricing';

describe('pricing', () => {
    it('should write a range in thousands of dollars for English copy', () => {
        expect(usdRangeEn({ min: 5_000, max: 20_000 })).toBe('$5–20K');
    });

    it('should write a range in euros with German thousands separators for German copy', () => {
        expect(eurRangeDe({ min: 12_000, max: 30_000 })).toBe('12.000–30.000\u00a0€');
    });

    it('should keep every range ascending', () => {
        [RESCUE_RANGE_USD, FIRST_VERSION_RANGE_USD, RESCUE_RANGE_EUR, FIRST_VERSION_RANGE_EUR].forEach((range) => {
            expect(range.min).toBeGreaterThan(0);
            expect(range.max).toBeGreaterThan(range.min);
        });
    });
});
