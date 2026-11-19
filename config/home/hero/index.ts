import type { Locale } from '@/lib/i18n/locale';
import { heroDe } from './de';
import { heroEn } from './en';
import type { HeroCopy } from './types';

export const heroCopy: Record<Locale, HeroCopy> = {
    en: heroEn,
    de: heroDe,
};
