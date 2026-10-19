/**
 * Tests for the consent banner's server render and its hydration.
 *
 * The server cannot read the stored choice, so it renders the banner for
 * everyone, marked pending; the boot script hides it before paint for a
 * returning visitor (see `lib/bootScript.test.ts`). These cases check that
 * the client then agrees with that HTML without a mismatch, and settles on
 * the right banner once it has read storage itself.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { CONSENT_KEY, CONSENT_VERSION } from '@/lib/consentStorage';
import { ConsentProvider } from './ConsentContext';
import { CookieConsent } from './CookieConsent';
import styles from './CookieConsent.module.css';

const tree = (
    <ConsentProvider>
        <main id="main" tabIndex={-1}>Page</main>
        <CookieConsent />
    </ConsentProvider>
);

const banner = () => document.querySelector('section[aria-labelledby="consent-banner-title"]');

/** Puts the server HTML in the document and hydrates it, as the browser would. */
const hydrateServerHtml = () => {
    const container = document.createElement('div');

    container.innerHTML = renderToString(tree);
    document.body.appendChild(container);

    return render(tree, { container, hydrate: true });
};

describe('<CookieConsent> server render', () => {
    beforeEach(() => {
        localStorage.clear();
        window.gtag = vi.fn();
    });

    afterEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
        window.gtag = undefined;
        document.body.innerHTML = '';
    });

    it('should put the banner in the server HTML, pending until storage is read', () => {
        const container = document.createElement('div');

        container.innerHTML = renderToString(tree);

        const section = container.querySelector('section');

        expect(section).not.toBeNull();
        expect(section).toHaveClass(styles.pending);
        expect(section).toHaveTextContent('Accept all');
    });

    it('should keep the banner for a first visit and drop the pending mark', async () => {
        const errors = vi.spyOn(console, 'error');

        hydrateServerHtml();

        await waitFor(() => {
            expect(banner()).not.toHaveClass(styles.pending);
        });
        expect(screen.getByRole('button', { name: 'Accept all' })).toBeInTheDocument();
        expect(errors).not.toHaveBeenCalled();
    });

    it('should remove the banner for a returning visitor without a mismatch or a focus move', async () => {
        localStorage.setItem(CONSENT_KEY, JSON.stringify({ version: CONSENT_VERSION, consent: { analytics: false, essential: true } }));
        const errors = vi.spyOn(console, 'error');

        hydrateServerHtml();

        await waitFor(() => {
            expect(banner()).toBeNull();
        });
        expect(errors).not.toHaveBeenCalled();
        expect(document.body).toHaveFocus();
        expect(document.documentElement.style.getPropertyValue('--fixed-bottom')).toBe('');
    });
});
