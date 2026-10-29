/**
 * Tests for the proof section's dictionary.
 */

import { describe, expect, it } from 'vitest';
import { INFORMAL_ADDRESS, dictionaryStrings, keyPaths } from '@/test/dictionary';
import { proofDe } from './de';
import { proofEn } from './en';
import { proofCopy } from './index';

describe('proofCopy', () => {
    it('should give English the English copy', () => {
        expect(proofCopy.en).toBe(proofEn);
    });

    describe('German copy', () => {
        it('should give German the German copy', () => {
            expect(proofCopy.de).toBe(proofDe);
        });

        it('should fill the same keys as the English', () => {
            expect(keyPaths(proofDe)).toEqual(keyPaths(proofEn));
        });

        it('should leave no string empty, quote no dollars and never say "du"', () => {
            dictionaryStrings(proofDe).forEach(({ path, text }) => {
                expect(text.trim(), path).not.toBe('');
                expect(text, path).not.toContain('$');
                expect(text, path).not.toMatch(INFORMAL_ADDRESS);
            });
        });
    });
});
