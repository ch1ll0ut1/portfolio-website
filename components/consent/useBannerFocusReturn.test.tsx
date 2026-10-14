/**
 * Tests for where keyboard focus goes when the consent banner is dismissed.
 *
 * Exercised through the banner itself: a choice unmounts the button that made
 * it, and focus must land back on the page rather than on `<body>`.
 */

import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConsentProvider } from './ConsentContext';
import { CookieConsent } from './CookieConsent';

const renderPage = () => render(
    <ConsentProvider>
        <button type="button">Earlier control</button>
        <main id="main" tabIndex={-1}>Page content</main>
        <CookieConsent />
    </ConsentProvider>,
);

describe('consent banner focus return', () => {
    beforeAll(async () => {
        await import('./ConsentPreferencesModal');
    }, 30_000);

    beforeEach(() => {
        localStorage.clear();
        vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
        window.gtag = vi.fn();
    });

    afterEach(() => {
        localStorage.clear();
        vi.unstubAllEnvs();
        window.gtag = undefined;
    });

    it.each(['Reject all', 'Accept all'])('returns focus to where it came from after "%s"', async (name) => {
        const user = userEvent.setup();

        renderPage();
        await screen.findByRole('button', { name });

        const earlier = screen.getByRole('button', { name: 'Earlier control' });

        earlier.focus();
        // Tab past main (not a Tab stop) into the banner.
        await user.tab();
        expect(screen.getByRole('link', { name: 'Privacy policy' })).toHaveFocus();

        await user.click(screen.getByRole('button', { name }));

        expect(screen.queryByRole('button', { name })).not.toBeInTheDocument();
        expect(earlier).toHaveFocus();
    });

    it('falls back to main when the earlier control can no longer take focus', async () => {
        const user = userEvent.setup();

        renderPage();
        await screen.findByRole('button', { name: 'Reject all' });

        const earlier = screen.getByRole('button', { name: 'Earlier control' });

        earlier.focus();
        await user.tab();
        earlier.setAttribute('disabled', '');
        await user.click(screen.getByRole('button', { name: 'Reject all' }));

        expect(screen.getByRole('main')).toHaveFocus();
    });

    it('falls back to main when focus came from outside the page', async () => {
        const user = userEvent.setup();

        renderPage();
        await user.click(await screen.findByRole('button', { name: 'Reject all' }));

        expect(screen.getByRole('main')).toHaveFocus();
    });

    it('returns focus to the page after saving from the dialog the banner opened', async () => {
        const user = userEvent.setup();

        renderPage();
        await user.click(await screen.findByRole('button', { name: 'Customize' }));
        await user.click(await screen.findByRole('button', { name: 'Save preferences' }));

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
        expect(screen.getByRole('main')).toHaveFocus();
    });

    it('leaves focus alone when it is not on the banner', async () => {
        const user = userEvent.setup();

        renderPage();
        const reject = await screen.findByRole('button', { name: 'Reject all' });
        const earlier = screen.getByRole('button', { name: 'Earlier control' });

        earlier.focus();
        // A pointer press that does not move focus, as in Safari.
        await user.pointer({ keys: '[MouseLeft]', target: reject });

        expect(screen.queryByRole('button', { name: 'Reject all' })).not.toBeInTheDocument();
        expect(earlier).toHaveFocus();
    });
});
