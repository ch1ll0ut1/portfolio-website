import type { Locale } from '@/lib/i18n/locale';
import { experienceEn } from './en';
import type { ExperienceCopy } from './types';

export const experienceCopy: Record<Locale, ExperienceCopy> = {
    en: experienceEn,
    de: experienceEn, // i18n: German copy pending
};
