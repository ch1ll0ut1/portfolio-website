import type { Locale } from '@/lib/i18n/locale';
import { proofDe } from './de';
import { proofEn } from './en';
import type { ProofCopy } from './types';

export const proofCopy: Record<Locale, ProofCopy> = {
    en: proofEn,
    de: proofDe,
};
