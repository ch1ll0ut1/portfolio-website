import type { Locale } from '@/lib/i18n/locale';
import { experienceDe } from './de';
import { experienceEn } from './en';
import type { ExperienceCopy } from './types';

export const experienceCopy: Record<Locale, ExperienceCopy> = {
    en: experienceEn,
    de: experienceDe,
};
