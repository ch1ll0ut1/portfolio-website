/**
 * Tests for the contact page's metadata and structured data in each language.
 */

import { describe, expect, it } from 'vitest';
import { contactCopy } from '@/config/contact';
import { siteConfig } from '@/config/site';
import { contactJsonLd, contactMetadata } from './contactMetadata';

describe('contactMetadata', () => {
    it('should use the dictionary\'s title as it is, with the page as canonical', () => {
        // Act
        const metadata = contactMetadata('en');

        // Assert
        expect(metadata.title).toEqual({ absolute: contactCopy.en.meta.title });
        expect(metadata.description).toBe(contactCopy.en.meta.description);
        expect(metadata.alternates).toEqual({ canonical: '/contact' });
        expect(metadata.openGraph).toMatchObject({ url: `${siteConfig.url}/contact` });
    });

    it('should point a German page at the German path', () => {
        expect(contactMetadata('de').alternates).toEqual({ canonical: '/de/kontakt' });
    });
});

describe('contactJsonLd', () => {
    it.each([
        ['en', '/contact', '/'],
        ['de', '/de/kontakt', '/de'],
    ] as const)('should name the page\'s language and its breadcrumb trail in %s', (locale, path, home) => {
        // Act
        const graph = JSON.stringify(contactJsonLd(locale));

        // Assert
        expect(graph).toContain(`"inLanguage":"${locale}"`);
        expect(graph).toContain(`"@id":"${siteConfig.url}${path}#contactpage"`);
        expect(graph).toContain(`"name":"${contactCopy[locale].breadcrumbs.page}"`);
        expect(graph).toContain(`"item":"${home === '/' ? siteConfig.url : `${siteConfig.url}${home}`}"`);
    });
});
