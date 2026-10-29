import type { Locale } from '@/lib/i18n/locale';
import { processDe } from './de';
import { processEn } from './en';
import type { ProcessCopy } from './types';

export const processCopy: Record<Locale, ProcessCopy> = {
    en: processEn,
    de: processDe,
};
