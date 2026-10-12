'use client';

import { type FC, useEffect, useRef, useState } from 'react';
import { copyText } from '@/lib/motion';
import styles from './CopyEmail.module.css';

export const CONTACT_EMAIL = 'hello@example.com';

const COPIED_MESSAGE = 'Email copied to clipboard';
const FAILED_MESSAGE = 'Could not copy. Select the address to copy it manually.';
/** How long the confirmation holds before it starts fading. */
const HOLD_MS = 1700;
/** When the pill returns to its resting state. */
const RESET_MS = 2300;

type Phase = 'idle' | 'copied' | 'fading';

/**
 * The email pill with a copy button.
 *
 * A successful copy selects the address the way an editor selection would, and
 * the button morphs into a drawn checkmark before both reset. The confirmation
 * is announced through a polite live region, so it works without the animation
 * — which is what happens under reduced motion, where the sweep and the morph
 * collapse into a cross-fade but the announcement is unchanged.
 */
export const CopyEmail: FC = () => {
    const [phase, setPhase] = useState<Phase>('idle');
    const [status, setStatus] = useState('');
    const timers = useRef<number[]>([]);

    const clearTimers = () => {
        for (const timer of timers.current) {
            window.clearTimeout(timer);
        }

        timers.current = [];
    };

    useEffect(() => clearTimers, []);

    const handleCopy = async () => {
        // The pill and its live region are the confirmation, so the global
        // toast is suppressed rather than firing alongside them.
        const copied = await copyText(CONTACT_EMAIL, { silent: true });

        clearTimers();

        if (!copied) {
            setPhase('idle');
            setStatus(FAILED_MESSAGE);

            return;
        }

        setPhase('copied');
        setStatus(COPIED_MESSAGE);
        timers.current.push(window.setTimeout(() => {
            setPhase('fading');
        }, HOLD_MS));
        timers.current.push(window.setTimeout(() => {
            setPhase('idle');
            setStatus('');
        }, RESET_MS));
    };

    // The fading phase keeps the copied state and layers the fade on top, so
    // the selection shrinks away instead of snapping off.
    const phaseClasses = [
        styles.email,
        phase === 'idle' ? '' : styles.isCopied,
        phase === 'fading' ? styles.isFading : '',
    ].filter(Boolean).join(' ');

    return (
        <div className={phaseClasses}>
            <span className={styles.addr}>{CONTACT_EMAIL}</span>
            <button
                className={styles.copy}
                type="button"
                onClick={() => {
                    void handleCopy();
                }}
            >
                <span className={styles.swap}>
                    <span className={styles.swapA}>
                        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                            <rect x="5" y="5" width="8.5" height="8.5" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                            <path
                                d="M10.5 3.2V3A1.5 1.5 0 0 0 9 1.5H4A1.5 1.5 0 0 0 2.5 3v5A1.5 1.5 0 0 0 4 9.5h.3"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                            />
                        </svg>
                        Copy email
                    </span>
                    <span className={styles.swapB} aria-hidden="true">
                        <svg className={styles.check} viewBox="0 0 16 16" width="14" height="14">
                            <path
                                d="M3 8.5 6.5 12 13 4.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Copied
                    </span>
                </span>
            </button>
            <span className="visually-hidden" role="status" aria-live="polite">{status}</span>
        </div>
    );
};
