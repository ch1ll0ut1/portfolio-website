/**
 * Tests for the share and robots metadata of the static routes. Next merges
 * metadata one top-level key at a time, so whatever a page sets for `twitter`,
 * `openGraph` or `robots` replaces the layout's value whole; these pin what
 * each page ends up with on its own.
 */

import type { Metadata } from 'next';
import { describe, expect, it, vi } from 'vitest';
import { siteConfig, siteTitle } from '@/config/site';
import { feedAlternateTypes } from '@/lib/feed';
import { metadata as postNotFound } from './blog/[slug]/not-found';
import { metadata as blog } from './blog/page';
import { metadata as contact } from './contact/page';
import { metadata as notFound } from './not-found';
import { metadata as layout, viewport } from './layout';
import { metadata as home } from './page';
import { metadata as privacy } from './privacy/page';
import { metadata as services } from './services/page';

// The layout loads its faces through next/font, which only runs inside Next.
vi.mock('next/font/google', () => {
    const font = () => ({ className: '', style: { fontFamily: 'Font' } });

    return { Bricolage_Grotesque: font, Martian_Mono: font, Schibsted_Grotesk: font };
});

const pages: [string, Metadata][] = [
    ['/', home],
    ['/blog', blog],
    ['/privacy', privacy],
    ['/contact', contact],
    ['/services', services],
];

describe('route metadata', () => {
    it.each(pages)('should give %s the large-image card', (_route, metadata) => {
        expect(metadata.twitter).toMatchObject({ card: 'summary_large_image' });
    });

    // Next replaces the layout's `openGraph` whole, so each page carries these itself.
    it.each(pages)('should give %s the site name and locale on its share card', (_route, metadata) => {
        expect(metadata.openGraph).toMatchObject({ siteName: siteConfig.name, locale: 'en_US' });
    });

    it.each(pages)('should give %s a canonical URL of its own', (route, metadata) => {
        expect(metadata.alternates).toMatchObject({ canonical: route });
    });

    it.each([...pages, ['layout', layout] as [string, Metadata]])('should set no meta keywords on %s', (_route, metadata) => {
        expect(metadata).not.toHaveProperty('keywords');
    });

    it('should announce the RSS feed on the writing index', () => {
        expect(blog.alternates).toEqual({ canonical: '/blog', types: feedAlternateTypes });
    });

    it('should title the homepage with the positioning, within 60 characters', () => {
        expect(home.title).toEqual({ absolute: 'Stefan Knoch — Software Architect & Tech Lead' });
    });

    it('should describe /privacy with its own title and description on every network', () => {
        const title = `Privacy Policy | ${siteConfig.name}`;
        const description = privacy.description;

        expect(description).toEqual(expect.any(String));
        expect(description).not.toBe(siteConfig.description);
        expect(privacy.openGraph).toMatchObject({ title, description, type: 'website' });
        expect(privacy.twitter).toMatchObject({ title, description });
        expect(privacy.twitter).not.toMatchObject({ title: siteTitle });
    });

    it('should describe /contact with its own title, description and canonical URL', () => {
        const title = `Contact ${siteConfig.name} — hire a software architect & tech lead`;
        const description = contact.description;

        expect(description).toEqual(expect.any(String));
        expect(description).not.toBe(siteConfig.description);
        expect(contact.title).toEqual({ absolute: title });
        expect(title.length).toBeLessThanOrEqual(60);
        expect(contact.openGraph).toMatchObject({ title, description, type: 'website', url: `${siteConfig.url}/contact` });
        expect(contact.twitter).toMatchObject({ title, description });
        expect(contact.alternates).toEqual({ canonical: '/contact' });
    });

    // A canonical in the layout would reach the 404 and error pages too.
    it('should leave the canonical URL and the generator tag out of the layout', () => {
        expect(layout.alternates).toEqual({ types: feedAlternateTypes });
        expect(layout).not.toHaveProperty('generator');
        expect(layout.openGraph).toMatchObject({ siteName: siteConfig.name, locale: 'en_US' });
        expect(layout.openGraph).not.toHaveProperty('url');
    });

    it('should colour the browser chrome for both themes', () => {
        expect(viewport.colorScheme).toBe('dark light');
        expect(viewport.themeColor).toEqual([
            { media: '(prefers-color-scheme: dark)', color: '#0f171d' },
            { media: '(prefers-color-scheme: light)', color: '#edf1f2' },
        ]);
    });

    // Next adds its own `noindex` to every 404; a robots value here would be a
    // second tag, and leaving it out would inherit the layout's "index, follow".
    it.each([
        ['the site 404', notFound],
        ['the missing-post 404', postNotFound],
    ])('should leave the robots tag of %s to Next', (_page, metadata) => {
        expect(metadata.robots).toBeNull();
    });
});
