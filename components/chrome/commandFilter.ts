/**
 * Pure list maths for the command palette.
 *
 * Filtering and grouping live here rather than in the component so the
 * keyboard behaviour can be reasoned about — and tested — without a DOM.
 */

import type { Command } from '@/config/commands';

export type CommandRow
    = | { kind: 'group'; label: string; order: number }
    /** `index` is the position in the filtered list, which is what selection uses. */
      | { kind: 'item'; command: Command; index: number; order: number };

/**
 * Substring match across label, hint and group.
 *
 * One flat haystack on purpose: typing "elsewhere" or "calendly" should find a
 * row just as readily as typing its label.
 */
export const filterCommands = (commands: Command[], query: string) => {
    const needle = query.trim().toLowerCase();

    if (!needle) {
        return commands;
    }

    return commands.filter(
        command => `${command.label} ${command.hint} ${command.group}`.toLowerCase().includes(needle),
    );
};

/**
 * Interleaves group headings into the filtered list.
 *
 * `order` counts every rendered row, headings included, because the entrance
 * stagger reads as one sequence down the list.
 */
export const buildCommandRows = (commands: Command[]): CommandRow[] => {
    const rows: CommandRow[] = [];
    let group: string | null = null;
    let order = 0;

    commands.forEach((command, index) => {
        if (command.group !== group) {
            group = command.group;
            rows.push({ kind: 'group', label: group, order: order++ });
        }

        rows.push({ kind: 'item', command, index, order: order++ });
    });

    return rows;
};
