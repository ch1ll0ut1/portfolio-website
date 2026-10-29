import type { Locale } from '@/lib/i18n/locale';
import { contactEn } from './en';
import type { ContactCopy } from './types';

export * from './form';
export type { ContactCopy } from './types';

/** The contact page's and form's words in each language. */
export const contactCopy: Record<Locale, ContactCopy> = {
    en: contactEn,
    de: contactEn, // i18n: German copy pending
};

/**
 * The English invitation, for the homepage's contact band until it reads
 * `contactCopy[locale].invitation` itself.
 */
export const contactInvitation = contactEn.invitation;
