import type { Locale } from '@/lib/i18n/locale';
import { engagementsEn } from './en';
import type { EngagementsCopy } from './types';

export const engagementsCopy: Record<Locale, EngagementsCopy> = {
    en: engagementsEn,
    de: engagementsEn, // i18n: German copy pending
};
