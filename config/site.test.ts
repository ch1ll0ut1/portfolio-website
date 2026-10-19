/**
 * Tests for the site identity configuration.
 */

import { describe, it, expect } from 'vitest';
import { absoluteUrl, siteConfig, siteTitle, yearsShipping } from './site';

describe('Site Configuration', () => {
    it('should keep the canonical origin free of a trailing slash', () => {
        // Assert
        expect(siteConfig.url).toMatch(/^https:\/\/[^/]+$/);
    });

    it('should mention the start year in the description', () => {
        // Assert
        expect(siteConfig.description).toContain(String(siteConfig.sinceYear));
    });

    it('should have a fixed, valid static pages date', () => {
        // Assert
        expect(siteConfig.staticPagesUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(new Date(siteConfig.staticPagesUpdated).toString()).not.toBe('Invalid Date');
    });

    it('should build the title from the name and the positioning line', () => {
        // Assert
        expect(siteTitle.toLowerCase()).toBe(`${siteConfig.name} — ${siteConfig.jobTitle}`.toLowerCase());
        expect(siteTitle.length).toBeLessThanOrEqual(60);
    });

    it('should keep the description to the length a search result shows', () => {
        // Assert
        expect(siteConfig.description.length).toBeGreaterThanOrEqual(140);
        expect(siteConfig.description.length).toBeLessThanOrEqual(160);
    });

    describe('yearsShipping', () => {
        it('should count whole years since the start year', () => {
            // Act
            const years = yearsShipping(new Date('2026-10-13T12:00:00Z'));

            // Assert
            expect(years).toBe(2026 - siteConfig.sinceYear);
        });

        it('should grow by one each calendar year', () => {
            // Act
            const before = yearsShipping(new Date('2030-06-01T12:00:00Z'));
            const after = yearsShipping(new Date('2031-06-01T12:00:00Z'));

            // Assert
            expect(after - before).toBe(1);
        });
    });

    describe('absoluteUrl', () => {
        it('should resolve a path against the canonical origin', () => {
            // Assert
            expect(absoluteUrl('/blog/some-post')).toBe(`${siteConfig.url}/blog/some-post`);
        });

        it('should default to the homepage, as the bare origin its canonical link uses', () => {
            // Assert
            expect(absoluteUrl()).toBe(siteConfig.url);
            expect(absoluteUrl('/')).toBe(siteConfig.url);
        });

        it('should keep a fragment or query on the homepage', () => {
            // Assert
            expect(absoluteUrl('/#person')).toBe(`${siteConfig.url}/#person`);
            expect(absoluteUrl('/?a=1')).toBe(`${siteConfig.url}/?a=1`);
        });
    });
});
