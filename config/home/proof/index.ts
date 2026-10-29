import type { Locale } from '@/lib/i18n/locale';
import { proofEn } from './en';
import type { ProofCopy } from './types';

export const proofCopy: Record<Locale, ProofCopy> = {
    en: proofEn,
    de: proofEn, // i18n: German copy pending
};
