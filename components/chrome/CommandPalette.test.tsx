/**
 * Tests for the command palette.
 *
 * Covers what a keyboard user actually relies on: that typing narrows the
 * list, that the arrows wrap around it, that Enter runs the row the listbox
 * says is selected, and that focus comes back where it started on close.
 */

import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { itemAt } from '@/test/itemAt';
import { installMatchMedia } from '../../test/motionEnv';
import { CommandPalette } from './CommandPalette';

const push = vi.fn();

vi.mock('next/navigation', () => ({
    useRouter: () => ({ push }),
}));

const options = () => screen.getAllByRole('option');
const selectedOption = () => options().find(option => option.getAttribute('aria-selected') === 'true');

describe('<CommandPalette>', () => {
    let restoreMedia: () => void;
    let onClose: Mock<() => void>;
    let onOpenShortcuts: Mock<() => void>;

    /** Renders the palette open and waits for it to take focus, as it does for a real user. */
    const mount = async () => {
        const view = render(<CommandPalette open onClose={onClose} onOpenShortcuts={onOpenShortcuts} />);

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toHaveFocus();
        });

        return view;
    };

    beforeEach(() => {
        restoreMedia = installMatchMedia();
        onClose = vi.fn();
        onOpenShortcuts = vi.fn();
        push.mockClear();
        Element.prototype.scrollIntoView = vi.fn();
    });

    afterEach(() => {
        restoreMedia();
    });

    it('should focus the search input when it opens', async () => {
        await mount();

        expect(screen.getByRole('combobox')).toHaveFocus();
    });

    it('should list every command grouped under its heading', async () => {
        await mount();

        expect(screen.getByText('Go to')).toBeInTheDocument();
        expect(screen.getByText('Actions')).toBeInTheDocument();
        expect(screen.getByText('Elsewhere')).toBeInTheDocument();
    });

    it('should select the first row by default', async () => {
        await mount();

        expect(selectedOption()).toHaveTextContent('Work');
    });

    it('should narrow the list to matching rows as the user types', async () => {
        const user = userEvent.setup();

        await mount();
        await user.type(screen.getByRole('combobox'), 'linkedin');

        expect(options()).toHaveLength(1);
        expect(options()[0]).toHaveTextContent('LinkedIn');
    });

    it('should match on a group heading as well as a label', async () => {
        const user = userEvent.setup();

        await mount();
        await user.type(screen.getByRole('combobox'), 'elsewhere');

        expect(options()).toHaveLength(3);
    });

    it('should show an empty state when nothing matches', async () => {
        const user = userEvent.setup();

        await mount();
        await user.type(screen.getByRole('combobox'), 'zzzz');

        expect(screen.queryAllByRole('option')).toHaveLength(0);
        expect(screen.getByText(/No matches/)).toBeInTheDocument();
    });

    it('should move the selection down with the arrow keys', async () => {
        const user = userEvent.setup();

        await mount();
        await user.keyboard('{ArrowDown}');

        expect(selectedOption()).toHaveTextContent('Services');
    });

    it('should wrap from the first row to the last on arrow up', async () => {
        const user = userEvent.setup();

        await mount();

        const last = options().length - 1;

        await user.keyboard('{ArrowUp}');

        expect(itemAt(options(), last).getAttribute('aria-selected')).toBe('true');
    });

    it('should point aria-activedescendant at the selected row', async () => {
        const user = userEvent.setup();

        await mount();
        await user.keyboard('{ArrowDown}');

        expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', selectedOption()?.id);
    });

    it('should reset the selection when the query changes', async () => {
        const user = userEvent.setup();

        await mount();
        await user.keyboard('{ArrowDown}{ArrowDown}');
        await user.type(screen.getByRole('combobox'), 'go');

        expect(selectedOption()).toHaveTextContent('Work');
    });

    it('should run the selected command on Enter and close', async () => {
        const user = userEvent.setup();

        await mount();
        await user.type(screen.getByRole('combobox'), 'blog');
        await user.keyboard('{Enter}');

        expect(onClose).toHaveBeenCalled();
        await waitFor(() => {
            expect(push).toHaveBeenCalledWith('/blog');
        });
    });

    it('should run a command on click', async () => {
        const user = userEvent.setup();

        await mount();
        await user.type(screen.getByRole('combobox'), 'blog');
        await user.click(itemAt(options(), 0));

        expect(onClose).toHaveBeenCalled();
    });

    it('should open the shortcuts list from its command', async () => {
        const user = userEvent.setup();

        await mount();
        await user.type(screen.getByRole('combobox'), 'shortcuts');
        await user.keyboard('{Enter}');

        await waitFor(() => {
            expect(onOpenShortcuts).toHaveBeenCalled();
        });
    });

    it('should do nothing on Enter while the list is empty', async () => {
        const user = userEvent.setup();

        await mount();
        await user.type(screen.getByRole('combobox'), 'zzzz');
        await user.keyboard('{Enter}');

        expect(onClose).not.toHaveBeenCalled();
    });

    it('should close on Escape', async () => {
        const user = userEvent.setup();

        await mount();
        await user.keyboard('{Escape}');

        expect(onClose).toHaveBeenCalled();
    });

    it('should open as a modal dialog', async () => {
        await mount();

        expect(screen.getByRole('dialog', { name: 'Command menu' })).toHaveAttribute('open');
    });

    it('should name the combobox and say it filters a list', async () => {
        await mount();

        const combobox = screen.getByRole('combobox', { name: 'Search commands' });

        expect(combobox).toHaveAttribute('aria-autocomplete', 'list');
        expect(combobox).toHaveAttribute('aria-expanded', 'true');
        expect(combobox).toHaveAttribute('aria-controls', screen.getByRole('listbox').id);
    });

    it('should report the list collapsed and show the empty state outside it when nothing matches', async () => {
        const user = userEvent.setup();

        await mount();
        await user.type(screen.getByRole('combobox'), 'zzzz');

        expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
        expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-activedescendant');
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
        expect(screen.getByText(/No matches/)).toBeVisible();
    });

    it('should label each group of options with its heading', async () => {
        await mount();

        const groups = screen.getAllByRole('group');

        expect(groups.map(group => group.getAttribute('aria-labelledby') && document.getElementById(String(group.getAttribute('aria-labelledby')))?.textContent))
            .toEqual(['Go to', 'Actions', 'Elsewhere']);
        expect(screen.getByRole('group', { name: 'Elsewhere' })).toContainElement(screen.getByRole('option', { name: /GitHub/ }));
    });

    it('should announce how many commands the query left', async () => {
        const user = userEvent.setup();

        await mount();

        expect(screen.getByRole('status')).toBeEmptyDOMElement();

        await user.type(screen.getByRole('combobox'), 'linkedin');

        expect(screen.getByRole('status')).toHaveTextContent('1 command');

        await user.type(screen.getByRole('combobox'), 'zzzz');

        expect(screen.getByRole('status')).toHaveTextContent('No matching commands');
    });

    it('should start from a clean query each time it opens', async () => {
        const user = userEvent.setup();
        const view = await mount();

        await user.type(screen.getByRole('combobox'), 'linkedin');
        view.rerender(<CommandPalette open={false} onClose={onClose} onOpenShortcuts={onOpenShortcuts} />);
        view.rerender(<CommandPalette open onClose={onClose} onOpenShortcuts={onOpenShortcuts} />);

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toHaveValue('');
        });
        expect(selectedOption()).toHaveTextContent('Work');
    });

    it('should close when the backdrop is clicked', async () => {
        const user = userEvent.setup();
        const { container } = await mount();
        const scrim = container.querySelector('dialog > [aria-hidden="true"]');

        if (!scrim) {
            throw new Error('The dialog has no scrim');
        }

        await user.click(scrim);

        expect(onClose).toHaveBeenCalled();
    });

    it('should restore focus to the element that opened it', async () => {
        const trigger = document.createElement('button');

        document.body.appendChild(trigger);
        trigger.focus();

        const view = render(
            <CommandPalette open={false} onClose={onClose} onOpenShortcuts={onOpenShortcuts} />,
        );

        view.rerender(<CommandPalette open onClose={onClose} onOpenShortcuts={onOpenShortcuts} />);
        await waitFor(() => {
            expect(screen.getByRole('combobox')).toHaveFocus();
        });

        await act(async () => {
            view.rerender(<CommandPalette open={false} onClose={onClose} onOpenShortcuts={onOpenShortcuts} />);
        });

        expect(trigger).toHaveFocus();
        trigger.remove();
    });
});
