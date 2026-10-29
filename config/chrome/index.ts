import type { Locale } from '@/lib/i18n/locale';
import { chromeEn } from './en';
import type { ChromeCopy } from './types';

export const chromeCopy: Record<Locale, ChromeCopy> = {
    en: chromeEn,
    de: chromeEn, // i18n: German copy pending
};
