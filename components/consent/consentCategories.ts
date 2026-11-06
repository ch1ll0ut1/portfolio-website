/**
 * The consent categories the preferences dialog prints, in display order.
 *
 * The keys are the categories `lib/consentStorage` persists; this file only
 * carries their order and whether they can be switched off, and their words
 * are in `config/consent/`, so adding a category stays a change there and
 * here.
 */

import type { ConsentCopy } from '@/config/consent/types';
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

/** The categories, in display order, told in the page's consent words, `copy`. */
export const consentCategoriesFor = (copy: ConsentCopy): ConsentCategory[] => categories.map(({ key, locked }) => ({
    key,
    ...copy.categories[key],
    locked,
}));
