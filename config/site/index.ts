/**
 * Site-wide identity and the site's own words.
 *
 * Metadata, structured data, the sitemap, robots and the console greeting all
 * read from here, so the URL and the positioning line cannot drift apart
 * across files. The ways to reach him live in `links.ts`.
 */

import type { Locale } from '@/lib/i18n/locale';
import { siteDe } from './de';
import { siteEn } from './en';
import { type SiteIdentity, siteIdentity } from './identity';
import type { SiteCopy } from './types';

export { absoluteUrl, yearsShipping } from './identity';
export type { SiteCopy } from './types';

/** The site's title, positioning line and description in each language. */
export const siteCopy: Record<Locale, SiteCopy> = {
    en: siteEn,
    de: siteDe,
};

/** The identity with the English words, for everything that is English only. */
export const siteConfig: SiteIdentity & Pick<SiteCopy, 'jobTitle' | 'description'> = {
    ...siteIdentity,
    jobTitle: siteEn.jobTitle,
    description: siteEn.description,
};

/** The English site title; `siteCopy[locale].title` for a page in either language. */
export const siteTitle = siteEn.title;
