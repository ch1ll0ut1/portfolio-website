/**
 * Tests for the palette's list maths.
 *
 * Two things matter here: the filter has to match what a user would type
 * (including the group heading they can see), and grouping has to produce
 * indices the keyboard can rely on even after rows are filtered away.
 */

import { describe, expect, it } from 'vitest';
import type { Command } from '@/config/commands';
import { filterCommands, groupCommands } from './commandFilter';

const make = (id: string, group: string, label: string, hint = ''): Command => ({
    id,
    group,
    label,
    hint,
    action: { type: 'section', sectionId: id },
});

const sample: Command[] = [
    make('work', 'Go to', 'Work', 'G W'),
    make('services', 'Go to', 'Services', 'G S'),
    make('email', 'Actions', 'Copy email address', 'hello@example.com'),
];

describe('filterCommands', () => {
    it('should return every command for an empty query', () => {
        expect(filterCommands(sample, '   ')).toHaveLength(3);
    });

    it('should match on the label', () => {
        expect(filterCommands(sample, 'serv').map(command => command.id)).toEqual(['services']);
    });

    it('should match on the hint', () => {
        expect(filterCommands(sample, 'example').map(command => command.id)).toEqual(['email']);
    });

    it('should match on the group heading', () => {
        expect(filterCommands(sample, 'go to').map(command => command.id)).toEqual(['work', 'services']);
    });

    it('should ignore case and surrounding space', () => {
        expect(filterCommands(sample, '  WORK ').map(command => command.id)).toEqual(['work']);
    });

    it('should return nothing when no command matches', () => {
        expect(filterCommands(sample, 'nonsense')).toEqual([]);
    });
});

describe('groupCommands', () => {
    it('should gather consecutive commands under their heading', () => {
        const groups = groupCommands(sample);

        expect(groups.map(group => [group.label, group.items.map(item => item.command.id)])).toEqual([
            ['Go to', ['work', 'services']],
            ['Actions', ['email']],
        ]);
    });

    it('should number item indices by position in the filtered list, not the full one', () => {
        const items = groupCommands(filterCommands(sample, 'Actions')).flatMap(group => group.items);

        expect(items).toHaveLength(1);
        expect(items.every(item => item.index === 0)).toBe(true);
    });

    it('should number stagger order across headings and items together', () => {
        const orders = groupCommands(sample).flatMap(group => [group.order, ...group.items.map(item => item.order)]);

        expect(orders).toEqual([0, 1, 2, 3, 4]);
    });

    it('should return nothing for an empty list', () => {
        expect(groupCommands([])).toEqual([]);
    });
});
