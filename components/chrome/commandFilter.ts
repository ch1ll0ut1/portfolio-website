/**
 * Pure list maths for the command palette.
 *
 * Filtering and grouping live here rather than in the component so the
 * keyboard behaviour can be reasoned about — and tested — without a DOM.
 */

import type { Command } from '@/config/commands';

export interface CommandItem {
    command: Command;
    /** Position in the filtered list, which is what selection uses. */
    index: number;
    order: number;
}

export interface CommandGroup {
    label: string;
    order: number;
    items: CommandItem[];
}

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
 * Groups the filtered list under its headings, keeping list order.
 *
 * `order` counts every rendered row, headings included, because the entrance
 * stagger reads as one sequence down the list.
 */
export const groupCommands = (commands: Command[]): CommandGroup[] => {
    const groups: CommandGroup[] = [];
    let order = 0;

    commands.forEach((command, index) => {
        let group = groups.at(-1);

        if (group?.label !== command.group) {
            group = { label: command.group, order: order++, items: [] };
            groups.push(group);
        }

        group.items.push({ command, index, order: order++ });
    });

    return groups;
};
