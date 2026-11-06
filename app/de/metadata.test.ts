/**
 * Tests for the metadata of the German routes: each names itself as
 * canonical and its English twin as its translation, shares in German, and
 * the reading pages announce the German feed.
 */

import type { Metadata } from 'next';
import { describe, expect, it, vi } from 'vitest';
import { blogPostsFor, tagLabel } from '@/config/blog';
import { caseStudiesFor } from '@/config/caseStudies';
import { siteConfig } from '@/config/site';
import { feedAlternateTypes } from '@/lib/feed';
import { itemAt } from '@/test/itemAt';
import { generateMetadata as postMetadata } from './blog/[slug]/page';
import { metadata as blog } from './blog/page';
import { metadata as privacy } from './datenschutz/page';
import { metadata as imprint } from './impressum/page';
import { metadata as contact } from './kontakt/page';
import { metadata as layout } from './layout';
import { metadata as home } from './page';
import { metadata as services } from './leistungen/page';
import { generateMetadata as caseMetadata } from './referenzen/[slug]/page';

// The layout loads its faces through next/font, which only runs inside Next.
vi.mock('next/font/google', () => {
    const font = () => ({ className: '', style: { fontFamily: 'Font' } });

    return { Bricolage_Grotesque: font, Martian_Mono: font, Schibsted_Grotesk: font };
});

// The contact page imports its Server Actions, whose module reads request headers.
vi.mock('next/headers', () => ({ headers: vi.fn() }));

const post = itemAt(blogPostsFor('de'), 0);
const study = itemAt(caseStudiesFor('de'), 0);
const params = (slug: string) => ({ params: Promise.resolve({ slug }) });

/** Each German page, its own path and its English twin's. */
const pages = async (): Promise<[string, string, Metadata][]> => [
    ['/de', '/', home],
    ['/de/blog', '/blog', blog],
    [`/de/blog/${post.slug}`, `/blog/${post.slug}`, await postMetadata(params(post.slug))],
    [`/de/referenzen/${study.slug}`, `/work/${study.slug}`, await caseMetadata(params(study.slug))],
    ['/de/kontakt', '/contact', contact],
    ['/de/datenschutz', '/privacy', privacy],
    ['/de/impressum', '/imprint', imprint],
    ['/de/leistungen', '/services', services],
];

describe('German route metadata', () => {
    it('should give every German page a self canonical and its English twin, English as the default', async () => {
        for (const [path, enPath, metadata] of await pages()) {
            expect(metadata.alternates, path).toMatchObject({
                canonical: path,
                languages: { 'en': enPath, 'de': path, 'x-default': enPath },
            });
        }
    });

    it('should share every German page in German, with English as the alternate', async () => {
        for (const [path, , metadata] of await pages()) {
            expect(metadata.openGraph, path).toMatchObject({
                siteName: siteConfig.name,
                locale: 'de_DE',
                alternateLocale: ['en_US'],
                url: `${siteConfig.url}${path}`,
            });
        }
    });

    it('should announce the German feed on the German homepage and reading pages', async () => {
        const [homepage, index, article] = await pages();

        expect(homepage?.[2].alternates).toMatchObject({ types: feedAlternateTypes('de') });

        expect(index?.[2].alternates).toMatchObject({ types: feedAlternateTypes('de') });
        expect(article?.[2].alternates).toMatchObject({ types: feedAlternateTypes('de') });
    });

    it('should title the German homepage with the German positioning', () => {
        expect(home.title).toEqual({ absolute: 'Stefan Knoch — Freier Softwarearchitekt & Interim-CTO' });
    });

    it('should give a German post its German card', async () => {
        const metadata = await postMetadata(params(post.slug));

        expect(metadata.openGraph?.images).toEqual([expect.objectContaining({ url: `/de/blog/${post.slug}/card.png`, alt: post.title })]);
    });

    it('should tag a German post with the German tag labels', async () => {
        const metadata = await postMetadata(params(post.slug));
        const openGraph = metadata.openGraph;
        const tags = openGraph && 'tags' in openGraph ? openGraph.tags : undefined;

        expect(tags).toEqual(post.tags.map(tag => tagLabel('de', tag)));
        expect(tags).not.toEqual(post.tags);
    });

    it('should announce the German feed from the German layout, for pages without their own', () => {
        expect(layout.alternates).toEqual({ types: feedAlternateTypes('de') });
    });
});
