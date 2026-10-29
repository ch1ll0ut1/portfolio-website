import type { Locale } from '@/lib/i18n/locale';
import { heroEn } from './en';
import type { HeroCopy } from './types';

export const heroCopy: Record<Locale, HeroCopy> = {
    en: heroEn,
    de: heroEn, // i18n: German copy pending
};
