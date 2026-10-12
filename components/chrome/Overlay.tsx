'use client';

import { type FC, type KeyboardEvent, type ReactNode, type RefObject, useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/motion';
import styles from './Overlay.module.css';

/** Matches the panel's exit transition, so the node leaves after it fades. */
const EXIT_MS = 200;

interface Props {
    open: boolean;
    /** Accessible name. Use `labelledBy` instead when a visible title exists. */
    label?: string;
    labelledBy?: string;
    /** Extra class on the panel, for overlays that want a different width. */
    panelClassName?: string;
    /** Focused on open, and where Tab is sent back to while open. */
    focusRef: RefObject<HTMLElement | null>;
    onClose: () => void;
    /** Keys left over after Escape and Tab have been handled. */
    onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
    children: ReactNode;
}

/**
 * A modal overlay with the design's two-stage open.
 *
 * The node mounts first and only gains `open` on the next frame, because a
 * transition cannot run from a state the browser never painted. Closing runs
 * in reverse: the class comes off, focus goes back to wherever it came from,
 * and the node unmounts once the exit has played.
 */
export const Overlay: FC<Props> = ({ open, label, labelledBy, panelClassName, focusRef, onClose, onKeyDown, children }) => {
    const [mounted, setMounted] = useState(false);
    const [shown, setShown] = useState(false);
    const restoreRef = useRef<Element | null>(null);

    useEffect(() => {
        if (open) {
            restoreRef.current = document.activeElement;
            setMounted(true);

            return;
        }

        setShown(false);

        const previous = restoreRef.current;

        restoreRef.current = null;

        if (previous instanceof HTMLElement) {
            previous.focus({ preventScroll: true });
        }

        const timer = window.setTimeout(() => {
            setMounted(false);
        }, prefersReducedMotion() ? 0 : EXIT_MS);

        return () => {
            window.clearTimeout(timer);
        };
    }, [open]);

    // Deliberately a second effect keyed on `mounted`: the panel and whatever
    // it focuses only exist after that render commits, and a frame callback
    // fired from the first effect can beat React to it.
    useEffect(() => {
        if (!open || !mounted) {
            return;
        }

        focusRef.current?.focus({ preventScroll: true });

        const frame = requestAnimationFrame(() => {
            setShown(true);
        });

        return () => {
            cancelAnimationFrame(frame);
        };
    }, [open, mounted, focusRef]);

    if (!mounted) {
        return null;
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            onClose();

            return;
        }

        // The overlay is modal, so Tab cycles back to its own entry point
        // rather than walking the page behind the scrim.
        if (event.key === 'Tab') {
            event.preventDefault();
            focusRef.current?.focus({ preventScroll: true });

            return;
        }

        onKeyDown?.(event);
    };

    return (
        <div
            className={shown ? `${styles.root} ${styles.open}` : styles.root}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            aria-labelledby={labelledBy}
            onKeyDown={handleKeyDown}
        >
            <div className={styles.scrim} onClick={onClose} aria-hidden="true" />
            <div className={panelClassName ? `${styles.panel} ${panelClassName}` : styles.panel}>
                {children}
            </div>
        </div>
    );
};
