/**
 * Tests for the engagements' dictionary.
 */

import { describe, expect, it } from 'vitest';
import { INFORMAL_ADDRESS, dictionaryStrings, keyPaths } from '@/test/dictionary';
import {
    ADVISOR_MONTHLY_MIN_EUR,
    EMBEDDED_MONTHLY_RANGE_EUR,
    FIRST_VERSION_RANGE_EUR,
    HEALTH_CHECK_PRICE_EUR,
    HEALTH_CHECK_WITH_SECURITY_EUR,
    RESCUE_RANGE_EUR,
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

            expect(engagements['health-check'].range).toContain(eurAmountDe(HEALTH_CHECK_PRICE_EUR));
            expect(engagements['health-check'].range).toContain(eurAmountDe(HEALTH_CHECK_WITH_SECURITY_EUR));
            expect(engagements.rescue.range).toContain(eurRangeDe(RESCUE_RANGE_EUR));
            expect(engagements.build.range).toContain(eurRangeDe(FIRST_VERSION_RANGE_EUR));
            expect(engagements['tech-lead'].range).toContain(eurAmountDe(ADVISOR_MONTHLY_MIN_EUR));
            expect(engagements['tech-lead'].range).toContain(eurRangeDe(EMBEDDED_MONTHLY_RANGE_EUR));
        });

        it('should call the App Health Check the Code-Audit, and name the search terms in the headings', () => {
            const { engagements } = engagementsDe;

            expect(engagements['health-check'].name).toContain('Code-Audit');
            expect(engagements['health-check'].short).toBe('Code-Audit');
            expect(engagements.build.name).toContain('App oder MVP entwickeln lassen');
            expect(engagements['tech-lead'].name).toContain('Interim-CTO oder Fractional CTO');
        });
    });
});
