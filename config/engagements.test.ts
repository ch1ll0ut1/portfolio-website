/**
 * Tests for the engagements configuration module.
 * Tests data integrity and structure.
 */

import { describe, it, expect } from 'vitest';
import { itemAt } from '@/test/itemAt';
import { engagementLink, engagementNote, engagements, engagementsHeading, rangeLabel } from './engagements';

describe('Engagements Configuration', () => {
    describe('Engagement Data Integrity', () => {
        it('should have valid engagement structure', () => {
            // Assert
            expect(engagements).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(String),
                    name: expect.any(String),
                    subtitle: expect.any(String),
                    short: expect.any(String),
                    who: expect.any(String),
                    bullets: expect.arrayContaining([expect.any(String)]),
                    range: expect.any(String),
                    featured: expect.any(Boolean),
                }),
            ]));
        });

        it('should offer exactly three engagements', () => {
            // Assert
            expect(engagements).toHaveLength(3);
        });

        it('should have unique ids', () => {
            // Act
            const ids = engagements.map(engagement => engagement.id);

            // Assert
            expect(new Set(ids).size).toBe(ids.length);
        });

        it('should have non-empty copy on every engagement', () => {
            // Assert
            engagements.forEach((engagement) => {
                expect(engagement.name.length).toBeGreaterThan(0);
                expect(engagement.subtitle.length).toBeGreaterThan(0);
                expect(engagement.who.length).toBeGreaterThan(0);
                expect(engagement.range.length).toBeGreaterThan(0);
            });
        });

        it('should have four bullets on every engagement', () => {
            // Assert
            engagements.forEach((engagement) => {
                expect(engagement.bullets).toHaveLength(4);
                engagement.bullets.forEach((bullet) => {
                    expect(bullet.length).toBeGreaterThan(0);
                });
            });
        });

        it('should feature exactly one engagement', () => {
            // Act
            const featured = engagements.filter(engagement => engagement.featured);

            // Assert
            expect(featured).toHaveLength(1);
            expect(itemAt(featured, 0).id).toBe('build');
        });
    });

    describe('Section Copy', () => {
        it('should have a heading and a sub-line', () => {
            // Assert
            expect(engagementsHeading.title.length).toBeGreaterThan(0);
            expect(engagementsHeading.lede.length).toBeGreaterThan(0);
        });

        it('should have a label for the range lines', () => {
            // Assert
            expect(rangeLabel).toBe('Typical');
        });

        it('should link every card to its section of the services page', () => {
            // Assert
            expect(engagementLink.href('rescue')).toBe('/services#rescue');
        });

        it('should quote ranges, never an hourly rate', () => {
            // Assert
            engagements.forEach((engagement) => {
                expect(engagement.range).not.toMatch(/\/\s*h|per hour|hourly/i);
            });
        });
    });

    describe('Closing Note', () => {
        it('should have non-empty segments', () => {
            // Assert
            expect(engagementNote.length).toBeGreaterThan(0);
            engagementNote.forEach((segment) => {
                expect(segment.text.trim()).toBe(segment.text);
                expect(segment.text.length).toBeGreaterThan(0);
                expect(typeof segment.selected).toBe('boolean');
            });
        });

        it('should mark exactly one phrase as selected', () => {
            // Act
            const selected = engagementNote.filter(segment => segment.selected);

            // Assert
            expect(selected).toHaveLength(1);
            expect(itemAt(selected, 0).text).toBe('senior quality, faster.');
        });
    });
});
