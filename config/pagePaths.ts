/**
 * The English paths of a case study's page and of an engagement's section on
 * the services page.
 *
 * Kept apart from `caseStudies.ts` and `engagements.ts`, which build their
 * data from both languages' dictionaries: the client components that link
 * there (the homepage's cards) import these without loading either language.
 */

import type { EngagementId } from './engagements';

/** The English path of a case study's own page. */
export const caseStudyPath = (study: { slug: string }) => `/work/${study.slug}`;

/** The English path of an engagement's section on the services page. */
export const engagementPath = (id: EngagementId) => `/services#${id}`;
