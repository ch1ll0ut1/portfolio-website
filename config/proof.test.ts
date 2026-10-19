/**
 * Tests for proof configuration module.
 * Tests data integrity and structure, not function behavior.
 */

import { describe, it, expect } from 'vitest';
import { proofClients, proofStats } from './proof';
import { siteConfig } from './site';

describe('Proof Configuration', () => {
    describe('Client Data Integrity', () => {
        it('should have unique client names', () => {
            // Act
            const unique = [...new Set(proofClients)];

            // Assert
            expect(unique).toHaveLength(proofClients.length);
        });

        it('should have non-empty client names', () => {
            // Assert
            proofClients.forEach((name) => {
                expect(name).toBeTruthy();
                expect(name.trim()).toBe(name);
            });
        });

        it('should have enough clients to fill a marquee row', () => {
            // Assert
            expect(proofClients.length).toBeGreaterThanOrEqual(6);
        });
    });

    describe('Stats Data Integrity', () => {
        it('should have unique stat IDs', () => {
            // Act
            const ids = proofStats.map(stat => stat.id);
            const uniqueIds = [...new Set(ids)];

            // Assert
            expect(uniqueIds).toHaveLength(ids.length);
        });

        it('should have non-empty labels', () => {
            // Assert
            proofStats.forEach((stat) => {
                expect(stat.label).toBeTruthy();
                expect(stat.label.length).toBeGreaterThan(0);
            });
        });

        it('should have digit-only values and starting values', () => {
            // Assert
            proofStats.forEach((stat) => {
                expect(stat.value).toMatch(/^\d+$/);
                expect(stat.from).toMatch(/^\d+$/);
            });
        });

        it('should have valid stat structure', () => {
            // Assert
            proofStats.forEach((stat) => {
                expect(stat).toMatchObject({
                    id: expect.any(String),
                    label: expect.any(String),
                    value: expect.any(String),
                    from: expect.any(String),
                });
            });
        });

        it('should keep the factual numbers from the brief', () => {
            // Act
            const byId = new Map(proofStats.map(stat => [stat.id, stat]));

            // Assert
            expect(byId.get('since')?.value).toBe(String(siteConfig.sinceYear));
            // Break Media Solutions, 2011–2013.
            expect(byId.get('team-size')?.value).toBe('12');
            expect(byId.get('teams')?.value).toBe('3');
            expect(byId.get('messaging')?.value).toBe('2');
            expect(byId.get('messaging')?.suffix).toBe('×');
        });

        it('should roll the year up from an earlier year, not from zero', () => {
            // Act
            const since = proofStats.find(stat => stat.id === 'since');

            // Assert
            expect(since?.from).toHaveLength(since?.value.length ?? 0);
            expect(Number(since?.from)).toBeLessThan(Number(since?.value));
        });

        it('should expose four stats', () => {
            // Assert
            expect(proofStats).toHaveLength(4);
        });
    });
});
