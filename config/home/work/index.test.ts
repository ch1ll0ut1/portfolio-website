/**
 * Tests for the work section's dictionary.
 */

import { describe, expect, it } from 'vitest';
import { INFORMAL_ADDRESS, dictionaryStrings, keyPaths } from '@/test/dictionary';
import { workDe } from './de';
import { workEn } from './en';
import { workCopy } from './index';

describe('workCopy', () => {
    it('should give English the English copy', () => {
        expect(workCopy.en).toBe(workEn);
    });

    it('should give German the German copy', () => {
        expect(workCopy.de).toBe(workDe);
    });

    it('should fill the same keys in German as in English', () => {
        expect(keyPaths(workDe)).toEqual(keyPaths(workEn));
    });

    it('should leave no German string empty, quote no dollars and never say "du"', () => {
        dictionaryStrings(workDe).forEach(({ path, text }) => {
            expect(text.trim(), path).not.toBe('');
            expect(text, path).not.toContain('$');
            expect(text, path).not.toMatch(INFORMAL_ADDRESS);
        });
    });
});
