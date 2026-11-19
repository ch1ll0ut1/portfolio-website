/**
 * Tests for the writing section's dictionary.
 */

import { describe, expect, it } from 'vitest';
import { INFORMAL_ADDRESS, dictionaryStrings, keyPaths } from '@/test/dictionary';
import { writingDe } from './de';
import { writingEn } from './en';
import { writingCopy } from './index';

describe('writingCopy', () => {
    it('should give English the English copy', () => {
        expect(writingCopy.en).toBe(writingEn);
    });

    it('should give German the German copy', () => {
        expect(writingCopy.de).toBe(writingDe);
    });

    it('should fill the same keys in German as in English', () => {
        expect(keyPaths(writingDe)).toEqual(keyPaths(writingEn));
    });

    it('should leave no German string empty, quote no dollars and never say "du"', () => {
        dictionaryStrings(writingDe).forEach(({ path, text }) => {
            expect(text.trim(), path).not.toBe('');
            expect(text, path).not.toContain('$');
            expect(text, path).not.toMatch(INFORMAL_ADDRESS);
        });
    });
});
