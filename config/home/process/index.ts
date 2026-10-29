import type { Locale } from '@/lib/i18n/locale';
import { processEn } from './en';
import type { ProcessCopy } from './types';

export const processCopy: Record<Locale, ProcessCopy> = {
    en: processEn,
    de: processEn, // i18n: German copy pending
};
