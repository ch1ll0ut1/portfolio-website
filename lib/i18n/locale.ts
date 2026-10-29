/**
 * The site's two languages. English is the default: its pages live at the
 * root, the German ones under `/de` (see ./paths.ts).
 */

export type Locale = 'en' | 'de';

export const locales: readonly Locale[] = ['en', 'de'];

export const defaultLocale: Locale = 'en';

/** The BCP 47 tag `Intl` formats numbers and dates with. */
export const intlLocale: Record<Locale, string> = {
    en: 'en-US',
    de: 'de-DE',
};

/** `og:locale` of each language, and `og:locale:alternate` of the other. */
export const ogLocale: Record<Locale, string> = {
    en: 'en_US',
    de: 'de_DE',
};

/** The language a page's twin is in. */
export const otherLocale = (locale: Locale): Locale => locale === 'en' ? 'de' : 'en';
