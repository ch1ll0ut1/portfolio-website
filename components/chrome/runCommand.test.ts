/**
 * Tests for carrying out palette commands.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { commands } from '@/config/commands';
import { OPEN_CONSENT_PREFERENCES_EVENT } from '@/components/consent/ConsentContext';
import { readPreference, setPreference } from './preferences';
import { runCommand } from './runCommand';

const handlers = () => ({ openShortcuts: vi.fn(), navigate: vi.fn() });

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

    describe('switches', () => {
        beforeEach(() => {
            localStorage.clear();
            setPreference('singleKeyShortcuts', true);
            setPreference('caretCursor', true);
        });

        it('should list a command for each switch', () => {
            const types = commands.map(command => command.action.type);

            expect(types).toContain('toggleSingleKeys');
            expect(types).toContain('toggleCursor');
        });

        it('should flip the single-key shortcuts', () => {
            runCommand({ type: 'toggleSingleKeys' }, handlers());

            expect(readPreference('singleKeyShortcuts')).toBe(false);

            runCommand({ type: 'toggleSingleKeys' }, handlers());

            expect(readPreference('singleKeyShortcuts')).toBe(true);
        });

        it('should flip the custom cursor', () => {
            runCommand({ type: 'toggleCursor' }, handlers());

            expect(readPreference('caretCursor')).toBe(false);
        });
    });

    describe('sections', () => {
        afterEach(() => {
            document.body.innerHTML = '';
        });

        it('should scroll to the section and move focus there without scrolling again', () => {
            const section = document.createElement('section');
            const focus = vi.spyOn(section, 'focus');

            section.id = 'services';
            section.scrollIntoView = vi.fn();
            document.body.appendChild(section);

            runCommand({ type: 'section', sectionId: 'services' }, handlers());

            expect(section).toHaveFocus();
            expect(focus).toHaveBeenCalledWith({ preventScroll: true });
        });

        it('should keep a section that is already focusable as it is', () => {
            const section = document.createElement('section');

            section.id = 'services';
            section.tabIndex = 0;
            section.scrollIntoView = vi.fn();
            document.body.appendChild(section);

            runCommand({ type: 'section', sectionId: 'services' }, handlers());

            expect(section).toHaveAttribute('tabindex', '0');
        });

        it('should land "top" on the main landmark where there is no hero', () => {
            const main = document.createElement('main');

            main.id = 'main';
            document.body.appendChild(main);
            window.scrollTo = vi.fn();

            runCommand({ type: 'section', sectionId: 'top' }, handlers());

            expect(main).toHaveFocus();
        });

        it('should route to the homepage for a section this page does not have', () => {
            const commandHandlers = handlers();

            runCommand({ type: 'section', sectionId: 'process' }, commandHandlers);

            expect(commandHandlers.navigate).toHaveBeenCalledWith('/#process');
        });
    });
});
