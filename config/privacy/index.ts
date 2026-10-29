import type { Locale } from '@/lib/i18n/locale';
import { privacyEn } from './en';
import type { PrivacyCopy } from './types';

export type { PolicyBlock, PolicyCardCopy, PolicyItem, PrivacyCopy } from './types';

/**
 * When the policy text last changed. A fixed date: the policy changes when its
 * text does, not when the site is rebuilt. Both languages carry the same text,
 * so they share it.
 */
export const POLICY_LAST_UPDATED = '2026-10-19';

/** The privacy policy in each language: `/privacy` and `/de/datenschutz`. */
export const privacyCopy: Record<Locale, PrivacyCopy> = {
    en: privacyEn,
    de: privacyEn, // i18n: German copy pending
};
