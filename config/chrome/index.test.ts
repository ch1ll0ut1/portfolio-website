/**
 * Tests for the site chrome's dictionary.
 */

import { describe, expect, it } from 'vitest';
import { INFORMAL_ADDRESS, dictionaryStrings, keyPaths } from '@/test/dictionary';
import { chromeDe } from './de';
import { chromeEn } from './en';
import { chromeCopy } from './index';

describe('chromeCopy', () => {
    it('should give English the English copy', () => {
        expect(chromeCopy.en).toBe(chromeEn);
    });

    it('should give German the German copy', () => {
        expect(chromeCopy.de).toBe(chromeDe);
    });

    it('should hold the same keys in German as in English', () => {
        expect(keyPaths(chromeDe)).toEqual(keyPaths(chromeEn));
    });

    it('should hold no empty German string', () => {
        const empty = dictionaryStrings(chromeDe).filter(({ text }) => text.trim() === '');

        expect(empty).toEqual([]);
    });

    it('should never address the reader informally in German', () => {
        const informal = dictionaryStrings(chromeDe).filter(({ text }) => INFORMAL_ADDRESS.test(text));

        expect(informal).toEqual([]);
    });
});
