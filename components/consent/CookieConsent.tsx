/**
 * Cookie consent banner.
 *
 * Presentation only — every consent decision is taken by `ConsentContext`.
 * The banner is a bottom-docked surface panel using the global button
 * primitives, so it reads as site chrome in both themes.
 */

'use client';

import { type FC, useEffect, useState } from 'react';
import Link from 'next/link';
import { useConsent } from './ConsentContext';
import { ConsentPreferencesModal } from './ConsentPreferencesModal';
import styles from './CookieConsent.module.css';

export const CookieConsent: FC = () => {
    const { showBanner, acceptAll, rejectAll, hideBanner } = useConsent();
    const [showPreferences, setShowPreferences] = useState(false);
    const [shown, setShown] = useState(false);

    // The entrance transition cannot run from a state the browser never
    // painted, so the panel gains its visible class on the frame after mount.
    useEffect(() => {
        if (!showBanner) {
            return;
        }

        const frame = requestAnimationFrame(() => {
            setShown(true);
        });

        return () => {
            cancelAnimationFrame(frame);
        };
    }, [showBanner]);

    if (!showBanner) {
        return null;
    }

    return (
        <>
            <section
                className={shown ? `${styles.root} ${styles.shown}` : styles.root}
                aria-labelledby="consent-banner-title"
            >
                <div className={styles.panel}>
                    <div>
                        <h2 className={styles.title} id="consent-banner-title">Cookie preferences</h2>
                        <p className={styles.body}>
                            I use cookies to understand how the site is used. Essential cookies are always
                            on; analytics, marketing and preference cookies are up to you.
                            {' '}
                            <Link className={styles.link} href="/privacy">Privacy policy</Link>
                        </p>
                    </div>

                    <div className={styles.actions}>
                        <button
                            className="btn"
                            type="button"
                            onClick={() => { setShowPreferences(true); }}
                        >
                            <span className="btn__label">Customize</span>
                        </button>
                        <button className="btn" type="button" onClick={rejectAll}>
                            <span className="btn__label">Reject all</span>
                        </button>
                        <button className="btn btn--primary" type="button" onClick={acceptAll}>
                            <span className="btn__label">Accept all</span>
                        </button>
                    </div>
                </div>
            </section>

            {showPreferences && (
                <ConsentPreferencesModal
                    onClose={() => { setShowPreferences(false); }}
                    onSave={() => {
                        setShowPreferences(false);
                        hideBanner();
                    }}
                />
            )}
        </>
    );
};
