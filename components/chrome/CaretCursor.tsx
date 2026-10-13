'use client';

import { type FC, useEffect, useRef } from 'react';
import { useFinePointer, useMediaQuery, useReducedMotion } from '@/lib/motion';
import { type CaretCursor as Cursor, type CaretCursorParts, createCaretCursor } from './caretCursorEngine';
import { usePreference } from './preferences';
import styles from './CaretCursor.module.css';

interface Props {
    /** An overlay opening or closing changes what sits under a still pointer. */
    overlayOpen: boolean;
}

/** Visitors who set their OS to its own colours or to more contrast keep its cursor. */
const FORCED_COLORS_QUERY = '(forced-colors: active)';
const MORE_CONTRAST_QUERY = '(prefers-contrast: more)';

/**
 * The page's cursor.
 *
 * Mounts only for a pointer that can actually hover, and never under reduced
 * motion — a per-frame cursor is exactly the kind of thing that preference is
 * asking for less of. It also stands down in forced-colors and high-contrast
 * modes, whose cursor is part of what the visitor configured, and when the
 * visitor has switched it off from the command menu. Nothing renders in those
 * cases, so the OS cursor keeps working untouched.
 */
export const CaretCursor: FC<Props> = ({ overlayOpen }) => {
    const fine = useFinePointer();
    const reduced = useReducedMotion();
    const forcedColors = useMediaQuery(FORCED_COLORS_QUERY);
    const moreContrast = useMediaQuery(MORE_CONTRAST_QUERY);
    const wanted = usePreference('caretCursor');
    const enabled = fine && !reduced && !forcedColors && !moreContrast && wanted;

    const rootRef = useRef<HTMLDivElement>(null);
    const fillRef = useRef<HTMLElement>(null);
    const barARef = useRef<HTMLElement>(null);
    const barBRef = useRef<HTMLElement>(null);
    const dotARef = useRef<HTMLElement>(null);
    const dotBRef = useRef<HTMLElement>(null);
    const serifTopRef = useRef<HTMLElement>(null);
    const serifBottomRef = useRef<HTMLElement>(null);
    const cursorRef = useRef<Cursor | null>(null);

    useEffect(() => {
        const parts: PartRefs = {
            root: rootRef.current,
            fill: fillRef.current,
            barA: barARef.current,
            barB: barBRef.current,
            dotA: dotARef.current,
            dotB: dotBRef.current,
            serifTop: serifTopRef.current,
            serifBottom: serifBottomRef.current,
        };

        if (!isComplete(parts)) {
            return;
        }

        const cursor = createCaretCursor(parts, {
            hasCursor: styles.hasCursor,
            visible: styles.visible,
            native: styles.native,
            select: styles.select,
            ibeam: styles.ibeam,
            idle: styles.idle,
        });

        cursorRef.current = cursor;

        return () => {
            cursorRef.current = null;
            cursor.destroy();
        };
    }, [enabled]);

    useEffect(() => {
        // After the frame the overlay actually appeared or left in.
        const frame = requestAnimationFrame(() => {
            cursorRef.current?.refresh();
        });

        return () => {
            cancelAnimationFrame(frame);
        };
    }, [overlayOpen]);

    if (!enabled) {
        return null;
    }

    return (
        <div className={styles.cursor} ref={rootRef} aria-hidden="true">
            <i className={styles.fill} ref={fillRef} />
            <i className={`${styles.bar} ${styles.lead}`} ref={barARef} />
            <i className={styles.bar} ref={barBRef} />
            <i className={styles.dot} ref={dotARef} />
            <i className={styles.dot} ref={dotBRef} />
            <i className={styles.serif} ref={serifTopRef} />
            <i className={styles.serif} ref={serifBottomRef} />
        </div>
    );
};

type PartRefs = { [K in keyof CaretCursorParts]: HTMLElement | null };

/** Narrows the whole ref bag in one check, so the engine takes no nullable nodes. */
const isComplete = (parts: PartRefs): parts is CaretCursorParts =>
    Object.values(parts).every(part => part !== null);
