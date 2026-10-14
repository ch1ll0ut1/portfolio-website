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
import styles from './CommandPalette.module.css';
import { setPreference } from './preferences';

const push = vi.fn();

vi.mock('next/navigation', () => ({
    useRouter: () => ({ push }),
}));

const options = () => screen.getAllByRole('option');
const selectedOption = () => options().find(option => option.getAttribute('aria-selected') === 'true');
/** The sliding selection highlight: the listbox's one decorative child. */
const highlight = () => screen.getByRole('listbox').querySelector('[aria-hidden="true"]');

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
        localStorage.clear();
        setPreference('singleKeyShortcuts', true);
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

        expect(options()).toHaveLength(4);
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

    it('should open the contact form from its command', async () => {
        const user = userEvent.setup();

        await mount();
        await user.type(screen.getByRole('combobox'), 'contact form');
        await user.keyboard('{Enter}');

        await waitFor(() => {
            expect(push).toHaveBeenCalledWith('/contact');
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

    // Touch has no Escape key, so the keycap in the search row is a real button.
    it('should close from the esc button in the search row', async () => {
        const user = userEvent.setup();

        await mount();
        await user.click(screen.getByRole('button', { name: 'Close command menu' }));

        expect(onClose).toHaveBeenCalled();
    });

    describe('the ? key', () => {
        it('should open the shortcuts list from an empty search, as the footer says', async () => {
            const user = userEvent.setup();

            await mount();
            await user.keyboard('?');

            expect(onOpenShortcuts).toHaveBeenCalledOnce();
            expect(screen.getByRole('combobox')).toHaveValue('');
        });

        it('should type a ? once the query has text', async () => {
            const user = userEvent.setup();

            await mount();
            await user.type(screen.getByRole('combobox'), 'a?');

            expect(onOpenShortcuts).not.toHaveBeenCalled();
            expect(screen.getByRole('combobox')).toHaveValue('a?');
        });

        it('should stay a character, and drop its hint, while single-key shortcuts are off', async () => {
            const user = userEvent.setup();

            setPreference('singleKeyShortcuts', false);
            await mount();

            expect(screen.queryByText('?', { selector: 'kbd' })).not.toBeInTheDocument();

            await user.keyboard('?');

            expect(onOpenShortcuts).not.toHaveBeenCalled();
            expect(screen.getByRole('combobox')).toHaveValue('?');
        });

        it('should show its hint while single-key shortcuts are on', async () => {
            await mount();

            expect(screen.getByText('?', { selector: 'kbd' })).toBeInTheDocument();
        });
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

    it('should slide the highlight when the arrows move the selection', async () => {
        const user = userEvent.setup();

        await mount();

        expect(highlight()).not.toHaveClass(styles.live);

        await user.keyboard('{ArrowDown}');

        expect(highlight()).toHaveClass(styles.live);
    });

    it('should place the highlight on the first row without sliding when it reopens', async () => {
        const user = userEvent.setup();
        const view = await mount();

        await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');
        view.rerender(<CommandPalette open={false} onClose={onClose} onOpenShortcuts={onOpenShortcuts} />);
        view.rerender(<CommandPalette open onClose={onClose} onOpenShortcuts={onOpenShortcuts} />);

        await waitFor(() => {
            expect(selectedOption()).toHaveTextContent('Work');
        });
        expect(highlight()).not.toHaveClass(styles.live);
    });

    describe('measuring the rows', () => {
        const ROW_HEIGHT = 40;
        let restoreOffsets: () => void;

        /**
         * Rows have a size only while their dialog is open, as in a browser,
         * where a closed `<dialog>` is `display: none` and every offset is 0.
         * Each option sits one row below the last.
         */
        beforeEach(() => {
            const top = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetTop');
            const height = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');
            const shown = (element: HTMLElement) => element.closest('dialog')?.open === true;

            Object.defineProperty(HTMLElement.prototype, 'offsetTop', {
                configurable: true,
                get(this: HTMLElement) {
                    return shown(this) ? options().indexOf(this) * ROW_HEIGHT : 0;
                },
            });
            Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
                configurable: true,
                get(this: HTMLElement) {
                    return shown(this) ? ROW_HEIGHT : 0;
                },
            });
            restoreOffsets = () => {
                if (top && height) {
                    Object.defineProperty(HTMLElement.prototype, 'offsetTop', top);
                    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', height);
                }
            };
        });

        afterEach(() => {
            restoreOffsets();
        });

        const placement = () => {
            const style = highlight() instanceof HTMLElement ? (highlight() as HTMLElement).style : null;

            return { y: style?.getPropertyValue('--y'), height: style?.height };
        };

        it('should size the highlight to the first row as soon as it opens, not after the first key', async () => {
            await mount();

            expect(placement()).toEqual({ y: '0px', height: `${ROW_HEIGHT}px` });
            expect(highlight()).not.toHaveClass(styles.live);
        });

        it('should size the highlight to the first row again on reopen', async () => {
            const user = userEvent.setup();
            const view = await mount();

            await user.keyboard('{ArrowDown}{ArrowDown}');
            expect(placement()).toEqual({ y: `${2 * ROW_HEIGHT}px`, height: `${ROW_HEIGHT}px` });

            view.rerender(<CommandPalette open={false} onClose={onClose} onOpenShortcuts={onOpenShortcuts} />);
            view.rerender(<CommandPalette open onClose={onClose} onOpenShortcuts={onOpenShortcuts} />);

            await waitFor(() => {
                expect(screen.getByRole('combobox')).toHaveFocus();
            });
            expect(placement()).toEqual({ y: '0px', height: `${ROW_HEIGHT}px` });
            expect(highlight()).not.toHaveClass(styles.live);
        });
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
