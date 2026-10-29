/**
 * The page metadata of a case study route in either language, and of its
 * 404. The route files call these with their locale.
 */

import type { Metadata } from 'next';
import { notFoundMetadata } from '@/components/errors/notFoundMetadata';
import { caseStudyPath, findCaseStudy } from '@/config/caseStudies';
import { workCopy } from '@/config/caseStudyDetails';
import { siteConfig } from '@/config/site';
import type { Locale } from '@/lib/i18n/locale';
import { pageMetadata } from '@/lib/i18n/metadata';

/** The metadata of the case at `slug` in `locale`, with its twin, or its 404's for a slug with no case. */
export const caseStudyMetadata = (slug: string, locale: Locale): Metadata => {
    const study = findCaseStudy(slug);

    // Matches the not-found page, robots included.
    if (!study) {
        return notFoundMetadata(locale, 'caseStudy');
    }

    const detail = workCopy[locale].details[study.id];

    return pageMetadata({
        locale,
        enPath: caseStudyPath(study),
        title: detail.metaTitle,
        description: detail.description,
        article: {
            authors: [siteConfig.name],
            tags: study.tags,
        },
    });
};
