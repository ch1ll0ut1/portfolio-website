/**
 * Structured data for a case study page, built on the shared helpers in
 * `structuredData.ts` so the case points at the same Person node as every
 * other page.
 */

import { type CaseStudy, caseStudyPath } from '@/config/caseStudies';
import { type CaseStudyDetail } from '@/config/caseStudyDetails';
import { absoluteUrl } from '@/config/site';
import { type BreadcrumbItem, type JsonLdObject, authorRef } from './structuredData';

/** The breadcrumb trail of a case study: Home › Work › the case. */
export const caseStudyBreadcrumbs = (study: CaseStudy): BreadcrumbItem[] => [
    { name: 'Home', path: '/' },
    { name: 'Work', path: '/#work' },
    { name: study.title, path: caseStudyPath(study) },
];

/** The CreativeWork node for one case study page. */
export const caseStudySchema = (study: CaseStudy, detail: CaseStudyDetail): JsonLdObject => {
    const url = absoluteUrl(caseStudyPath(study));
    const startYear = /^\d{4}/.exec(study.years)?.[0];

    return {
        '@type': 'CreativeWork',
        '@id': `${url}#work`,
        'name': detail.heading,
        'alternateName': study.title,
        'description': detail.description,
        'url': url,
        'image': absoluteUrl(`${caseStudyPath(study)}/opengraph-image`),
        'author': authorRef(),
        'about': detail.topics.map(name => ({ '@type': 'Thing', name })),
        'keywords': [...detail.topics, ...study.tags].join(', '),
        ...(startYear ? { dateCreated: startYear } : {}),
        ...(study.link ? { sameAs: study.link.href } : {}),
        'inLanguage': 'en-US',
    };
};
