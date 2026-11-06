/**
 * Tests for the metadata of a page that has a twin in the other language.
 */

import { describe, expect, it } from 'vitest';
import { siteConfig } from '@/config/site';
import { feedAlternateTypes } from '@/lib/feed';
import { pageMetadata } from './metadata';

const page = { enPath: '/privacy', title: 'Privacy Policy', description: 'How this site handles data.' };

describe('pageMetadata', () => {
    it.each([
        ['en', '/privacy'],
        ['de', '/de/datenschutz'],
    ] as const)('should give the %s page a self canonical and the shared language map', (locale, path) => {
        const metadata = pageMetadata({ ...page, locale });

        expect(metadata.alternates).toEqual({
            canonical: path,
            languages: { 'en': '/privacy', 'de': '/de/datenschutz', 'x-default': '/privacy' },
        });
        expect(metadata.openGraph).toMatchObject({ url: `${siteConfig.url}${path}` });
    });

    it('should share each page in its own locale with the other as the alternate', () => {
        expect(pageMetadata({ ...page, locale: 'en' }).openGraph).toMatchObject({ locale: 'en_US', alternateLocale: ['de_DE'] });
        expect(pageMetadata({ ...page, locale: 'de' }).openGraph).toMatchObject({ locale: 'de_DE', alternateLocale: ['en_US'] });
    });

    it('should share a templated title with the site name, as the layout template renders it', () => {
        const metadata = pageMetadata({ ...page, locale: 'en' });
        const shareTitle = `Privacy Policy | ${siteConfig.name}`;

        expect(metadata.title).toBe('Privacy Policy');
        expect(metadata.openGraph).toMatchObject({ siteName: siteConfig.name, title: shareTitle, type: 'website' });
        expect(metadata.twitter).toMatchObject({ card: 'summary_large_image', title: shareTitle });
    });

    it('should share an absolute title as it is', () => {
        const metadata = pageMetadata({ ...page, locale: 'en', title: { absolute: 'Stefan Knoch — Privacy' } });

        expect(metadata.title).toEqual({ absolute: 'Stefan Knoch — Privacy' });
        expect(metadata.openGraph).toMatchObject({ title: 'Stefan Knoch — Privacy' });
    });

    it('should announce the feed of the page\'s own language, and only when asked', () => {
        expect(pageMetadata({ ...page, locale: 'en' }).alternates).not.toHaveProperty('types');
        expect(pageMetadata({ ...page, locale: 'en', feed: true }).alternates).toMatchObject({ types: feedAlternateTypes('en') });
        expect(pageMetadata({ ...page, locale: 'de', feed: true }).alternates).toMatchObject({ types: feedAlternateTypes('de') });
    });

    it('should share under its own share title when given one', () => {
        const metadata = pageMetadata({ ...page, locale: 'de', shareTitle: 'Datenschutz' });

        expect(metadata.openGraph).toMatchObject({ title: 'Datenschutz' });
        expect(metadata.twitter).toMatchObject({ title: 'Datenschutz' });
    });

    it('should share an article with its fields and its own image on both cards', () => {
        const image = { url: '/de/blog/a/card.png', width: 1200, height: 630, type: 'image/png', alt: 'A' };
        const metadata = pageMetadata({ ...page, locale: 'de', article: { tags: ['AI'] }, image });

        expect(metadata.openGraph).toMatchObject({ type: 'article', tags: ['AI'], images: [image], locale: 'de_DE' });
        expect(metadata.twitter).toMatchObject({ images: [image] });
    });

    it('should set robots only when asked', () => {
        expect(pageMetadata({ ...page, locale: 'en' })).not.toHaveProperty('robots');
        expect(pageMetadata({ ...page, locale: 'en', robots: { index: true, follow: true } }).robots).toEqual({ index: true, follow: true });
    });
});
