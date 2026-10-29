/**
 * The page metadata of a case study route in either language, and of its
 * 404. The route files call these with their locale.
 */

import type { Metadata } from 'next';
import { caseStudyPath, findCaseStudy } from '@/config/caseStudies';
import { workCopy } from '@/config/caseStudyDetails';
import { absoluteUrl, siteConfig } from '@/config/site';
import { baseOpenGraph } from '@/lib/baseOpenGraph';
import { type Locale, ogLocale } from '@/lib/i18n/locale';
import { localizedPath } from '@/lib/i18n/paths';
import { twitterCard } from '@/lib/twitterCard';

/**
 * A case's 404 metadata in `locale`. `robots: null` leaves the `noindex` to
 * Next, which sends its own with every 404, as on the blog.
 */
export const caseStudyNotFoundMetadata = (locale: Locale): Metadata => ({
    title: workCopy[locale].notFound.title,
    description: workCopy[locale].notFound.description,
    robots: null,
});

/** The metadata of the case at `slug` in `locale`, or its 404's for a slug with no case. */
export const caseStudyMetadata = (slug: string, locale: Locale): Metadata => {
    const study = findCaseStudy(slug);

    // Matches the not-found page, robots included.
    if (!study) {
        return caseStudyNotFoundMetadata(locale);
    }

    const detail = workCopy[locale].details[study.id];
    const path = localizedPath(locale, caseStudyPath(study));
    /** What the share cards show: the page title with the layout's name suffix. */
    const shareTitle = `${detail.metaTitle} | ${siteConfig.name}`;

    return {
        title: detail.metaTitle,
        description: detail.description,
        openGraph: {
            ...baseOpenGraph,
            locale: ogLocale[locale],
            title: shareTitle,
            description: detail.description,
            url: absoluteUrl(path),
            type: 'article',
            authors: [siteConfig.name],
            tags: study.tags,
        },
        twitter: twitterCard(shareTitle, detail.description),
        alternates: {
            canonical: path,
        },
    };
};
