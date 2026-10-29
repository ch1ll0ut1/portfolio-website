/**
 * The case study pages in each language: the long form of each case and the
 * words of the page around it.
 */

import type { Locale } from '@/lib/i18n/locale';
import { workEn } from './en';
import type { WorkCopy } from './types';

export type { CaseStudyDetail, WorkCopy } from './types';

export const workCopy: Record<Locale, WorkCopy> = {
    en: workEn,
    de: workEn, // i18n: German copy pending
};

/** Each case told in full, in `locale`. */
export const caseStudyDetailsFor = (locale: Locale) => workCopy[locale].details;

/** Each case told in full, in English: what the data checks on the copy read. */
export const caseStudyDetails = workEn.details;
