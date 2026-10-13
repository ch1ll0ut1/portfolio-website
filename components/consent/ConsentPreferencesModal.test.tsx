/**
 * Tests for the cookie preferences dialog.
 *
 * Mostly a11y wiring: it is a modal dialog that must name itself, take focus,
 * keep Tab inside, and cancel on Escape without saving anything.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type FC } from 'react';
import { CONSENT_VERSION } from '@/lib/consentStorage';
import { ConsentProvider, useConsent } from './ConsentContext';
import { ConsentPreferencesModal } from './ConsentPreferencesModal';

interface HarnessProps {
    onClose: () => void;
    onSave: () => void;
}

/**
 * The dialog opens from the banner, so it never mounts before the provider has
 * read localStorage. The harness reproduces that order.
 */
const Harness: FC<HarnessProps> = ({ onClose, onSave }) => {
    const { consent } = useConsent();

    if (!consent) {
        return null;
    }

    return <ConsentPreferencesModal onClose={onClose} onSave={onSave} />;
};

describe('<ConsentPreferencesModal>', () => {
    let onClose: ReturnType<typeof vi.fn>;
    let onSave: ReturnType<typeof vi.fn>;

    const mount = async () => {
        const view = render(
            <ConsentProvider>
                <Harness onClose={onClose} onSave={onSave} />
            </ConsentProvider>,
        );

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Close cookie preferences' })).toHaveFocus();
        });

        return view;
    };

    beforeEach(() => {
        localStorage.clear();
        onClose = vi.fn();
        onSave = vi.fn();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('should be a modal dialog named by its visible title', async () => {
        await mount();

        const dialog = screen.getByRole('dialog');

        expect(dialog).toHaveAttribute('aria-modal', 'true');
        expect(dialog).toHaveAccessibleName('Cookie preferences');
    });

    it('should offer analytics as the only optional category, off by default', async () => {
        await mount();

        expect(screen.getAllByRole('switch')).toHaveLength(1);
        expect(screen.getByRole('switch', { name: 'Analytics cookies' })).not.toBeChecked();
    });

    it('should describe each switch with its category text', async () => {
        await mount();

        expect(screen.getByRole('switch', { name: 'Analytics cookies' })).toHaveAccessibleDescription(/Google Analytics/);
    });

    it('should not offer a switch for essential cookies', async () => {
        await mount();

        expect(screen.getByRole('heading', { name: 'Essential cookies' })).toBeInTheDocument();
        expect(screen.queryByRole('switch', { name: 'Essential cookies' })).not.toBeInTheDocument();
    });

    it('should start from the consent already stored', async () => {
        localStorage.setItem('cookie-consent', JSON.stringify({
            version: CONSENT_VERSION,
            consent: { analytics: true, essential: true },
        }));

        await mount();

        expect(screen.getByRole('switch', { name: 'Analytics cookies' })).toBeChecked();
    });

    it('should toggle a switch from the keyboard', async () => {
        const user = userEvent.setup();

        await mount();

        const analytics = screen.getByRole('switch', { name: 'Analytics cookies' });

        analytics.focus();
        await user.keyboard(' ');

        expect(analytics).toBeChecked();
    });

    it('should save nothing until the save button is pressed', async () => {
        const user = userEvent.setup();

        await mount();
        await user.click(screen.getByRole('switch', { name: 'Analytics cookies' }));

        expect(localStorage.getItem('cookie-consent')).toBeNull();
        expect(onSave).not.toHaveBeenCalled();

        await user.click(screen.getByRole('button', { name: 'Save preferences' }));

        expect(onSave).toHaveBeenCalled();
    });

    it('should close on Escape without saving', async () => {
        const user = userEvent.setup();

        await mount();
        await user.keyboard('{Escape}');

        expect(onClose).toHaveBeenCalled();
        expect(onSave).not.toHaveBeenCalled();
        expect(localStorage.getItem('cookie-consent')).toBeNull();
    });

    it('should close from the close button and from cancel', async () => {
        const user = userEvent.setup();

        await mount();
        await user.click(screen.getByRole('button', { name: 'Close cookie preferences' }));
        await user.click(screen.getByRole('button', { name: 'Cancel' }));

        expect(onClose).toHaveBeenCalledTimes(2);
    });

    it('should keep Tab inside the dialog', async () => {
        const user = userEvent.setup();
        const outside = document.createElement('button');

        document.body.appendChild(outside);
        await mount();

        const close = screen.getByRole('button', { name: 'Close cookie preferences' });
        const save = screen.getByRole('button', { name: 'Save preferences' });

        save.focus();
        await user.tab();

        expect(close).toHaveFocus();

        await user.tab({ shift: true });

        expect(save).toHaveFocus();
        expect(outside).not.toHaveFocus();
        outside.remove();
    });

    it('should restore focus to the element that opened it', async () => {
        const trigger = document.createElement('button');

        document.body.appendChild(trigger);
        trigger.focus();

        const view = await mount();

        view.unmount();

        expect(trigger).toHaveFocus();
        trigger.remove();
    });
});
