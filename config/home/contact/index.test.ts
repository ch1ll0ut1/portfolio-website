/**
 * Tests for the contact band's dictionary.
 */

import { describe, expect, it } from 'vitest';
import { INFORMAL_ADDRESS, dictionaryStrings, keyPaths } from '@/test/dictionary';
import { homeContactDe } from './de';
import { homeContactEn } from './en';
import { homeContactCopy } from './index';

describe('homeContactCopy', () => {
    it('should give English the English copy', () => {
        expect(homeContactCopy.en).toBe(homeContactEn);
    });

    it('should give German the German copy', () => {
        expect(homeContactCopy.de).toBe(homeContactDe);
    });

    it('should fill the same keys in German as in English', () => {
        expect(keyPaths(homeContactDe)).toEqual(keyPaths(homeContactEn));
    });

    it('should leave no German string empty, quote no dollars and never say "du"', () => {
        dictionaryStrings(homeContactDe).forEach(({ path, text }) => {
            expect(text.trim(), path).not.toBe('');
            expect(text, path).not.toContain('$');
            expect(text, path).not.toMatch(INFORMAL_ADDRESS);
        });
    });
});
