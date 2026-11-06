/**
 * Cookie consent banner and preferences dialog.
 *
 * Presentation only — every consent decision is taken by `ConsentContext`.
 * The banner is a slim bar docked to the bottom edge, using the global button
 * primitives, so it reads as site chrome in both themes and leaves the hero's
 * calls to action uncovered. It comes before the page's main content in the
 * document, so the keyboard reaches it right after the nav, without focus
 * being moved or trapped. The dialog is
 * rendered here too, but opens independently of the banner, so it can be
 * reopened from the footer or the command palette after the first choice.
 *
 * The banner is part of the server HTML, so a first visit paints it with the
 * page rather than after hydration. The server cannot know the stored choice,
 * so until the client has read it the banner renders `pending`: shown only
 * once the boot script has run (`js` on <html>) and found no stored choice
 * (no `has-consent`), and with no focus or inset bookkeeping of its own, as
 * for a returning visitor it is about to go away unseen.
 */

'use client';

import { type FC, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { consentCopy } from '@/config/consent';
import { localizedPath } from '@/lib/i18n/paths';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { useConsent } from './ConsentContext';
import { useBannerFocusReturn } from './useBannerFocusReturn';
import { useFixedBottomInset } from './useFixedBottomInset';
import styles from './CookieConsent.module.css';

/** Most visitors never open it, so it loads on demand, not with every page. */
const loadPreferences = () => import('./ConsentPreferencesModal').then(module => module.ConsentPreferencesModal);
const ConsentPreferencesModal = dynamic(loadPreferences, { ssr: false });

export const CookieConsent: FC = () => {
    const { consent, showBanner, preferencesOpen, acceptAll, rejectAll, openPreferences, closePreferences } = useConsent();
    /** The stored choice is not read yet: the server render, and hydration. */
    const locale = useLocale();
    const copy = consentCopy[locale];
    const pending = consent === null;
    const bannerRef = useRef<HTMLElement>(null);
    const focus = useBannerFocusReturn(bannerRef, showBanner);

    // Docked over the bottom of the page, so focus scrolling has to stop short of it.
    useFixedBottomInset(bannerRef, showBanner);

    useEffect(() => {
        // A banner on screen offers "Customize", so have the dialog ready.
        if (showBanner) {
            void loadPreferences();
        }
    }, [showBanner]);

    const preferences = preferencesOpen
        ? <ConsentPreferencesModal onClose={closePreferences} onSave={closePreferences} />
        : null;

    if (!showBanner && !pending) {
        return preferences;
    }

    return (
        <>
            <section
                className={pending ? `${styles.root} ${styles.pending}` : styles.root}
                aria-labelledby="consent-banner-title"
                ref={bannerRef}
                onFocus={focus.onFocus}
            >
                <div className={styles.panel}>
                    {/* Names the region for assistive technology; the bar itself
                        stays one line of copy and one row of buttons. */}
                    <h2 className="visually-hidden" id="consent-banner-title">{copy.title}</h2>
                    <p className={styles.body}>
                        {copy.banner.body}
                        {' '}
                        <Link className={styles.link} href={localizedPath(locale, '/privacy')}>{copy.privacyLink}</Link>
                    </p>

                    {/* Reject and accept carry the same weight: neither is the
                        page's primary button. */}
                    <div className={styles.actions}>
                        <button
                            className={styles.customize}
                            type="button"
                            onClick={openPreferences}
                        >
                            {copy.banner.customize}
                        </button>
                        <button
                            className="btn"
                            type="button"
                            onClick={() => {
                                focus.returnFocus();
                                rejectAll();
                            }}
                        >
                            <span className="btn__label">{copy.banner.rejectAll}</span>
                        </button>
                        <button
                            className="btn"
                            type="button"
                            onClick={() => {
                                focus.returnFocus();
                                acceptAll();
                            }}
                        >
                            <span className="btn__label">{copy.banner.acceptAll}</span>
                        </button>
                    </div>
                </div>
            </section>

            {preferences}
        </>
    );
};
