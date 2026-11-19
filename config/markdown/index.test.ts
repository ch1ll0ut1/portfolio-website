/**
 * Tests for the markdown renderer's dictionary.
 */

import { describe, expect, it } from 'vitest';
import { INFORMAL_ADDRESS, dictionaryStrings, keyPaths } from '@/test/dictionary';
import { markdownDe } from './de';
import { markdownEn } from './en';
import { markdownCopy } from './index';

describe('markdownCopy', () => {
    it('should give English the English copy', () => {
        expect(markdownCopy.en).toBe(markdownEn);
    });

    it('should give German the German copy', () => {
        expect(markdownCopy.de).toBe(markdownDe);
    });

    it('should hold the same keys in German as in English', () => {
        expect(keyPaths(markdownDe)).toEqual(keyPaths(markdownEn));
    });

    it('should hold no empty German string', () => {
        const empty = dictionaryStrings(markdownDe).filter(({ text }) => text.trim() === '');

        expect(empty).toEqual([]);
    });

    it('should never address the reader informally in German', () => {
        const informal = dictionaryStrings(markdownDe).filter(({ text }) => INFORMAL_ADDRESS.test(text));

        expect(informal).toEqual([]);
    });
});
