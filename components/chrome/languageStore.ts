/**
 * The visitor's chosen language.
 *
 * Nothing is stored until the visitor picks a language on the site; until then
 * the boot script (`lib/bootScript.ts`) goes by the browser. Once stored, the
 * choice wins over the browser in both directions, on every page load.
 *
 * Other open tabs deliberately do not follow a change: there is no `storage`
 * listener here, unlike `followThemeAcrossTabs`. Switching language is a full
 * page load, and a tab holding a half-written contact message must not be
 * navigated away under the visitor. Those tabs pick the choice up on their
 * next page load.
 */

import { LANGUAGE_STORAGE_KEY, type Locale } from '@/lib/i18n/locale';
import { twinPath } from '@/lib/i18n/paths';

/** The stored choice, or null when there is none or storage is unusable. */
export const readStoredLanguage = (): Locale | null => {
    try {
        const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);

        return stored === 'en' || stored === 'de' ? stored : null;
    }
    catch {
        return null;
    }
};

export const storeLanguage = (language: Locale) => {
    try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
    catch {
        // Private browsing or a full quota: the switch still goes to the twin page.
    }
};

/**
 * Stores `target` and moves to this page's twin in it. A replace rather than
 * a push, the way the boot script forwards: the page in the old language is
 * not left on the history stack for Back to bounce off.
 */
export const switchLanguage = (target: Locale) => {
    storeLanguage(target);
    location.replace(twinPath(location.pathname, target) + location.search + location.hash);
};
