/**
 * The consent categories the preferences dialog prints, in display order.
 *
 * The keys are the categories `lib/consentStorage` persists; this file only
 * carries their copy, so adding a category stays a one-place change there and
 * here.
 */

import type { ConsentState } from '@/lib/consentStorage';

export interface ConsentCategory {
    key: keyof ConsentState;
    title: string;
    description: string;
    /** Essential cookies cannot be switched off, so the row prints a badge. */
    locked: boolean;
}

export const consentCategories: ConsentCategory[] = [
    {
        key: 'essential',
        title: 'Essential cookies',
        description: 'Needed for the site to work. They hold your consent choice, and cannot be switched off.',
        locked: true,
    },
    {
        key: 'analytics',
        title: 'Analytics cookies',
        description: 'Report anonymously via Google Analytics how visitors move through the site, so I can see what is worth keeping. Google Analytics is not loaded at all unless this is on.',
        locked: false,
    },
];
