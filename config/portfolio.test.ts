/**
 * Tests for portfolio configuration module.
 * Tests data integrity and structure.
 */

import { describe, it, expect } from 'vitest';
import { portfolio, type PortfolioProject } from './portfolio';

describe('Portfolio Configuration', () => {
    describe('Portfolio Projects Data Integrity', () => {
        it('should have unique project IDs', () => {
            // Act
            const ids = portfolio.map(p => p.id);
            const uniqueIds = [...new Set(ids)];

            // Assert
            expect(uniqueIds).toHaveLength(ids.length);
        });

        it('should have non-empty titles and descriptions', () => {
            // Assert
            portfolio.forEach((project) => {
                expect(project.title).toBeTruthy();
                expect(project.description).toBeTruthy();
                expect(project.title.length).toBeGreaterThan(0);
                expect(project.description.length).toBeGreaterThan(0);
            });
        });

        it('should have valid project structure', () => {
            // Assert
            portfolio.forEach((project) => {
                expect(project).toMatchObject({
                    id: expect.any(String),
                    title: expect.any(String),
                    description: expect.any(String),
                    technologies: expect.arrayContaining([expect.any(String)]),
                });
            });
        });

        it('should have non-empty technologies arrays', () => {
            // Assert
            portfolio.forEach((project) => {
                expect(project.technologies.length).toBeGreaterThan(0);
                project.technologies.forEach((tech) => {
                    expect(tech.length).toBeGreaterThan(0);
                });
            });
        });

        it('should have portfolio projects', () => {
            // Assert
            expect(portfolio.length).toBeGreaterThan(0);
        });
    });
});
