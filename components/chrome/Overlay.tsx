'use client';

import { type FC, type ReactNode, type RefObject, useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/motion';
import styles from './Overlay.module.css';

/** Matches the panel's exit transition, so the node is hidden after it fades. */
const EXIT_MS = 200;

/** Dialogs this component closed itself, whose `close` event is not news. */
const closedHere = new WeakSet<HTMLDialogElement>();

interface Props {
    open: boolean;
    /** Accessible name. Use `labelledBy` instead when a visible title exists. */
    label?: string;
    labelledBy?: string;
    /** Extra class on the panel, for overlays that want a different width. */
    panelClassName?: string;
    /** Focused on open. */
    focusRef: RefObject<HTMLElement | null>;
    onClose: () => void;
    /** Keys pressed anywhere inside the overlay, after Escape is handled. */
    onKeyDown?: (event: KeyboardEvent) => void;
    children: ReactNode;
}

/**
 * A modal overlay with the design's two-stage open, on a native `<dialog>`.
 *
 * `showModal()` is what makes it modal: the page behind is inert, so Tab, the
 * virtual cursor and pointer clicks cannot reach it, and Escape arrives as the
 * dialog's `cancel` event. The open state is still owned by the parent, so
 * Escape asks it to close rather than closing the dialog behind its back.
 *
 * The dialog opens without the `open` class and gains it on the next frame,
 * because a transition cannot run from a state the browser never painted.
 * Closing runs in reverse: the dialog leaves the top layer straight away, so
 * focus can go back to wherever it came from, and stays painted under an
 * inert `closing` class until the exit has played.
 */
export const Overlay: FC<Props> = ({ open, label, labelledBy, panelClassName, focusRef, onClose, onKeyDown, children }) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;

        if (!open || !dialog) {
            return;
        }

        const restore = document.activeElement;

        dialog.inert = false;
        dialog.classList.remove(styles.closing);

        if (!dialog.open) {
            dialog.showModal();
        }

        focusRef.current?.focus({ preventScroll: true });

        const frame = requestAnimationFrame(() => {
            dialog.classList.add(styles.open);
        });

        return () => {
            cancelAnimationFrame(frame);
            closeDialog(dialog);
            restoreFocus(dialog, restore);
        };
    }, [open, focusRef]);

    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) {
            return;
        }

        const handleCancel = (event: Event) => {
            event.preventDefault();
            onClose();
        };

        // A browser may still close the dialog itself, e.g. on a repeated
        // Escape it refuses to let the page cancel. The parent has to hear
        // about it, or it would think the overlay is still up.
        const handleClose = () => {
            if (closedHere.delete(dialog)) {
                return;
            }

            if (!dialog.open) {
                onClose();
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            onKeyDown?.(event);
        };

        dialog.addEventListener('cancel', handleCancel);
        dialog.addEventListener('close', handleClose);
        dialog.addEventListener('keydown', handleKeyDown);

        return () => {
            dialog.removeEventListener('cancel', handleCancel);
            dialog.removeEventListener('close', handleClose);
            dialog.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose, onKeyDown]);

    return (
        <dialog className={styles.root} ref={dialogRef} aria-label={label} aria-labelledby={labelledBy}>
            <div className={styles.scrim} onClick={onClose} aria-hidden="true" />
            <div className={panelClassName ? `${styles.panel} ${panelClassName}` : styles.panel}>
                {children}
            </div>
        </dialog>
    );
};

const closeDialog = (dialog: HTMLDialogElement) => {
    dialog.classList.remove(styles.open);

    if (dialog.open) {
        closedHere.add(dialog);
        dialog.close();
    }

    if (prefersReducedMotion()) {
        return;
    }

    // Painted but inert while the exit plays: nothing in it can take focus or
    // a click on its way out.
    dialog.inert = true;
    dialog.classList.add(styles.closing);
    window.setTimeout(() => {
        dialog.classList.remove(styles.closing);
    }, EXIT_MS);
};

/**
 * Hands focus back to the element that had it before the overlay opened —
 * unless whatever the overlay ran has already moved it somewhere on purpose.
 */
const restoreFocus = (dialog: HTMLDialogElement, restore: Element | null) => {
    const current = document.activeElement;
    const stranded = current === null || current === document.body || dialog.contains(current);

    if (stranded && restore instanceof HTMLElement && restore.isConnected) {
        restore.focus({ preventScroll: true });
    }
};
