/**
 * Cookie preferences dialog.
 *
 * A native modal `<dialog>` over a blurred scrim: `showModal()` makes the page
 * behind inert and moves focus in, Escape and the scrim cancel, and focus
 * returns where it came from. The decisions themselves are still
 * `ConsentContext`'s — this only collects them.
 */

'use client';

import { type FC, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { consentCopy } from '@/config/consent';
import type { ConsentState } from '@/lib/consentStorage';
import { localizedPath } from '@/lib/i18n/paths';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { useConsent } from './ConsentContext';
import { ConsentCategoryRow } from './ConsentCategoryRow';
import { consentCategoriesFor } from './consentCategories';
import styles from './ConsentPreferencesModal.module.css';

interface Props {
    onClose: () => void;
    onSave: () => void;
}

export const ConsentPreferencesModal: FC<Props> = ({ onClose, onSave }) => {
    const locale = useLocale();
    const copy = consentCopy[locale];
    const { consent, updateConsent } = useConsent();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    const [shown, setShown] = useState(false);
    const [analytics, setAnalytics] = useState(consent?.analytics ?? false);

    // Modal for exactly as long as it is mounted. The panel opens in its
    // closed state and gains `shown` on the next frame, since a transition
    // cannot run from a state the browser never painted.
    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) {
            return;
        }

        const restore = document.activeElement;

        if (!dialog.open) {
            dialog.showModal();
        }

        closeRef.current?.focus({ preventScroll: true });

        const frame = requestAnimationFrame(() => {
            setShown(true);
        });

        return () => {
            cancelAnimationFrame(frame);

            if (dialog.open) {
                dialog.close();
            }

            // Dismissing the banner removes the button that opened the
            // dialog, so focus only goes back to an opener that still exists.
            if (restore instanceof HTMLElement && restore.isConnected) {
                restore.focus({ preventScroll: true });
            }
        };
    }, []);

    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) {
            return;
        }

        const handleCancel = (event: Event) => {
            event.preventDefault();
            onClose();
        };

        // A browser may close the dialog itself on a repeated Escape it will
        // not let the page cancel; the provider still has to hear about it.
        const handleClose = () => {
            if (!dialog.open) {
                onClose();
            }
        };

        dialog.addEventListener('cancel', handleCancel);
        dialog.addEventListener('close', handleClose);

        return () => {
            dialog.removeEventListener('cancel', handleCancel);
            dialog.removeEventListener('close', handleClose);
        };
    }, [onClose]);

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

    return (
        <dialog
            className={shown ? `${styles.root} ${styles.shown}` : styles.root}
            ref={dialogRef}
            aria-labelledby="consent-dialog-title"
        >
            <div className={styles.scrim} onClick={onClose} aria-hidden="true" />
            <div className={styles.panel}>
                <div className={styles.head}>
                    <h2 className={styles.title} id="consent-dialog-title">{copy.title}</h2>
                    <button
                        className={styles.close}
                        ref={closeRef}
                        type="button"
                        aria-label={copy.dialog.close}
                        onClick={onClose}
                    >
                        <kbd>esc</kbd>
                    </button>
                </div>

                <div className={styles.body}>
                    <p className={styles.intro}>
                        {copy.dialog.intro}
                    </p>
                    <ul className={styles.list}>
                        {consentCategoriesFor(locale).map(category => (
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
                    <Link className={styles.policy} href={localizedPath(locale, '/privacy')}>{copy.privacyLink}</Link>
                    <div className={styles.actions}>
                        <button className="btn" type="button" onClick={onClose}>
                            <span className="btn__label">{copy.dialog.cancel}</span>
                        </button>
                        <button className="btn btn--primary" type="button" onClick={handleSave}>
                            <span className="btn__label">{copy.dialog.save}</span>
                        </button>
                    </div>
                </div>
            </div>
        </dialog>
    );
};
