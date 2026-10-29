/**
 * Tests for the experience section's dictionary.
 */

import { describe, expect, it } from 'vitest';
import { INFORMAL_ADDRESS, dictionaryStrings, keyPaths } from '@/test/dictionary';
import { experienceDe } from './de';
import { experienceEn } from './en';
import { experienceCopy } from './index';

describe('experienceCopy', () => {
    it('should give English the English copy', () => {
        expect(experienceCopy.en).toBe(experienceEn);
    });

    it('should give German the German copy', () => {
        expect(experienceCopy.de).toBe(experienceDe);
    });

    it('should fill the same keys in German as in English', () => {
        expect(keyPaths(experienceDe)).toEqual(keyPaths(experienceEn));
    });

    it('should leave no German string empty, quote no dollars and never say "du"', () => {
        dictionaryStrings(experienceDe).forEach(({ path, text }) => {
            expect(text.trim(), path).not.toBe('');
            expect(text, path).not.toContain('$');
            expect(text, path).not.toMatch(INFORMAL_ADDRESS);
        });
    });
});
