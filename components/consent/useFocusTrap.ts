/**
 * Keeps keyboard focus inside a container for as long as it is mounted.
 *
 * Focus moves to the container's first focusable element on mount and returns
 * to whatever held it before, provided that element is still in the document —
 * dismissing the consent banner removes the button that opened the dialog.
 */

'use client';

import { useEffect, type RefObject } from 'react';

const FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(', ');

export const useFocusTrap = (ref: RefObject<HTMLElement | null>) => {
    useEffect(() => {
        const container = ref.current;

        if (!container) {
            return;
        }

        const restore = document.activeElement;
        const entry = focusableWithin(container);

        if (entry.length > 0) {
            entry[0].focus({ preventScroll: true });
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Tab') {
                return;
            }

            const items = focusableWithin(container);

            if (items.length === 0) {
                event.preventDefault();

                return;
            }

            const first = items[0];
            const last = items[items.length - 1];
            const active = document.activeElement;
            const atEdge = event.shiftKey ? active === first : active === last;

            if (atEdge || !container.contains(active)) {
                event.preventDefault();
                (event.shiftKey ? last : first).focus({ preventScroll: true });
            }
        };

        // Capture, so the wrap happens even if something inside stops the event.
        document.addEventListener('keydown', handleKeyDown, true);

        return () => {
            document.removeEventListener('keydown', handleKeyDown, true);

            if (restore instanceof HTMLElement && document.contains(restore)) {
                restore.focus({ preventScroll: true });
            }
        };
    }, [ref]);
};

const focusableWithin = (container: HTMLElement) => Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));
