import type { Locale } from '@/lib/i18n/locale';
import { contactDe } from './de';
import { contactEn } from './en';
import type { ContactCopy } from './types';

export * from './form';
export type { ContactCopy } from './types';

/** The contact page's and form's words in each language. */
export const contactCopy: Record<Locale, ContactCopy> = {
    en: contactEn,
    de: contactDe,
};
