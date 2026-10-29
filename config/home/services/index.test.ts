/**
 * Tests for the engagements' dictionary.
 */

import { describe, expect, it } from 'vitest';
import { INFORMAL_ADDRESS, dictionaryStrings, keyPaths } from '@/test/dictionary';
import {
    FIRST_VERSION_RANGE_EUR,
    RESCUE_RANGE_EUR,
    TECH_LEAD_MONTHLY_MIN_EUR,
    eurAmountDe,
    eurRangeDe,
} from '../../pricing';
import { engagementsDe } from './de';
import { engagementsEn } from './en';
import { engagementsCopy } from './index';

describe('engagementsCopy', () => {
    it('should give English the English copy', () => {
        expect(engagementsCopy.en).toBe(engagementsEn);
    });

    describe('German copy', () => {
        it('should give German the German copy', () => {
            expect(engagementsCopy.de).toBe(engagementsDe);
        });

        it('should fill the same keys as the English', () => {
            expect(keyPaths(engagementsDe)).toEqual(keyPaths(engagementsEn));
        });

        it('should leave no string empty, quote no dollars and never say "du"', () => {
            dictionaryStrings(engagementsDe).forEach(({ path, text }) => {
                expect(text.trim(), path).not.toBe('');
                expect(text, path).not.toContain('$');
                expect(text, path).not.toMatch(INFORMAL_ADDRESS);
            });
        });

        it('should quote the euro figures set for DACH', () => {
            const { engagements } = engagementsDe;

            expect(engagements.rescue.range).toContain(eurRangeDe(RESCUE_RANGE_EUR));
            expect(engagements.build.range).toContain(eurRangeDe(FIRST_VERSION_RANGE_EUR));
            expect(engagements['tech-lead'].range).toContain(eurAmountDe(TECH_LEAD_MONTHLY_MIN_EUR));
        });
    });
});
