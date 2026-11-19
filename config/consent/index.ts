import type { Locale } from '@/lib/i18n/locale';
import { consentDe } from './de';
import { consentEn } from './en';
import type { ConsentCopy } from './types';

export const consentCopy: Record<Locale, ConsentCopy> = {
    en: consentEn,
    de: consentDe,
};
