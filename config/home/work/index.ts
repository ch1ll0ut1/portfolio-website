import type { Locale } from '@/lib/i18n/locale';
import { workDe } from './de';
import { workEn } from './en';
import type { WorkCopy } from './types';

export const workCopy: Record<Locale, WorkCopy> = {
    en: workEn,
    de: workDe,
};
