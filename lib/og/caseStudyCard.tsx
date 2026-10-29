/**
 * A case study's share card (`/work/[slug]/opengraph-image` and its German
 * twin): the case's headline, its years and role, and its first tags.
 */

import { notFound } from 'next/navigation';
import { caseStudiesFor } from '@/config/caseStudies';
import { workCopy } from '@/config/caseStudyDetails';
import { siteConfig } from '@/config/site';
import type { Locale } from '@/lib/i18n/locale';
import { createOgImage } from './createOgImage';
import { OgHeadline } from './OgHeadline';
import { OgLayout } from './OgLayout';
import { OgMono } from './OgMono';
import { ogPalette } from './palette';
import { headlineSize, truncateAtWord } from './text';

/** Longest headline the card sets in full; three lines at the smallest headline size. */
const TITLE_MAX = 84;
const TAGS_SHOWN = 3;

/** The card's alt text in `locale`. */
export const caseStudyCardAlt = (locale: Locale) => workCopy[locale].card.alt(siteConfig.name);

/** One card per case. */
export const caseStudyCardParams = () => caseStudiesFor('en').map(study => ({ slug: study.slug }));

/** The card of the case at `slug` in `locale`. */
export const caseStudyCard = (slug: string, locale: Locale) => {
    const study = caseStudiesFor(locale).find(candidate => candidate.slug === slug);

    // Unreachable with the route's `dynamicParams` off; narrows `study` for the render.
    if (!study) {
        notFound();
    }

    const copy = workCopy[locale];
    const title = truncateAtWord(copy.details[study.id].heading, TITLE_MAX);

    return createOgImage(
        <OgLayout locale={locale} kicker={copy.card.kicker}>
            <OgHeadline text={title} fontSize={headlineSize(title)} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 36 }}>
                <OgMono>{[copy.card.metaKicker, study.years, study.role].join(' · ')}</OgMono>
                <OgMono color={ogPalette.caret}>
                    {study.tags.slice(0, TAGS_SHOWN).join(' / ')}
                </OgMono>
            </div>
        </OgLayout>,
    );
};
