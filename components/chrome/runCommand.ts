/**
 * Carries out a palette command.
 *
 * Kept apart from the palette component so the action table stays readable and
 * so navigation and overlay handling can be injected rather than imported.
 */

import { showToast } from '@/lib/motion';
import type { ChromeCopy } from '@/config/chrome/types';
import type { CommandAction } from '@/config/commands';
import { type Locale, otherLocale } from '@/lib/i18n/locale';
import { localizedPath } from '@/lib/i18n/paths';
import { requestConsentPreferences } from '@/components/consent/ConsentContext';
import { switchLanguage } from './languageStore';
import { openExternal } from './openExternal';
import { togglePreference } from './preferences';
import { scrollToSection } from './scrollToSection';
import { toggleTheme } from './themeStore';

export interface CommandHandlers {
    openShortcuts: () => void;
    navigate: (href: string) => void;
    /** The page's language: routes go to its pages. */
    locale: Locale;
    /** What the toggles announce, in the page's language. */
    toasts: ChromeCopy['toasts'];
}

export const runCommand = (action: CommandAction, handlers: CommandHandlers) => {
    const { toasts } = handlers;

    switch (action.type) {
        case 'section':
            scrollToSection(action.sectionId, handlers.navigate, handlers.locale);
            break;
        case 'external':
            openExternal(action.url);
            break;
        case 'route':
            handlers.navigate(localizedPath(handlers.locale, action.href));
            break;
        case 'theme':
            toggleTheme();
            break;
        case 'language':
            switchLanguage(otherLocale(handlers.locale));
            break;
        case 'shortcuts':
            handlers.openShortcuts();
            break;
        case 'toggleSingleKeys':
            showToast(togglePreference('singleKeyShortcuts') ? toasts.singleKeysOn : toasts.singleKeysOff);
            break;
        case 'toggleCursor':
            showToast(togglePreference('caretCursor') ? toasts.cursorOn : toasts.cursorOff);
            break;
        case 'cookieSettings':
            requestConsentPreferences();
            break;
    }
};
