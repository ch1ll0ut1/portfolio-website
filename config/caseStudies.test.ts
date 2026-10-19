/**
 * Tests for the case studies configuration.
 * Tests data integrity and structure.
 */

import { describe, it, expect } from 'vitest';
import { caseStudies, caseStudyPath, findCaseStudy } from './caseStudies';
import { caseStudyDetails } from './caseStudyDetails';

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

describe('Case study pages', () => {
    it('should give every case a unique, URL-safe slug', () => {
        // Act
        const slugs = caseStudies.map(study => study.slug);

        // Assert
        expect(new Set(slugs).size).toBe(slugs.length);
        slugs.forEach((slug) => {
            expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)+$/);
        });
    });

    it('should find a case by its slug, and nothing for an unknown one', () => {
        // Assert
        caseStudies.forEach((study) => {
            expect(findCaseStudy(study.slug)).toBe(study);
            expect(caseStudyPath(study)).toBe(`/work/${study.slug}`);
        });
        expect(findCaseStudy('this-case-does-not-exist')).toBeUndefined();
    });

    it('should keep each rendered title within 60 characters and unique', () => {
        // Act
        const titles = caseStudies.map(study => `${caseStudyDetails[study.id].metaTitle} | Stefan Knoch`);

        // Assert
        expect(new Set(titles).size).toBe(titles.length);
        titles.forEach((title) => {
            expect(title.length, title).toBeLessThanOrEqual(60);
        });
    });

    it('should give each case a unique description of 140 to 160 characters', () => {
        // Act
        const descriptions = caseStudies.map(study => caseStudyDetails[study.id].description);

        // Assert
        expect(new Set(descriptions).size).toBe(descriptions.length);
        descriptions.forEach((description) => {
            expect(description.length, description).toBeGreaterThanOrEqual(140);
            expect(description.length, description).toBeLessThanOrEqual(160);
        });
    });

    it('should tell every part of the long story', () => {
        // Assert
        caseStudies.forEach((study) => {
            const detail = caseStudyDetails[study.id];

            expect(detail.heading).toBeTruthy();
            expect(detail.lede).toBeTruthy();
            expect(detail.problem.length).toBeGreaterThan(0);
            expect(detail.did.length).toBeGreaterThan(0);
            expect(detail.result.length).toBeGreaterThan(0);
            expect(detail.technical.length).toBeGreaterThan(0);
            expect(detail.topics.length).toBeGreaterThan(0);
        });
    });
});
