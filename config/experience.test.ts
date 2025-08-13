/**
 * Tests for experience configuration module.
 * Tests data integrity and structure.
 */

import { describe, it, expect } from 'vitest';
import { experience, type ExperienceData } from './experience';

describe('Experience Configuration', () => {
    describe('Experience Data Integrity', () => {
        it('should have valid experience structure', () => {
            // Assert
            expect(experience).toMatchObject({
                technicalSkills: expect.arrayContaining([
                    expect.objectContaining({
                        name: expect.any(String),
                        skills: expect.arrayContaining([expect.any(String)]),
                    }),
                ]),
                leadershipItems: expect.arrayContaining([
                    expect.objectContaining({
                        title: expect.any(String),
                        description: expect.any(String),
                    }),
                ]),
            });
        });

        it('should have technical skill categories', () => {
            // Assert
            expect(experience.technicalSkills.length).toBeGreaterThan(0);
        });

        it('should have leadership items', () => {
            // Assert
            expect(experience.leadershipItems.length).toBeGreaterThan(0);
        });

        it('should have non-empty skill category names', () => {
            // Assert
            experience.technicalSkills.forEach((category) => {
                expect(category.name).toBeTruthy();
                expect(category.name.length).toBeGreaterThan(0);
            });
        });

        it('should have non-empty skills arrays', () => {
            // Assert
            experience.technicalSkills.forEach((category) => {
                expect(category.skills.length).toBeGreaterThan(0);
                category.skills.forEach((skill) => {
                    expect(skill.length).toBeGreaterThan(0);
                });
            });
        });

        it('should have non-empty leadership titles and descriptions', () => {
            // Assert
            experience.leadershipItems.forEach((item) => {
                expect(item.title).toBeTruthy();
                expect(item.description).toBeTruthy();
                expect(item.title.length).toBeGreaterThan(0);
                expect(item.description.length).toBeGreaterThan(0);
            });
        });
    });
});
