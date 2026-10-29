import type { Locale } from '@/lib/i18n/locale';
import { consentEn } from './en';
import type { ConsentCopy } from './types';

export const consentCopy: Record<Locale, ConsentCopy> = {
    en: consentEn,
    de: consentEn, // i18n: German copy pending
};
