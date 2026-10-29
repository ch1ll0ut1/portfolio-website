import type { Locale } from '@/lib/i18n/locale';
import { workEn } from './en';
import type { WorkCopy } from './types';

export const workCopy: Record<Locale, WorkCopy> = {
    en: workEn,
    de: workEn, // i18n: German copy pending
};
