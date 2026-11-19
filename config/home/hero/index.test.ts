/**
 * Tests for the hero's dictionary.
 */

import { describe, expect, it } from 'vitest';
import { INFORMAL_ADDRESS, dictionaryStrings, keyPaths } from '@/test/dictionary';
import { heroDe } from './de';
import { heroEn } from './en';
import { heroCopy } from './index';

describe('heroCopy', () => {
    it('should give English the English copy', () => {
        expect(heroCopy.en).toBe(heroEn);
    });

    describe('German copy', () => {
        it('should give German the German copy', () => {
            expect(heroCopy.de).toBe(heroDe);
        });

        it('should fill the same keys as the English', () => {
            expect(keyPaths(heroDe)).toEqual(keyPaths(heroEn));
            expect(heroDe.kicker(7)).toHaveLength(heroEn.kicker(7).length);
        });

        it('should leave no string empty, quote no dollars and never say "du"', () => {
            dictionaryStrings(heroDe).forEach(({ path, text }) => {
                expect(text.trim(), path).not.toBe('');
                expect(text, path).not.toContain('$');
                expect(text, path).not.toMatch(INFORMAL_ADDRESS);
            });
        });

        it('should split the headline as the editor expects: a run, the marked phrase, the closing punctuation', () => {
            const { before, highlight, after } = heroDe.headline;

            expect(before).toMatch(/\S $/);
            expect(highlight).toBe(highlight.trim());
            expect(highlight).not.toBe('');
            expect(after).toMatch(/^[.!?]$/);
        });
    });
});
