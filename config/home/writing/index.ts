import type { Locale } from '@/lib/i18n/locale';
import { writingEn } from './en';
import type { WritingCopy } from './types';

export const writingCopy: Record<Locale, WritingCopy> = {
    en: writingEn,
    de: writingEn, // i18n: German copy pending
};
