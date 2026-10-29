import type { Locale } from '@/lib/i18n/locale';
import { homeContactEn } from './en';
import type { HomeContactCopy } from './types';

export const homeContactCopy: Record<Locale, HomeContactCopy> = {
    en: homeContactEn,
    de: homeContactEn, // i18n: German copy pending
};
