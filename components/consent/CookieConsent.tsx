/**
 * Cookie consent banner and preferences dialog.
 *
 * Presentation only — every consent decision is taken by `ConsentContext`.
 * The banner is a bottom-docked surface panel using the global button
 * primitives, so it reads as site chrome in both themes. The dialog is
 * rendered here too, but opens independently of the banner, so it can be
 * reopened from the footer or the command palette after the first choice.
 */

'use client';

import { type FC, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useConsent } from './ConsentContext';
import { useBannerFocusReturn } from './useBannerFocusReturn';
import { useFixedBottomInset } from './useFixedBottomInset';
import styles from './CookieConsent.module.css';

/** Most visitors never open it, so it loads on demand, not with every page. */
const loadPreferences = () => import('./ConsentPreferencesModal').then(module => module.ConsentPreferencesModal);
const ConsentPreferencesModal = dynamic(loadPreferences, { ssr: false });

export const CookieConsent: FC = () => {
    const { showBanner, preferencesOpen, acceptAll, rejectAll, openPreferences, closePreferences } = useConsent();
    const [shown, setShown] = useState(false);
    const bannerRef = useRef<HTMLElement>(null);
    const focus = useBannerFocusReturn(bannerRef, showBanner);

    // Docked over the bottom of the page, so focus scrolling has to stop short of it.
    useFixedBottomInset(bannerRef, showBanner);

    // The entrance transition cannot run from a state the browser never
    // painted, so the panel gains its visible class on the frame after mount.
    useEffect(() => {
        if (!showBanner) {
            return;
        }

        const frame = requestAnimationFrame(() => {
            setShown(true);
        });

        // A banner on screen offers "Customize", so have the dialog ready.
        void loadPreferences();

        return () => {
            cancelAnimationFrame(frame);
        };
    }, [showBanner]);

    const preferences = preferencesOpen
        ? <ConsentPreferencesModal onClose={closePreferences} onSave={closePreferences} />
        : null;

    if (!showBanner) {
        return preferences;
    }

    return (
        <>
            <section
                className={shown ? `${styles.root} ${styles.shown}` : styles.root}
                aria-labelledby="consent-banner-title"
                ref={bannerRef}
                onFocus={focus.onFocus}
            >
                <div className={styles.panel}>
                    <div>
                        <h2 className={styles.title} id="consent-banner-title">Cookie preferences</h2>
                        <p className={styles.body}>
                            I use cookies to understand how the site is used. Essential cookies are always
                            on; analytics cookies are up to you, and you can change your mind any time
                            under Cookie settings in the footer.
                            {' '}
                            <Link className={styles.link} href="/privacy">Privacy policy</Link>
                        </p>
                    </div>

                    <div className={styles.actions}>
                        <button
                            className="btn"
                            type="button"
                            onClick={openPreferences}
                        >
                            <span className="btn__label">Customize</span>
                        </button>
                        <button
                            className="btn"
                            type="button"
                            onClick={() => {
                                focus.returnFocus();
                                rejectAll();
                            }}
                        >
                            <span className="btn__label">Reject all</span>
                        </button>
                        <button
                            className="btn btn--primary"
                            type="button"
                            onClick={() => {
                                focus.returnFocus();
                                acceptAll();
                            }}
                        >
                            <span className="btn__label">Accept all</span>
                        </button>
                    </div>
                </div>
            </section>

            {preferences}
        </>
    );
};
