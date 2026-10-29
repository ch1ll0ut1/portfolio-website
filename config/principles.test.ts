/**
 * Tests for the working principles configuration module.
 * Tests data integrity and structure, not function behavior.
 */

import { describe, it, expect } from 'vitest';
import { principlesContent } from './principles';

describe('Principles Configuration', () => {
    describe('Principles Data Integrity', () => {
        it('should have exactly three principles', () => {
            expect(principlesContent.principles).toHaveLength(3);
        });

        it('should have unique principle IDs', () => {
            const ids = principlesContent.principles.map(principle => principle.id);

            expect([...new Set(ids)]).toHaveLength(ids.length);
        });

        it('should have a section label', () => {
            expect(principlesContent.label).toBe('Working principles');
        });

        it('should have a label, a heading and two paragraphs each', () => {
            principlesContent.principles.forEach((principle) => {
                expect(principle.label).toBeTruthy();
                expect(principle.heading).toBeTruthy();
                expect(principle.paragraphs).toHaveLength(2);
                principle.paragraphs.forEach((paragraph) => {
                    expect(paragraph.length).toBeGreaterThan(40);
                });
            });
        });

        it('should include the expected principles', () => {
            const labels = principlesContent.principles.map(principle => principle.label);

            expect(labels).toEqual(['Vision first', 'Two-way collaboration', 'Refinement']);
        });

        it('should keep headings short enough for a three-column layout', () => {
            principlesContent.principles.forEach((principle) => {
                expect(principle.heading.length).toBeLessThan(60);
            });
        });
    });
});
