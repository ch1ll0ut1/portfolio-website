/**
 * Tests for the command palette's commands: data from here, words from the
 * chrome's dictionary.
 */

import { describe, expect, it } from 'vitest';
import { chromeEn } from './chrome/en';
import { commandsFor } from './commands';
import { chordSections } from './sections';

describe('commandsFor', () => {
    const commands = commandsFor('en');

    it('should lead with a "Go to" command for every chord section but the top', () => {
        const goTo = commands.filter(command => command.group === chromeEn.commands.groups.goTo);

        expect(goTo.map(command => command.label)).toEqual(
            chordSections.filter(section => section.id !== 'top').map(section => chromeEn.sections[section.id]),
        );
        expect(goTo.map(command => command.hint)).toEqual(['G W', 'G S', 'G P', 'G E', 'G B', 'G C']);
    });

    it('should have unique ids and a label for every command', () => {
        expect(new Set(commands.map(command => command.id)).size).toBe(commands.length);
        commands.forEach((command) => {
            expect(command.label).not.toBe('');
        });
    });

    it('should prefer a worded hint from the dictionary over a key or a name', () => {
        expect(commands.find(command => command.id === 'custom-cursor')?.hint).toBe('Caret cursor');
        expect(commands.find(command => command.id === 'switch-theme')?.hint).toBe('T');
    });

    it('should hint each route with its path in the page\'s language', () => {
        expect(commands.find(command => command.id === 'services-page')?.hint).toBe('/services');
        expect(commandsFor('de').find(command => command.id === 'services-page')?.hint).toBe('/de/leistungen');
    });

    it('should keep the English path in the route action, for the palette to localize', () => {
        expect(commandsFor('de').find(command => command.id === 'contact-form')?.action).toEqual({ type: 'route', href: '/contact' });
    });
});
