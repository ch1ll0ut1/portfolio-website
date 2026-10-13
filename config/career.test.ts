/**
 * Tests for the career log configuration.
 * Tests data integrity and the ordering the graph depends on.
 */

import { describe, it, expect } from 'vitest';
import { itemAt } from '@/test/itemAt';
import { careerLog } from './career';

const startYear = (years: string) => parseInt(years.slice(0, 4), 10);

describe('Career Log Configuration', () => {
    describe('Commit Data Integrity', () => {
        it('should have twelve commits', () => {
            // Assert
            expect(careerLog).toHaveLength(12);
        });

        it('should have unique hashes', () => {
            // Arrange
            const hashes = careerLog.map(commit => commit.hash);

            // Assert
            expect(new Set(hashes).size).toBe(hashes.length);
        });

        it('should have abbreviated hex hashes', () => {
            // Assert
            careerLog.forEach((commit) => {
                expect(commit.hash).toMatch(/^[0-9a-f]{7}$/);
            });
        });

        it('should have non-empty years, title and description', () => {
            // Assert
            careerLog.forEach((commit) => {
                expect(commit.years).toBeTruthy();
                expect(commit.title).toBeTruthy();
                expect(commit.description).toBeTruthy();
            });
        });

        it('should place every commit on a known branch', () => {
            // Assert
            careerLog.forEach((commit) => {
                expect(['indie', 'main']).toContain(commit.branch);
            });
        });

        it('should label its ref chips', () => {
            // Arrange
            const refs = careerLog.flatMap(commit => commit.ref ? [commit.ref] : []);

            // Assert
            expect(refs.length).toBeGreaterThan(0);
            refs.forEach((ref) => {
                expect(ref.label).toBeTruthy();
            });
        });
    });

    describe('Log Ordering', () => {
        it('should list commits newest first', () => {
            // Arrange
            const years = careerLog.map(commit => startYear(commit.years));

            // Assert
            years.forEach((year, index) => {
                if (index > 0) {
                    expect(year).toBeLessThanOrEqual(itemAt(years, index - 1));
                }
            });
        });

        it('should keep the indie branch above the main branch', () => {
            // Arrange
            const branches = careerLog.map(commit => commit.branch);
            const lastIndie = branches.lastIndexOf('indie');
            const firstMain = branches.indexOf('main');

            // Assert
            expect(firstMain).toBe(lastIndie + 1);
        });
    });

    describe('Branch Markers', () => {
        it('should mark exactly one fork point', () => {
            // Arrange
            const forks = careerLog.filter(commit => commit.isFork === true);

            // Assert
            expect(forks).toHaveLength(1);
        });

        it('should mark the last indie commit as the fork point', () => {
            // Arrange
            const forkIndex = careerLog.findIndex(commit => commit.isFork === true);

            // Assert
            expect(itemAt(careerLog, forkIndex).branch).toBe('indie');
            expect(itemAt(careerLog, forkIndex + 1).branch).toBe('main');
        });

        it('should mark exactly one root commit', () => {
            // Arrange
            const roots = careerLog.filter(commit => commit.isRoot === true);

            // Assert
            expect(roots).toHaveLength(1);
        });

        it('should mark the oldest commit as the root', () => {
            // Assert
            expect(itemAt(careerLog, careerLog.length - 1).isRoot).toBe(true);
        });
    });
});
