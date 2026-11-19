/**
 * Tests for the cookie consent's dictionary.
 */

import { describe, expect, it } from 'vitest';
import { INFORMAL_ADDRESS, dictionaryStrings, keyPaths } from '@/test/dictionary';
import { consentDe } from './de';
import { consentEn } from './en';
import { consentCopy } from './index';

describe('consentCopy', () => {
    it('should give English the English copy', () => {
        expect(consentCopy.en).toBe(consentEn);
    });

    it('should give German the German copy', () => {
        expect(consentCopy.de).toBe(consentDe);
    });

    it('should hold the same keys in German as in English', () => {
        expect(keyPaths(consentDe)).toEqual(keyPaths(consentEn));
    });

    it('should hold no empty German string', () => {
        const empty = dictionaryStrings(consentDe).filter(({ text }) => text.trim() === '');

        expect(empty).toEqual([]);
    });

    it('should never address the reader informally in German', () => {
        const informal = dictionaryStrings(consentDe).filter(({ text }) => INFORMAL_ADDRESS.test(text));

        expect(informal).toEqual([]);
    });
});
