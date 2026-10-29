/**
 * Tests for the case study route's server entry points: which pages it
 * builds, the metadata it gives each, and the 404 for an unknown slug.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { notFound } from 'next/navigation';
import { caseStudies } from '@/config/caseStudies';
import { caseStudyDetails } from '@/config/caseStudyDetails';
import { absoluteUrl, siteConfig } from '@/config/site';
import { itemAt } from '@/test/itemAt';
// Imported once at module scope, as the blog article's test does, to keep the
// route's cold load out of the per-test timeout.
import CaseStudyPage, { generateMetadata, generateStaticParams } from './page';

const { NOT_FOUND } = vi.hoisted(() => ({ NOT_FOUND: new Error('NEXT_NOT_FOUND') }));

vi.mock('next/navigation', () => ({
    notFound: vi.fn(() => {
        throw NOT_FOUND;
    }),
}));

const params = (slug: string) => Promise.resolve({ slug });

describe('/work/[slug]', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should build one page per case study', async () => {
        const slugs = (await generateStaticParams()).map(param => param.slug);

        expect(slugs).toEqual(caseStudies.map(study => study.slug));
    });

    describe('generateMetadata', () => {
        it('should give a case its own title, description, canonical path and article card', async () => {
            const study = itemAt(caseStudies, 0);
            const detail = caseStudyDetails[study.id];
            const shareTitle = `${detail.metaTitle} | ${siteConfig.name}`;

            const metadata = await generateMetadata({ params: params(study.slug) });

            expect(metadata.title).toBe(detail.metaTitle);
            expect(metadata.description).toBe(detail.description);
            expect(metadata.alternates?.canonical).toBe(`/work/${study.slug}`);
            expect(metadata.openGraph).toMatchObject({
                title: shareTitle,
                description: detail.description,
                url: absoluteUrl(`/work/${study.slug}`),
                type: 'article',
                siteName: siteConfig.name,
                locale: 'en_US',
            });
            expect(metadata.twitter).toMatchObject({ card: 'summary_large_image', title: shareTitle });
            expect(metadata.robots).toBeUndefined();
        });

        it('should leave the robots tag of an unknown slug to Next', async () => {
            const metadata = await generateMetadata({ params: params('this-case-does-not-exist') });

            expect(metadata.title).toBe('Case study not found');
            expect(metadata.robots).toBeNull();
        });
    });

    describe('page', () => {
        it('should answer an unknown slug with notFound()', async () => {
            await expect(CaseStudyPage({ params: params('this-case-does-not-exist') })).rejects.toBe(NOT_FOUND);
            expect(notFound).toHaveBeenCalledOnce();
        });

        it('should render a known case without calling notFound()', async () => {
            await expect(CaseStudyPage({ params: params(itemAt(caseStudies, 0).slug) })).resolves.toBeTruthy();
            expect(notFound).not.toHaveBeenCalled();
        });
    });
});
