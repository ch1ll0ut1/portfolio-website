/**
 * Carries out a palette command.
 *
 * Kept apart from the palette component so the action table stays readable and
 * so navigation and overlay handling can be injected rather than imported.
 */

import { copyText } from '@/lib/motion';
import type { CommandAction } from '@/config/commands';
import { requestConsentPreferences } from '@/components/consent/ConsentContext';
import { openExternal } from './openExternal';
import { scrollToSection } from './scrollToSection';
import { toggleTheme } from './themeStore';

export interface CommandHandlers {
    openShortcuts: () => void;
    navigate: (href: string) => void;
}

export const runCommand = (action: CommandAction, handlers: CommandHandlers) => {
    switch (action.type) {
        case 'section':
            scrollToSection(action.sectionId);
            break;
        case 'external':
            openExternal(action.url);
            break;
        case 'route':
            handlers.navigate(action.href);
            break;
        case 'copy':
            void copyText(action.text, { label: action.toast });
            break;
        case 'theme':
            toggleTheme();
            break;
        case 'shortcuts':
            handlers.openShortcuts();
            break;
        case 'cookieSettings':
            requestConsentPreferences();
            break;
    }
};
