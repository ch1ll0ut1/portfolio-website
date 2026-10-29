import type { Locale } from '@/lib/i18n/locale';
import { writingDe } from './de';
import { writingEn } from './en';
import type { WritingCopy } from './types';

export const writingCopy: Record<Locale, WritingCopy> = {
    en: writingEn,
    de: writingDe,
};
