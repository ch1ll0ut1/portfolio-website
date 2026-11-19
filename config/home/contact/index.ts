import type { Locale } from '@/lib/i18n/locale';
import { homeContactDe } from './de';
import { homeContactEn } from './en';
import type { HomeContactCopy } from './types';

export const homeContactCopy: Record<Locale, HomeContactCopy> = {
    en: homeContactEn,
    de: homeContactDe,
};
