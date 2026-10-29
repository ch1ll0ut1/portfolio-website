import { notFound } from 'next/navigation';
import { caseStudies, findCaseStudy } from '@/config/caseStudies';
import { caseStudyDetails } from '@/config/caseStudyDetails';
import { siteConfig } from '@/config/site';
import { createOgImage, ogContentType, ogImageSize } from '@/lib/og/createOgImage';
import { OgHeadline } from '@/lib/og/OgHeadline';
import { OgLayout } from '@/lib/og/OgLayout';
import { OgMono } from '@/lib/og/OgMono';
import { ogPalette } from '@/lib/og/palette';
import { headlineSize, truncateAtWord } from '@/lib/og/text';

export const alt = `A case study from ${siteConfig.name}'s work`;
export const size = ogImageSize;
export const contentType = ogContentType;

/** Only the cases generated at build time have a card; anything else is a 404. */
export const dynamicParams = false;

/** Longest headline the card sets in full; three lines at the smallest headline size. */
const TITLE_MAX = 84;
const TAGS_SHOWN = 3;

export async function generateStaticParams() {
    return caseStudies.map(study => ({ slug: study.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const study = findCaseStudy(slug);

    // Unreachable with `dynamicParams` off; narrows `study` for the render.
    if (!study) {
        notFound();
    }

    const title = truncateAtWord(caseStudyDetails[study.id].heading, TITLE_MAX);

    return createOgImage(
        <OgLayout kicker="case study">
            <OgHeadline text={title} fontSize={headlineSize(title)} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 36 }}>
                <OgMono>{['work', study.years, study.role].join(' · ')}</OgMono>
                <OgMono color={ogPalette.caret}>
                    {study.tags.slice(0, TAGS_SHOWN).join(' / ')}
                </OgMono>
            </div>
        </OgLayout>,
    );
}
