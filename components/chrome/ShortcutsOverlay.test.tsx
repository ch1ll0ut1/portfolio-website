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
    });

    afterEach(() => {
        restoreMedia();
    });

    it('should be a modal dialog named by its visible title', async () => {
        await mount();

        const dialog = screen.getByRole('dialog');

        expect(dialog).toHaveAttribute('aria-modal', 'true');
        expect(dialog).toHaveAccessibleName('Keyboard shortcuts');
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

    it('should keep Tab inside the overlay', async () => {
        const user = userEvent.setup();

        await mount();
        await user.tab();

        expect(screen.getByRole('button', { name: 'Close shortcuts' })).toHaveFocus();
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
