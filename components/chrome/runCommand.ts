/**
 * Carries out a palette command.
 *
 * Kept apart from the palette component so the action table stays readable and
 * so navigation and overlay handling can be injected rather than imported.
 */

import { showToast } from '@/lib/motion';
import type { CommandAction } from '@/config/commands';
import { requestConsentPreferences } from '@/components/consent/ConsentContext';
import { openExternal } from './openExternal';
import { togglePreference } from './preferences';
import { scrollToSection } from './scrollToSection';
import { toggleTheme } from './themeStore';

export interface CommandHandlers {
    openShortcuts: () => void;
    navigate: (href: string) => void;
}

export const runCommand = (action: CommandAction, handlers: CommandHandlers) => {
    switch (action.type) {
        case 'section':
            scrollToSection(action.sectionId, handlers.navigate);
            break;
        case 'external':
            openExternal(action.url);
            break;
        case 'route':
            handlers.navigate(action.href);
            break;
        case 'theme':
            toggleTheme();
            break;
        case 'shortcuts':
            handlers.openShortcuts();
            break;
        case 'toggleSingleKeys':
            showToast(togglePreference('singleKeyShortcuts') ? 'Single-key shortcuts on' : 'Single-key shortcuts off');
            break;
        case 'toggleCursor':
            showToast(togglePreference('caretCursor') ? 'Custom cursor on' : 'Custom cursor off');
            break;
        case 'cookieSettings':
            requestConsentPreferences();
            break;
    }
};
