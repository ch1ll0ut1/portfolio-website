/**
 * Tests for the consent banner.
 *
 * The banner is the only way a visitor records a consent choice, so the cases
 * below check what each action persists and that the banner then goes away —
 * behaviour, never styling.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConsentProvider, type ConsentState } from './ConsentContext';
import { CookieConsent } from './CookieConsent';

const CONSENT_KEY = 'cookie-consent';

const storedConsent = (): ConsentState | null => {
    const raw = localStorage.getItem(CONSENT_KEY);

    if (!raw) return null;

    return (JSON.parse(raw) as { consent: ConsentState }).consent;
};

describe('<CookieConsent>', () => {
    const mount = async () => {
        const view = render(
            <ConsentProvider>
                <CookieConsent />
            </ConsentProvider>,
        );

        await screen.findByRole('button', { name: 'Accept all' });

        return view;
    };

    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('should show the banner while no choice is stored', async () => {
        await mount();

        expect(screen.getByRole('heading', { name: 'Cookie preferences' })).toBeInTheDocument();
    });

    it('should stay hidden once a current choice is stored', () => {
        localStorage.setItem(CONSENT_KEY, JSON.stringify({
            version: '1.0',
            consent: { analytics: true, marketing: false, preferences: false, essential: true },
        }));

        render(
            <ConsentProvider>
                <CookieConsent />
            </ConsentProvider>,
        );

        expect(screen.queryByRole('button', { name: 'Accept all' })).not.toBeInTheDocument();
    });

    it('should re-prompt when the stored choice is from an older consent version', async () => {
        localStorage.setItem(CONSENT_KEY, JSON.stringify({
            version: '0.9',
            consent: { analytics: true, marketing: true, preferences: true, essential: true },
        }));

        await mount();

        expect(screen.getByRole('button', { name: 'Accept all' })).toBeInTheDocument();
    });

    it('should grant every category on accept all and dismiss the banner', async () => {
        const user = userEvent.setup();

        await mount();
        await user.click(screen.getByRole('button', { name: 'Accept all' }));

        expect(storedConsent()).toEqual({ analytics: true, marketing: true, preferences: true, essential: true });
        expect(screen.queryByRole('button', { name: 'Accept all' })).not.toBeInTheDocument();
    });

    it('should deny every non-essential category on reject all and dismiss the banner', async () => {
        const user = userEvent.setup();

        await mount();
        await user.click(screen.getByRole('button', { name: 'Reject all' }));

        expect(storedConsent()).toEqual({ analytics: false, marketing: false, preferences: false, essential: true });
        expect(screen.queryByRole('button', { name: 'Reject all' })).not.toBeInTheDocument();
    });

    it('should persist only the categories switched on in the dialog', async () => {
        const user = userEvent.setup();

        await mount();
        await user.click(screen.getByRole('button', { name: 'Customize' }));
        await user.click(await screen.findByRole('switch', { name: 'Analytics cookies' }));
        await user.click(screen.getByRole('switch', { name: 'Preference cookies' }));
        await user.click(screen.getByRole('button', { name: 'Save preferences' }));

        expect(storedConsent()).toEqual({ analytics: true, marketing: false, preferences: true, essential: true });
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Customize' })).not.toBeInTheDocument();
    });

    it('should store nothing when the dialog is cancelled, and keep the banner', async () => {
        const user = userEvent.setup();

        await mount();
        await user.click(screen.getByRole('button', { name: 'Customize' }));
        await user.click(await screen.findByRole('button', { name: 'Cancel' }));

        expect(storedConsent()).toBeNull();
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Customize' })).toBeInTheDocument();
    });

    it('should return focus to the customize button when the dialog closes', async () => {
        const user = userEvent.setup();

        await mount();

        const customize = screen.getByRole('button', { name: 'Customize' });

        await user.click(customize);
        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Close cookie preferences' })).toHaveFocus();
        });

        await user.keyboard('{Escape}');

        expect(customize).toHaveFocus();
    });
});
