/**
 * Structured data for a case study page, built on the shared helpers in
 * `structuredData.ts` so the case points at the same Person node as every
 * other page.
 */

import { type CaseStudy, caseStudyPath } from '@/config/caseStudies';
import { type CaseStudyDetail, workCopy } from '@/config/caseStudyDetails';
import { absoluteUrl } from '@/config/site';
import { type Locale, intlLocale } from './i18n/locale';
import { localizedPath } from './i18n/paths';
import { type BreadcrumbItem, type JsonLdObject, authorRef } from './structuredData';

/** The breadcrumb trail of a case study in `locale`: Home › Work › the case. */
export const caseStudyBreadcrumbs = (study: CaseStudy, locale: Locale): BreadcrumbItem[] => {
    const names = workCopy[locale].breadcrumbs;

    return [
        { name: names.home, path: localizedPath(locale, '/') },
        { name: names.work, path: localizedPath(locale, '/#work') },
        { name: study.title, path: localizedPath(locale, caseStudyPath(study)) },
    ];
};

/** The CreativeWork node for one case study page in `locale`, told by `detail` in that language. */
export const caseStudySchema = (study: CaseStudy, detail: CaseStudyDetail, locale: Locale): JsonLdObject => {
    const path = localizedPath(locale, caseStudyPath(study));
    const url = absoluteUrl(path);
    const startYear = /^\d{4}/.exec(study.years)?.[0];

    return {
        '@type': 'CreativeWork',
        '@id': `${url}#work`,
        'name': detail.heading,
        'alternateName': study.title,
        'description': detail.description,
        'url': url,
        'image': absoluteUrl(`${path}/opengraph-image`),
        'author': authorRef(locale),
        'about': detail.topics.map(name => ({ '@type': 'Thing', name })),
        'keywords': [...detail.topics, ...study.tags].join(', '),
        ...(startYear ? { dateCreated: startYear } : {}),
        ...(study.link ? { sameAs: study.link.href } : {}),
        'inLanguage': intlLocale[locale],
    };
};
