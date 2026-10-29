import type { Locale } from '@/lib/i18n/locale';
import { errorsDe } from './de';
import { errorsEn } from './en';
import type { ErrorsCopy } from './types';

export type { NotFoundKind } from './types';

/**
 * The 404 and error pages' words in each language. A plain module without
 * React or CSS, so app/global-not-found.tsx can read it too.
 */
export const errorsCopy: Record<Locale, ErrorsCopy> = {
    en: errorsEn,
    de: errorsDe,
};
