import type { Locale } from '@/lib/i18n/locale';
import { markdownDe } from './de';
import { markdownEn } from './en';
import type { MarkdownCopy } from './types';

export const markdownCopy: Record<Locale, MarkdownCopy> = {
    en: markdownEn,
    de: markdownDe,
};
