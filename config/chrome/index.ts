import type { Locale } from '@/lib/i18n/locale';
import { chromeDe } from './de';
import { chromeEn } from './en';
import type { ChromeCopy } from './types';

export const chromeCopy: Record<Locale, ChromeCopy> = {
    en: chromeEn,
    de: chromeDe,
};
