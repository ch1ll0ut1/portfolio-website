/**
 * Tests for the process steps configuration module.
 * Tests data integrity and structure, not function behavior.
 */

import { describe, it, expect } from 'vitest';
import { itemAt } from '@/test/itemAt';
import { processEn } from './home/process/en';
import { processSteps, processStepsFor } from './processSteps';

const processTitle = processEn.title;

const TONES = ['prompt', 'dim', 'ok', 'warn'];

describe('Process Steps Configuration', () => {
    describe('Process Steps Data Integrity', () => {
        it('should tell the English steps, the ones the services page reads, from the English dictionary', () => {
            expect(processSteps).toEqual(processStepsFor('en'));
            expect(processSteps.map(step => step.title)).toEqual(Object.values(processEn.steps).map(step => step.title));
        });

        it('should have exactly four steps', () => {
            expect(processSteps).toHaveLength(4);
        });

        it('should have unique step IDs', () => {
            const ids = processSteps.map(step => step.id);

            expect([...new Set(ids)]).toHaveLength(ids.length);
        });

        it('should describe the engagement in order', () => {
            expect(processSteps.map(step => step.title)).toEqual(['Talk', 'Map', 'Build', 'Hand over']);
        });

        it('should have non-empty titles and descriptions', () => {
            processSteps.forEach((step) => {
                expect(step.title).toBeTruthy();
                expect(step.description.length).toBeGreaterThan(20);
            });
        });

        it('should have a section title', () => {
            expect(processTitle).toBeTruthy();
        });
    });

    describe('Terminal Transcripts', () => {
        it('should open every transcript with a prompt', () => {
            processSteps.forEach((step) => {
                expect(itemAt(itemAt(step.transcript, 0), 0).tone).toBe('prompt');
                expect(itemAt(itemAt(step.transcript, 0), 0).text).toBe('$');
            });
        });

        it('should give every transcript a command and at least one output line', () => {
            processSteps.forEach((step) => {
                expect(step.transcript.length).toBeGreaterThan(1);
            });
        });

        it('should keep the command short enough to type on screen', () => {
            processSteps.forEach((step) => {
                const command = itemAt(step.transcript, 0).map(span => span.text).join('');

                expect(command.length).toBeLessThan(40);
            });
        });

        it('should only use known tones', () => {
            processSteps.forEach((step) => {
                step.transcript.flat().forEach((span) => {
                    expect(span.text).toBeTruthy();

                    if (span.tone !== undefined) {
                        expect(TONES).toContain(span.tone);
                    }
                });
            });
        });

        it('should keep transcripts free of newlines, which the line split owns', () => {
            processSteps.forEach((step) => {
                step.transcript.flat().forEach((span) => {
                    expect(span.text).not.toMatch(/\n/);
                });
            });
        });
    });
});
