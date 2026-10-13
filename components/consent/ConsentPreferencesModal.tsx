/**
 * Cookie preferences dialog.
 *
 * A modal dialog over a blurred scrim: focus enters on open, Tab stays inside,
 * Escape and the scrim cancel, and focus returns where it came from. The
 * decisions themselves are still `ConsentContext`'s — this only collects them.
 */

'use client';

import { type FC, type KeyboardEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { ConsentState } from '@/lib/consentStorage';
import { useConsent } from './ConsentContext';
import { ConsentCategoryRow } from './ConsentCategoryRow';
import { consentCategories } from './consentCategories';
import { useFocusTrap } from './useFocusTrap';
import styles from './ConsentPreferencesModal.module.css';

interface Props {
    onClose: () => void;
    onSave: () => void;
}

export const ConsentPreferencesModal: FC<Props> = ({ onClose, onSave }) => {
    const { consent, updateConsent } = useConsent();
    const panelRef = useRef<HTMLDivElement>(null);
    const [shown, setShown] = useState(false);
    const [analytics, setAnalytics] = useState(consent?.analytics ?? false);

    useFocusTrap(panelRef);

    // The panel mounts in its closed state and opens on the next frame, since a
    // transition cannot run from a state the browser never painted.
    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            setShown(true);
        });

        return () => {
            cancelAnimationFrame(frame);
        };
    }, []);

    // Essential is locked, so analytics is the only switch there is.
    const handleToggle = (type: keyof ConsentState) => {
        if (type === 'analytics') {
            setAnalytics(previous => !previous);
        }
    };

    const handleSave = () => {
        updateConsent({ analytics });
        onSave();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            onClose();
        }
    };

    return (
        <div
            className={shown ? `${styles.root} ${styles.shown}` : styles.root}
            role="dialog"
            aria-modal="true"
            aria-labelledby="consent-dialog-title"
            onKeyDown={handleKeyDown}
        >
            <div className={styles.scrim} onClick={onClose} aria-hidden="true" />
            <div className={styles.panel} ref={panelRef}>
                <div className={styles.head}>
                    <h2 className={styles.title} id="consent-dialog-title">Cookie preferences</h2>
                    <button
                        className={styles.close}
                        type="button"
                        aria-label="Close cookie preferences"
                        onClick={onClose}
                    >
                        <kbd>esc</kbd>
                    </button>
                </div>

                <div className={styles.body}>
                    <p className={styles.intro}>
                        Switch each kind of cookie on or off. Essential cookies stay on, because the site
                        needs them to work.
                    </p>
                    <ul className={styles.list}>
                        {consentCategories.map(category => (
                            <ConsentCategoryRow
                                category={category}
                                checked={category.key === 'essential' || analytics}
                                key={category.key}
                                onToggle={handleToggle}
                            />
                        ))}
                    </ul>
                </div>

                <div className={styles.foot}>
                    <Link className={styles.policy} href="/privacy">Privacy policy</Link>
                    <div className={styles.actions}>
                        <button className="btn" type="button" onClick={onClose}>
                            <span className="btn__label">Cancel</span>
                        </button>
                        <button className="btn btn--primary" type="button" onClick={handleSave}>
                            <span className="btn__label">Save preferences</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
