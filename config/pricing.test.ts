/**
 * Tests for the price formatting and the figures it formats.
 */

import { describe, expect, it } from 'vitest';
import {
    ADVISOR_HOURS_PER_MONTH,
    ADVISOR_MONTHLY_MIN_EUR,
    ADVISOR_MONTHLY_MIN_USD,
    EMBEDDED_MONTHLY_RANGE_EUR,
    EMBEDDED_MONTHLY_RANGE_USD,
    FEE_CREDIT_DAYS,
    FIRST_VERSION_RANGE_EUR,
    FIRST_VERSION_RANGE_USD,
    HEALTH_CHECK_PRICE_EUR,
    HEALTH_CHECK_PRICE_USD,
    HEALTH_CHECK_WITH_SECURITY_EUR,
    HEALTH_CHECK_WITH_SECURITY_USD,
    RESCUE_RANGE_EUR,
    RESCUE_RANGE_USD,
    eurAmountDe,
    eurRangeDe,
    usdAmountEn,
    usdRangeEn,
} from './pricing';

describe('pricing', () => {
    describe('formatting', () => {
        it('should write a range in thousands of dollars for English copy', () => {
            expect(usdRangeEn({ min: 12_000, max: 40_000 })).toBe('$12–40K');
            expect(usdRangeEn({ min: 1_500, max: 2_000 })).toBe('$1.5–2K');
        });

        it('should write a single dollar figure in full with a thousands comma', () => {
            expect(usdAmountEn(3_500)).toBe('$3,500');
        });

        it('should write a range in euros with German thousands separators and a no-break space', () => {
            expect(eurRangeDe({ min: 25_000, max: 55_000 })).toBe('25.000–55.000 €');
        });

        it('should write a single euro figure in German format with a no-break space', () => {
            expect(eurAmountDe(3_500)).toBe('3.500 €');
        });
    });

    describe('figures', () => {
        it('should quote the confirmed English figures', () => {
            expect(usdAmountEn(HEALTH_CHECK_PRICE_USD)).toBe('$3,500');
            expect(usdAmountEn(HEALTH_CHECK_WITH_SECURITY_USD)).toBe('$4,500');
            expect(usdRangeEn(RESCUE_RANGE_USD)).toBe('$12–40K');
            expect(usdRangeEn(FIRST_VERSION_RANGE_USD)).toBe('$25–60K');
            expect(usdAmountEn(ADVISOR_MONTHLY_MIN_USD)).toBe('$3,500');
            expect(usdRangeEn(EMBEDDED_MONTHLY_RANGE_USD)).toBe('$8–12K');
        });

        it('should quote the confirmed German figures', () => {
            expect(eurAmountDe(HEALTH_CHECK_PRICE_EUR)).toBe('3.500 €');
            expect(eurAmountDe(HEALTH_CHECK_WITH_SECURITY_EUR)).toBe('4.500 €');
            expect(eurRangeDe(RESCUE_RANGE_EUR)).toBe('12.000–35.000 €');
            expect(eurRangeDe(FIRST_VERSION_RANGE_EUR)).toBe('25.000–55.000 €');
            expect(eurAmountDe(ADVISOR_MONTHLY_MIN_EUR)).toBe('3.000 €');
            expect(eurRangeDe(EMBEDDED_MONTHLY_RANGE_EUR)).toBe('7.000–10.000 €');
        });

        it('should credit the first step for 30 days and give the Advisor 8 to 10 hours a month', () => {
            expect(FEE_CREDIT_DAYS).toBe(30);
            expect(ADVISOR_HOURS_PER_MONTH).toEqual({ min: 8, max: 10 });
        });

        it('should keep every range ascending', () => {
            [
                RESCUE_RANGE_USD,
                FIRST_VERSION_RANGE_USD,
                EMBEDDED_MONTHLY_RANGE_USD,
                RESCUE_RANGE_EUR,
                FIRST_VERSION_RANGE_EUR,
                EMBEDDED_MONTHLY_RANGE_EUR,
                ADVISOR_HOURS_PER_MONTH,
            ].forEach((range) => {
                expect(range.min).toBeGreaterThan(0);
                expect(range.max).toBeGreaterThan(range.min);
            });
        });

        it('should price the security review above the plain check, and the Embedded level above the Advisor', () => {
            expect(HEALTH_CHECK_WITH_SECURITY_USD).toBeGreaterThan(HEALTH_CHECK_PRICE_USD);
            expect(HEALTH_CHECK_WITH_SECURITY_EUR).toBeGreaterThan(HEALTH_CHECK_PRICE_EUR);
            expect(EMBEDDED_MONTHLY_RANGE_USD.min).toBeGreaterThan(ADVISOR_MONTHLY_MIN_USD);
            expect(EMBEDDED_MONTHLY_RANGE_EUR.min).toBeGreaterThan(ADVISOR_MONTHLY_MIN_EUR);
        });
    });
});
