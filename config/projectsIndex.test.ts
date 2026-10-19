/**
 * Tests for the project index configuration.
 * Tests data integrity and structure.
 */

import { describe, it, expect } from 'vitest';
import { projectsIndex } from './projectsIndex';

describe('Projects Index Configuration', () => {
    describe('Projects Index Data Integrity', () => {
        it('should have unique project ids', () => {
            // Act
            const ids = projectsIndex.map(project => project.id);
            const uniqueIds = [...new Set(ids)];

            // Assert
            expect(uniqueIds).toHaveLength(ids.length);
        });

        it('should have slug-safe ids, since they are used as paths', () => {
            // Assert
            projectsIndex.forEach((project) => {
                expect(project.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
            });
        });

        it('should have a valid project structure', () => {
            // Assert
            projectsIndex.forEach((project) => {
                expect(project).toMatchObject({
                    id: expect.any(String),
                    year: expect.any(String),
                    name: expect.any(String),
                    description: expect.any(String),
                    stack: expect.arrayContaining([expect.any(String)]),
                });
            });
        });

        it('should have non-empty names and descriptions', () => {
            // Assert
            projectsIndex.forEach((project) => {
                expect(project.name).toBeTruthy();
                expect(project.description).toBeTruthy();
            });
        });

        it('should have non-empty stack entries', () => {
            // Assert
            projectsIndex.forEach((project) => {
                expect(project.stack.length).toBeGreaterThan(0);
                project.stack.forEach((item) => {
                    expect(item.length).toBeGreaterThan(0);
                });
            });
        });

        it('should have projects', () => {
            // Assert
            expect(projectsIndex.length).toBeGreaterThan(0);
        });
    });
});
