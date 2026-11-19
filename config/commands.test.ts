/**
 * Tests for the command palette's commands: data from here, words from the
 * chrome's dictionary.
 */

import { describe, expect, it } from 'vitest';
import { filterCommands } from '@/components/chrome/commandFilter';
import { chromeCopy } from './chrome';
import { chromeEn } from './chrome/en';
import { commandsFor } from './commands';
import { chordSections } from './sections';

describe('commandsFor', () => {
    const commands = commandsFor('en', chromeEn);

    it('should lead with a "Go to" command for every chord section but the top', () => {
        const goTo = commands.filter(command => command.group === chromeEn.commands.groups.goTo);

        expect(goTo.map(command => command.label)).toEqual(
            chordSections.filter(section => section.id !== 'top').map(section => chromeEn.sections[section.id]),
        );
        expect(goTo.map(command => command.hint)).toEqual(['G S', 'G W', 'G P', 'G E', 'G B', 'G C']);
    });

    // The one query a buyer types into a consultant's palette.
    it.each(['price', 'pricing', 'cost', 'Preis', 'Kosten'])('should find the services and their prices for "%s" in both languages', (query) => {
        (['en', 'de'] as const).forEach((locale) => {
            const ids = filterCommands(commandsFor(locale, chromeCopy[locale]), query).map(command => command.id);

            expect(ids).toEqual(expect.arrayContaining(['go-services', 'services-page']));
        });
    });

    it('should find the contact form for "email" and the call for "Termin"', () => {
        expect(filterCommands(commands, 'email').map(command => command.id)).toContain('contact-form');
        expect(filterCommands(commandsFor('de', chromeCopy.de), 'Termin').map(command => command.id)).toContain('book-call');
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
        expect(commandsFor('de', chromeCopy.de).find(command => command.id === 'services-page')?.hint).toBe('/de/leistungen');
    });

    it('should offer the other language, in that language, next to the theme switch', () => {
        const ids = commands.map(command => command.id);
        const english = commands.find(command => command.id === 'switch-language');
        const german = commandsFor('de', chromeCopy.de).find(command => command.id === 'switch-language');

        expect(english).toMatchObject({ label: 'Auf Deutsch lesen', hint: 'L', action: { type: 'language' } });
        expect(german).toMatchObject({ label: 'Read in English', hint: 'L' });
        expect(ids.indexOf('switch-language')).toBe(ids.indexOf('switch-theme') + 1);
    });

    it('should keep the English path in the route action, for the palette to localize', () => {
        expect(commandsFor('de', chromeCopy.de).find(command => command.id === 'contact-form')?.action).toEqual({ type: 'route', href: '/contact' });
    });
});
