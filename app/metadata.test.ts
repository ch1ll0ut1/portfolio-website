/**
 * Tests for the share and robots metadata of the static routes. Next merges
 * metadata one top-level key at a time, so whatever a page sets for `twitter`,
 * `openGraph` or `robots` replaces the layout's value whole; these pin what
 * each page ends up with on its own.
 */

import type { Metadata } from 'next';
import { describe, expect, it } from 'vitest';
import { siteConfig, siteTitle } from '@/config/site';
import { metadata as postNotFound } from './blog/[slug]/not-found';
import { metadata as blog } from './blog/page';
import { metadata as contact } from './contact/page';
import { metadata as notFound } from './not-found';
import { metadata as home } from './page';
import { metadata as privacy } from './privacy/page';

const pages: [string, Metadata][] = [
    ['/', home],
    ['/blog', blog],
    ['/privacy', privacy],
    ['/contact', contact],
];

describe('route metadata', () => {
    it.each(pages)('should give %s the large-image card', (_route, metadata) => {
        expect(metadata.twitter).toMatchObject({ card: 'summary_large_image' });
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
        const title = `Contact | ${siteConfig.name}`;
        const description = contact.description;

        expect(description).toEqual(expect.any(String));
        expect(description).not.toBe(siteConfig.description);
        expect(contact.title).toBe('Contact');
        expect(contact.openGraph).toMatchObject({ title, description, type: 'website', url: `${siteConfig.url}/contact` });
        expect(contact.twitter).toMatchObject({ title, description });
        expect(contact.alternates).toEqual({ canonical: '/contact' });
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
