/**
 * Tests for the case studies configuration.
 * Tests data integrity and structure.
 */

import { describe, it, expect } from 'vitest';
import { caseStudies } from './caseStudies';

describe('Case Studies Configuration', () => {
    describe('Case Studies Data Integrity', () => {
        it('should have unique case study ids', () => {
            // Act
            const ids = caseStudies.map(study => study.id);
            const uniqueIds = [...new Set(ids)];

            // Assert
            expect(uniqueIds).toHaveLength(ids.length);
        });

        it('should have four case studies', () => {
            // Assert
            expect(caseStudies).toHaveLength(4);
        });

        it('should have a valid case study structure', () => {
            // Assert
            caseStudies.forEach((study) => {
                expect(study).toMatchObject({
                    id: expect.any(String),
                    years: expect.any(String),
                    role: expect.any(String),
                    title: expect.any(String),
                    client: expect.any(String),
                    problem: expect.any(String),
                    did: expect.any(String),
                    result: expect.any(String),
                    tags: expect.arrayContaining([expect.any(String)]),
                    metric: {
                        value: expect.any(String),
                        label: expect.any(String),
                    },
                });
            });
        });

        it('should tell the full problem, action and result story for every case', () => {
            // Assert
            caseStudies.forEach((study) => {
                expect(study.problem.length).toBeGreaterThan(0);
                expect(study.did.length).toBeGreaterThan(0);
                expect(study.result.length).toBeGreaterThan(0);
            });
        });

        it('should have non-empty metric values and labels', () => {
            // Assert
            caseStudies.forEach((study) => {
                expect(study.metric.value).toBeTruthy();
                expect(study.metric.label).toBeTruthy();
            });
        });

        it('should have non-empty tags', () => {
            // Assert
            caseStudies.forEach((study) => {
                expect(study.tags.length).toBeGreaterThan(0);
                study.tags.forEach((tag) => {
                    expect(tag.length).toBeGreaterThan(0);
                });
            });
        });

        it('should only link out over https', () => {
            // Act
            const links = caseStudies.flatMap(study => study.link ? [study.link] : []);

            // Assert
            expect(links.length).toBeGreaterThan(0);
            links.forEach((link) => {
                expect(link.href).toMatch(/^https:\/\//);
                expect(link.label).toBeTruthy();
            });
        });
    });
});
