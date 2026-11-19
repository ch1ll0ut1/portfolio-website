import type { Locale } from '@/lib/i18n/locale';
import { legalNoticeDe } from './de';
import { legalNoticeEn } from './en';
import type { LegalNoticeCopy } from './types';

export { isPlaceholder, legalProvider } from './provider';
export type { LegalNoticeCopy } from './types';

/** The legal notice's words in each language: `/imprint` and `/de/impressum`. */
export const legalNoticeCopy: Record<Locale, LegalNoticeCopy> = {
    en: legalNoticeEn,
    de: legalNoticeDe,
};
