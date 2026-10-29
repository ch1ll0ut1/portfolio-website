/**
 * Tests for the fit guidance configuration module.
 * Tests data integrity and structure, not function behavior.
 */

import { describe, it, expect } from 'vitest';
import { fitContent } from './fit';

describe('Fit Configuration', () => {
    describe('Fit Data Integrity', () => {
        it('should have exactly two lists', () => {
            expect(fitContent.lists).toHaveLength(2);
        });

        it('should have unique list IDs', () => {
            const ids = fitContent.lists.map(list => list.id);

            expect([...new Set(ids)]).toHaveLength(ids.length);
        });

        it('should pair a fit list with an unfit list', () => {
            expect(fitContent.lists.map(list => list.tone)).toEqual(['fit', 'unfit']);
        });

        it('should have a label, a heading and an intro', () => {
            expect(fitContent.label).toBe('Fit');
            expect(fitContent.heading).toBeTruthy();
            expect(fitContent.intro.length).toBeGreaterThan(40);
        });

        it('should have titles and at least five items per list', () => {
            fitContent.lists.forEach((list) => {
                expect(list.title).toBeTruthy();
                expect(list.items.length).toBeGreaterThanOrEqual(5);
            });
        });

        it('should have unique, non-empty items in every list', () => {
            fitContent.lists.forEach((list) => {
                expect([...new Set(list.items)]).toHaveLength(list.items.length);
                list.items.forEach((item) => {
                    expect(item.length).toBeGreaterThan(20);
                });
            });
        });

        it('should keep the copy free of emoji, which the markers replace', () => {
            fitContent.lists.flatMap(list => list.items).forEach((item) => {
                expect(item).toMatch(/^[\w\s,.'-]+$/);
            });
        });
    });
});
