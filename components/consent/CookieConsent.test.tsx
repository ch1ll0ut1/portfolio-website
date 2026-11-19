/**
 * Tests for the consent banner and the consent flow behind it.
 *
 * The banner is where a visitor records a choice, so the cases below check
 * what each action persists, what it tells Google Analytics, and how the flow
 * copes with storage that is missing, stale, corrupt or unusable — behaviour,
 * never styling.
 */

import { type Mock, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CONSENT_KEY, CONSENT_VERSION } from '@/lib/consentStorage';
import { ConsentProvider, requestConsentPreferences } from './ConsentContext';
import { CookieConsent } from './CookieConsent';

const MEASUREMENT_ID = 'G-TEST123';

const storedConsent = (): unknown => {
    const raw = localStorage.getItem(CONSENT_KEY);

    if (raw === null) return null;

    const parsed: unknown = JSON.parse(raw);

    return typeof parsed === 'object' && parsed !== null && 'consent' in parsed ? parsed.consent : null;
};

const storeChoice = (analytics: boolean, version = CONSENT_VERSION) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ version, consent: { analytics, essential: true } }));
};

const renderConsent = () => render(
    <ConsentProvider>
        <CookieConsent />
    </ConsentProvider>,
);

/** Renders and waits until the provider has read storage and shown the banner. */
const mountWithBanner = async () => {
    const view = renderConsent();

    await screen.findByRole('button', { name: 'Accept all' });

    return view;
};

describe('<CookieConsent>', () => {
    let gtag: Mock<(...args: unknown[]) => void>;

    /*
     * The preferences dialog still loads through `next/dynamic` below, but its
     * module is loaded here first: a cold load could outlast `findBy*`'s 1 s
     * on a busy machine, most of all where no banner mounted to prefetch it.
     */
    beforeAll(async () => {
        await import('./ConsentPreferencesModal');
    }, 30_000);

    beforeEach(() => {
        localStorage.clear();
        vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', MEASUREMENT_ID);
        gtag = vi.fn();
        window.gtag = gtag;
    });

    afterEach(() => {
        localStorage.clear();
        vi.unstubAllEnvs();
        vi.restoreAllMocks();
        window.gtag = undefined;
        window[`ga-disable-${MEASUREMENT_ID}`] = undefined;
    });

    describe('first visit', () => {
        it('should show the banner while no choice is stored', async () => {
            await mountWithBanner();

            expect(screen.getByRole('heading', { name: 'Cookie preferences' })).toBeInTheDocument();
        });

        it('should send nothing to Google before a choice is made', async () => {
            await mountWithBanner();

            expect(gtag).not.toHaveBeenCalled();
        });

        it('should grant analytics on accept all and dismiss the banner', async () => {
            const user = userEvent.setup();

            await mountWithBanner();
            await user.click(screen.getByRole('button', { name: 'Accept all' }));

            expect(storedConsent()).toEqual({ analytics: true, essential: true });
            expect(screen.queryByRole('button', { name: 'Accept all' })).not.toBeInTheDocument();
        });

        it('should deny analytics on reject all and dismiss the banner', async () => {
            const user = userEvent.setup();

            await mountWithBanner();
            await user.click(screen.getByRole('button', { name: 'Reject all' }));

            expect(storedConsent()).toEqual({ analytics: false, essential: true });
            expect(screen.queryByRole('button', { name: 'Reject all' })).not.toBeInTheDocument();
        });

        it('should keep focus scrolling clear of the banner until a choice is made', async () => {
            const user = userEvent.setup();
            const inset = () => document.documentElement.style.getPropertyValue('--fixed-bottom');

            vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(183);
            await mountWithBanner();

            expect(inset()).toBe('183px');

            await user.click(screen.getByRole('button', { name: 'Accept all' }));

            expect(inset()).toBe('');
        });

        it('should persist the choice made in the dialog', async () => {
            const user = userEvent.setup();

            await mountWithBanner();
            await user.click(screen.getByRole('button', { name: 'Customize' }));
            await user.click(await screen.findByRole('switch', { name: 'Analytics cookies' }));
            await user.click(screen.getByRole('button', { name: 'Save preferences' }));

            expect(storedConsent()).toEqual({ analytics: true, essential: true });
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
            expect(screen.queryByRole('button', { name: 'Customize' })).not.toBeInTheDocument();
        });

        it('should store nothing when the dialog is cancelled, and keep the banner', async () => {
            const user = userEvent.setup();

            await mountWithBanner();
            await user.click(screen.getByRole('button', { name: 'Customize' }));
            await user.click(await screen.findByRole('button', { name: 'Cancel' }));

            expect(storedConsent()).toBeNull();
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Customize' })).toBeInTheDocument();
        });

        it('should return focus to the customize button when the dialog closes', async () => {
            const user = userEvent.setup();

            await mountWithBanner();

            const customize = screen.getByRole('button', { name: 'Customize' });

            await user.click(customize);
            await waitFor(() => {
                expect(screen.getByRole('button', { name: 'Close cookie preferences' })).toHaveFocus();
            });

            await user.keyboard('{Escape}');

            expect(customize).toHaveFocus();
        });
    });

    describe('stored choice', () => {
        it('should stay hidden once a current choice is stored', async () => {
            storeChoice(true);

            renderConsent();

            await waitFor(() => {
                expect(gtag).toHaveBeenCalled();
            });
            expect(screen.queryByRole('button', { name: 'Accept all' })).not.toBeInTheDocument();
        });

        it('should re-prompt when the stored choice is from an older consent version', async () => {
            localStorage.setItem(CONSENT_KEY, JSON.stringify({
                version: '1.0',
                consent: { analytics: true, marketing: true, preferences: true, essential: true },
            }));

            await mountWithBanner();

            expect(screen.getByRole('button', { name: 'Accept all' })).toBeInTheDocument();
            expect(gtag).not.toHaveBeenCalled();
        });

        it.each([
            ['malformed JSON', '{not json'],
            ['a non-object', '"yes"'],
            ['a missing consent record', JSON.stringify({ version: CONSENT_VERSION })],
            ['a non-boolean analytics flag', JSON.stringify({ version: CONSENT_VERSION, consent: { analytics: 'true' } })],
        ])('should treat %s as no choice and re-prompt', async (_case, raw) => {
            localStorage.setItem(CONSENT_KEY, raw);

            await mountWithBanner();

            expect(gtag).not.toHaveBeenCalled();
        });
    });

    describe('unusable storage', () => {
        it('should show the banner when reading storage throws', async () => {
            vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
                throw new DOMException('denied', 'SecurityError');
            });

            await mountWithBanner();

            expect(screen.getByRole('heading', { name: 'Cookie preferences' })).toBeInTheDocument();
        });

        it('should still apply a choice for this visit when storing it throws', async () => {
            const user = userEvent.setup();

            vi.spyOn(console, 'warn').mockImplementation(() => undefined);
            vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
                throw new DOMException('full', 'QuotaExceededError');
            });

            await mountWithBanner();
            await user.click(screen.getByRole('button', { name: 'Accept all' }));

            expect(screen.queryByRole('button', { name: 'Accept all' })).not.toBeInTheDocument();
            expect(gtag).toHaveBeenCalledWith('consent', 'update', expect.objectContaining({ analytics_storage: 'granted' }));
        });
    });

    describe('Google consent signals', () => {
        it('should grant analytics storage and deny every ad signal on accept all', async () => {
            const user = userEvent.setup();

            await mountWithBanner();
            await user.click(screen.getByRole('button', { name: 'Accept all' }));

            expect(gtag).toHaveBeenCalledWith('consent', 'update', {
                analytics_storage: 'granted',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
            });
            expect(window[`ga-disable-${MEASUREMENT_ID}`]).toBe(false);
        });

        it('should apply a stored grant for a returning visitor', async () => {
            storeChoice(true);

            renderConsent();

            await waitFor(() => {
                expect(gtag).toHaveBeenCalledWith('consent', 'update', expect.objectContaining({ analytics_storage: 'granted' }));
            });
        });

        it('should stop tracking and delete the GA cookies when consent is withdrawn', async () => {
            const user = userEvent.setup();

            storeChoice(true);
            document.cookie = '_ga=GA1.1.1.1; path=/';
            document.cookie = `_ga_${MEASUREMENT_ID.slice(2)}=GS1.1.1; path=/`;
            document.cookie = 'unrelated=keep; path=/';
            renderConsent();

            act(() => {
                requestConsentPreferences();
            });
            await user.click(await screen.findByRole('switch', { name: 'Analytics cookies' }));
            await user.click(screen.getByRole('button', { name: 'Save preferences' }));

            expect(storedConsent()).toEqual({ analytics: false, essential: true });
            expect(gtag).toHaveBeenLastCalledWith('consent', 'update', expect.objectContaining({ analytics_storage: 'denied' }));
            expect(window[`ga-disable-${MEASUREMENT_ID}`]).toBe(true);
            expect(document.cookie).not.toMatch(/_ga/);
            expect(document.cookie).toMatch(/unrelated=keep/);
            document.cookie = 'unrelated=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        });
    });

    describe('reopening preferences', () => {
        it('should reopen the dialog after the banner is gone', async () => {
            storeChoice(false);
            renderConsent();

            act(() => {
                requestConsentPreferences();
            });

            expect(await screen.findByRole('dialog', { name: 'Cookie preferences' })).toBeInTheDocument();
            expect(screen.getByRole('switch', { name: 'Analytics cookies' })).not.toBeChecked();
        });
    });
});
