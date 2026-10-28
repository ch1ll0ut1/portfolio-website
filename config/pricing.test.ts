/**
 * Tests for the price formatting and the figures it formats.
 */

import { describe, expect, it } from 'vitest';
import {
    FIRST_STEP_PRICE_EUR,
    FIRST_STEP_PRICE_USD,
    FIRST_VERSION_RANGE_EUR,
    FIRST_VERSION_RANGE_USD,
    RESCUE_RANGE_EUR,
    RESCUE_RANGE_USD,
    TECH_LEAD_MIN_HOURS_PER_MONTH,
    TECH_LEAD_MONTHLY_MIN_EUR,
    TECH_LEAD_MONTHLY_MIN_USD,
    eurAmountDe,
    eurRangeDe,
    usdAmountEn,
    usdRangeEn,
    usdThousandsEn,
} from './pricing';

describe('pricing', () => {
    describe('formatting', () => {
        it('should write a range in thousands of dollars for English copy', () => {
            expect(usdRangeEn({ min: 4_000, max: 15_000 })).toBe('$4–15K');
        });

        it('should write a rough figure in thousands of dollars, keeping one decimal', () => {
            expect(usdThousandsEn(1_500)).toBe('$1.5K');
            expect(usdThousandsEn(2_000)).toBe('$2K');
        });

        it('should write a single dollar figure in full with a thousands comma', () => {
            expect(usdAmountEn(1_800)).toBe('$1,800');
        });

        it('should write a range in euros with German thousands separators for German copy', () => {
            expect(eurRangeDe({ min: 15_000, max: 40_000 })).toBe('15.000–40.000 €');
        });

        it('should write a single euro figure in German format with a no-break space', () => {
            expect(eurAmountDe(2_200)).toBe('2.200 €');
        });
    });

    describe('figures', () => {
        it('should quote the confirmed English figures', () => {
            expect(usdRangeEn(RESCUE_RANGE_USD)).toBe('$4–15K');
            expect(usdRangeEn(FIRST_VERSION_RANGE_USD)).toBe('$10–30K');
            expect(usdAmountEn(TECH_LEAD_MONTHLY_MIN_USD)).toBe('$1,800');
            expect(usdThousandsEn(FIRST_STEP_PRICE_USD)).toBe('$1.5K');
        });

        it('should quote the confirmed German figures', () => {
            expect(eurRangeDe(RESCUE_RANGE_EUR)).toBe('5.000–22.000 €');
            expect(eurRangeDe(FIRST_VERSION_RANGE_EUR)).toBe('15.000–40.000 €');
            expect(eurAmountDe(TECH_LEAD_MONTHLY_MIN_EUR)).toBe('2.000 €');
            expect(eurAmountDe(FIRST_STEP_PRICE_EUR)).toBe('2.200 €');
        });

        it('should ask at least 20 hours a month of the tech lead', () => {
            expect(TECH_LEAD_MIN_HOURS_PER_MONTH).toBe(20);
        });

        it('should keep every range ascending', () => {
            [RESCUE_RANGE_USD, FIRST_VERSION_RANGE_USD, RESCUE_RANGE_EUR, FIRST_VERSION_RANGE_EUR].forEach((range) => {
                expect(range.min).toBeGreaterThan(0);
                expect(range.max).toBeGreaterThan(range.min);
            });
        });
    });
});
