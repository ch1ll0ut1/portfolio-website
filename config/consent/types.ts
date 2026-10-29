/**
 * The shape of the cookie consent's words: the banner, the preferences
 * dialog and its categories.
 */

import type { ConsentState } from '@/lib/consentStorage';

export interface ConsentCategoryCopy {
    title: string;
    description: string;
}

export interface ConsentCopy {
    /** The heading of both the banner and the dialog. */
    title: string;
    privacyLink: string;
    banner: {
        body: string;
        customize: string;
        rejectAll: string;
        acceptAll: string;
    };
    dialog: {
        close: string;
        intro: string;
        cancel: string;
        save: string;
    };
    /** The badge on a category that cannot be switched off. */
    alwaysOn: string;
    categories: Record<keyof ConsentState, ConsentCategoryCopy>;
}
