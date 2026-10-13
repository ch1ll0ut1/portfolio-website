/**
 * Tests for the shortcuts overlay.
 *
 * Mostly a11y wiring: it is a modal dialog that must name itself, take focus,
 * hand focus back, and print the right modifier glyph for the platform.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { installMatchMedia } from '../../test/motionEnv';
import { ShortcutsOverlay } from './ShortcutsOverlay';
import { readPreference, setPreference } from './preferences';

describe('<ShortcutsOverlay>', () => {
    let restoreMedia: () => void;
    let onClose: ReturnType<typeof vi.fn>;

    const mount = async () => {
        const view = render(<ShortcutsOverlay open onClose={onClose} />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Close shortcuts' })).toHaveFocus();
        });

        return view;
    };

    beforeEach(() => {
        restoreMedia = installMatchMedia();
        onClose = vi.fn();
        localStorage.clear();
        setPreference('singleKeyShortcuts', true);
    });

    afterEach(() => {
        restoreMedia();
    });

    it('should be a modal dialog named by its visible title', async () => {
        await mount();

        const dialog = screen.getByRole('dialog');

        expect(dialog).toHaveAttribute('open');
        expect(dialog).toHaveAccessibleName('Keyboard shortcuts');
    });

    it('should title the list with a heading', async () => {
        await mount();

        expect(screen.getByRole('heading', { name: 'Keyboard shortcuts' })).toBeInTheDocument();
    });

    it('should offer a switch for the single-key shortcuts, on by default', async () => {
        await mount();

        expect(screen.getByRole('switch', { name: /Single-key shortcuts/ })).toBeChecked();
    });

    it('should switch the single-key shortcuts off and remember it', async () => {
        const user = userEvent.setup();

        await mount();
        await user.click(screen.getByRole('switch', { name: /Single-key shortcuts/ }));

        expect(screen.getByRole('switch', { name: /Single-key shortcuts/ })).not.toBeChecked();
        expect(readPreference('singleKeyShortcuts')).toBe(false);
        expect(localStorage.getItem('sk-single-key-shortcuts')).toBe('off');
    });

    it('should not close on ? while single-key shortcuts are off', async () => {
        const user = userEvent.setup();

        setPreference('singleKeyShortcuts', false);
        await mount();
        await user.keyboard('?');

        expect(onClose).not.toHaveBeenCalled();
    });

    it('should list a row for every section chord', async () => {
        await mount();

        expect(screen.getByText('Go to work')).toBeInTheDocument();
        expect(screen.getByText('Go to writing')).toBeInTheDocument();
        expect(screen.getByText('Back to top')).toBeInTheDocument();
    });

    it('should spell the modifier as Ctrl off an Apple platform', async () => {
        vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 (X11; Linux x86_64)');
        await mount();

        expect(screen.getByText('Ctrl')).toBeInTheDocument();
        expect(screen.queryByText('⌘')).not.toBeInTheDocument();
    });

    it('should spell the modifier as ⌘ on an Apple platform', async () => {
        vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)');
        await mount();

        expect(screen.getByText('⌘')).toBeInTheDocument();
    });

    it('should close on Escape', async () => {
        const user = userEvent.setup();

        await mount();
        await user.keyboard('{Escape}');

        expect(onClose).toHaveBeenCalled();
    });

    it('should close on a second ?', async () => {
        const user = userEvent.setup();

        await mount();
        await user.keyboard('?');

        expect(onClose).toHaveBeenCalled();
    });

    it('should close from the close button', async () => {
        const user = userEvent.setup();

        await mount();
        await user.click(screen.getByRole('button', { name: 'Close shortcuts' }));

        expect(onClose).toHaveBeenCalled();
    });

    it('should restore focus to the element that opened it', async () => {
        const trigger = document.createElement('button');

        document.body.appendChild(trigger);
        trigger.focus();

        const view = render(<ShortcutsOverlay open={false} onClose={onClose} />);

        view.rerender(<ShortcutsOverlay open onClose={onClose} />);
        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Close shortcuts' })).toHaveFocus();
        });

        await act(async () => {
            view.rerender(<ShortcutsOverlay open={false} onClose={onClose} />);
        });

        expect(trigger).toHaveFocus();
        trigger.remove();
    });

    it('should render nothing while closed', () => {
        render(<ShortcutsOverlay open={false} onClose={onClose} />);

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
});
