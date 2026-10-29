/**
 * The consent categories the preferences dialog prints, in display order.
 *
 * The keys are the categories `lib/consentStorage` persists; this file only
 * carries their order and whether they can be switched off, and their words
 * are in `config/consent/`, so adding a category stays a change there and
 * here.
 */

import { consentCopy } from '@/config/consent';
import type { Locale } from '@/lib/i18n/locale';
import type { ConsentState } from '@/lib/consentStorage';

export interface ConsentCategory {
    key: keyof ConsentState;
    title: string;
    description: string;
    /** Essential cookies cannot be switched off, so the row prints a badge. */
    locked: boolean;
}

const categories: Pick<ConsentCategory, 'key' | 'locked'>[] = [
    { key: 'essential', locked: true },
    { key: 'analytics', locked: false },
];

/** The categories, in display order, told in `locale`. */
export const consentCategoriesFor = (locale: Locale): ConsentCategory[] => categories.map(({ key, locked }) => ({
    key,
    ...consentCopy[locale].categories[key],
    locked,
}));
