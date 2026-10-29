/**
 * Tests for the process section's dictionary.
 */

import { describe, expect, it } from 'vitest';
import { INFORMAL_ADDRESS, dictionaryStrings, keyPaths } from '@/test/dictionary';
import { processDe } from './de';
import { processEn } from './en';
import { processCopy } from './index';

/** A terminal transcript's shell prompt, the one `$` the German copy keeps. */
const PROMPT_PATH = /\.transcript\.\d+\.0\.text$/;

describe('processCopy', () => {
    it('should give English the English copy', () => {
        expect(processCopy.en).toBe(processEn);
    });

    describe('German copy', () => {
        it('should give German the German copy', () => {
            expect(processCopy.de).toBe(processDe);
        });

        it('should fill the same keys as the English, span for span in the transcripts', () => {
            expect(keyPaths(processDe)).toEqual(keyPaths(processEn));
        });

        it('should leave no string empty, quote no dollars and never say "du"', () => {
            dictionaryStrings(processDe).forEach(({ path, text }) => {
                expect(text.trim(), path).not.toBe('');
                expect(text, path).not.toMatch(INFORMAL_ADDRESS);

                if (!(PROMPT_PATH.test(path) && text === '$')) {
                    expect(text, path).not.toContain('$');
                }
            });
        });

        it('should keep each transcript\'s command and tones as the English has them', () => {
            Object.entries(processDe.steps).forEach(([id, step]) => {
                const english = processEn.steps[id as keyof typeof processEn.steps];

                expect(step.transcript[0], id).toEqual(english.transcript[0]);
                expect(step.transcript.map(line => line.map(span => span.tone)), id)
                    .toEqual(english.transcript.map(line => line.map(span => span.tone)));
            });
        });
    });
});
