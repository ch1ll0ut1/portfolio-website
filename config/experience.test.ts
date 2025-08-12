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

        it('should have exactly 3 technical skill categories', () => {
            // Assert
            expect(experience.technicalSkills).toHaveLength(3);
        });

        it('should have exactly 4 leadership items', () => {
            // Assert
            expect(experience.leadershipItems).toHaveLength(4);
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

        it('should include expected skill categories', () => {
            // Act
            const categoryNames = experience.technicalSkills.map(c => c.name);

            // Assert
            expect(categoryNames).toContain('Languages & Frameworks');
            expect(categoryNames).toContain('Cloud & DevOps');
            expect(categoryNames).toContain('Databases');
        });

        it('should include expected leadership items', () => {
            // Act
            const leadershipTitles = experience.leadershipItems.map(i => i.title);

            // Assert
            expect(leadershipTitles).toContain('15+ Years Experience');
            expect(leadershipTitles).toContain('Team Leadership');
            expect(leadershipTitles).toContain('Project Management');
            expect(leadershipTitles).toContain('Strategic Planning');
        });
    });
});
