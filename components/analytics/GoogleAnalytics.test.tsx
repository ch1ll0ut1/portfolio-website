/**
 * Tests for loading gtag.js behind consent.
 *
 * `next/script` is replaced by an inert stand-in that records the `src` it
 * was given, so the test can see whether the script would be requested at
 * all. It is not a `<script>`: React warns about those on the client, and
 * the real `next/script` injects its tag outside React's tree anyway.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type FC } from 'react';
import { CONSENT_KEY, CONSENT_VERSION } from '@/lib/consentStorage';
import { ConsentProvider } from '@/components/consent/ConsentContext';
import { CookieConsent } from '@/components/consent/CookieConsent';
import { GoogleAnalytics } from './GoogleAnalytics';

vi.mock('next/script', () => {
    const FakeScript: FC<{ src: string }> = ({ src }) => <span hidden data-testid="gtag-script" data-src={src} />;

    return { default: FakeScript };
});

const MEASUREMENT_ID = 'G-TEST123';

const renderWithConsent = () => render(
    <ConsentProvider>
        <CookieConsent />
        <GoogleAnalytics />
    </ConsentProvider>,
);

/** The `gtag` calls queued for gtag.js, as plain arrays. */
const queuedCalls = () => (window.dataLayer ?? []).map(entry => Array.from(entry as ArrayLike<unknown>));

const storeChoice = (analytics: boolean) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ version: CONSENT_VERSION, consent: { analytics, essential: true } }));
};

describe('<GoogleAnalytics>', () => {
    beforeEach(() => {
        vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', MEASUREMENT_ID);
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        localStorage.clear();
        window.gtag = undefined;
        window.dataLayer = undefined;
    });

    it('should request no script before a choice is made', async () => {
        // Act
        renderWithConsent();
        await screen.findByRole('button', { name: 'Accept all' });

        // Assert
        expect(screen.queryByTestId('gtag-script')).not.toBeInTheDocument();
        expect(window.gtag).toBeUndefined();
    });

    it('should request no script when analytics was rejected', async () => {
        // Arrange
        storeChoice(false);

        // Act
        renderWithConsent();

        // Assert
        await waitFor(() => {
            expect(screen.queryByRole('button', { name: 'Accept all' })).not.toBeInTheDocument();
        });
        expect(screen.queryByTestId('gtag-script')).not.toBeInTheDocument();
    });

    it('should load the script once analytics is accepted', async () => {
        // Arrange
        const user = userEvent.setup();

        renderWithConsent();

        // Act
        await user.click(await screen.findByRole('button', { name: 'Accept all' }));

        // Assert
        expect(screen.getByTestId('gtag-script'))
            .toHaveAttribute('data-src', `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`);
        expect(queuedCalls()).toContainEqual(['config', MEASUREMENT_ID, expect.any(Object)]);
    });

    it('should load the script after hydration for a returning visitor who consented', async () => {
        // Arrange
        storeChoice(true);

        // Act
        renderWithConsent();

        // Assert
        expect(await screen.findByTestId('gtag-script')).toBeInTheDocument();
    });

    it('should load nothing when no measurement id is configured', async () => {
        // Arrange
        vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', '');
        storeChoice(true);

        // Act
        renderWithConsent();

        // Assert
        await waitFor(() => {
            expect(screen.queryByRole('button', { name: 'Accept all' })).not.toBeInTheDocument();
        });
        expect(screen.queryByTestId('gtag-script')).not.toBeInTheDocument();
    });
});
