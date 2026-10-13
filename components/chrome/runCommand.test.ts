/**
 * Tests for the palette's cookie settings command.
 */

import { describe, expect, it, vi } from 'vitest';
import { commands } from '@/config/commands';
import { OPEN_CONSENT_PREFERENCES_EVENT } from '@/components/consent/ConsentContext';
import { runCommand } from './runCommand';

describe('runCommand', () => {
    it('should list a cookie settings command in the palette', () => {
        expect(commands.find(command => command.label === 'Cookie settings')?.action).toEqual({ type: 'cookieSettings' });
    });

    it('should ask the consent provider to reopen the preferences dialog', () => {
        // Arrange
        const listener = vi.fn();

        window.addEventListener(OPEN_CONSENT_PREFERENCES_EVENT, listener);

        // Act
        runCommand({ type: 'cookieSettings' }, { openShortcuts: vi.fn(), navigate: vi.fn() });

        // Assert
        expect(listener).toHaveBeenCalledTimes(1);
        window.removeEventListener(OPEN_CONSENT_PREFERENCES_EVENT, listener);
    });
});
