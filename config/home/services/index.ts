import type { Locale } from '@/lib/i18n/locale';
import { engagementsDe } from './de';
import { engagementsEn } from './en';
import type { EngagementsCopy } from './types';

export const engagementsCopy: Record<Locale, EngagementsCopy> = {
    en: engagementsEn,
    de: engagementsDe,
};
