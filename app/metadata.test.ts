/**
 * Tests for the share metadata of the static routes. Next merges
 * metadata one top-level key at a time, so whatever a page sets for `twitter`
 * or `openGraph` replaces the layout's value whole;
 * these pin what each page ends up with on its own.
 */

import type { Metadata } from 'next';
import { describe, expect, it } from 'vitest';
import { siteConfig, siteTitle } from '@/config/site';
import { metadata as blog } from './blog/page';
import { metadata as home } from './page';
import { metadata as privacy } from './privacy/page';

const pages: [string, Metadata][] = [
    ['/', home],
    ['/blog', blog],
    ['/privacy', privacy],
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
});
