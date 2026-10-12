'use client';

import { type FC, useEffect, useRef, useState } from 'react';
import type { IndexedProject } from '@/config/projectsIndex';
import { lerp, useRaf } from '@/lib/motion';
import styles from './ProjectPreview.module.css';

interface Props {
    /** The hovered project, or null to fade the card out. */
    project: IndexedProject | null;
}

/** Matches the card's width in CSS; used to flip it near the right edge. */
const CARD_WIDTH = 248;
const EDGE_GUTTER = 16;
const CARD_HEIGHT = 170;
const FOLLOW = 0.16;

interface Point {
    x: number;
    y: number;
}

/** Offsets the card from the cursor, flipping left when it would overflow. */
const targetFor = (pointer: Point): Point => ({
    x: pointer.x + CARD_WIDTH + 28 > window.innerWidth - EDGE_GUTTER
        ? pointer.x - CARD_WIDTH - 20
        : pointer.x + 24,
    y: Math.min(pointer.y + 18, window.innerHeight - CARD_HEIGHT),
});

/**
 * A file-card preview that follows the cursor over the project index.
 *
 * Decorative: everything on it is already in the row it describes, so it is
 * hidden from assistive technology and never rendered without a fine pointer.
 */
export const ProjectPreview: FC<Props> = ({ project }) => {
    const boxRef = useRef<HTMLDivElement>(null);
    const pointerRef = useRef<Point>({ x: 0, y: 0 });
    const positionRef = useRef<Point>({ x: 0, y: 0 });
    const shownRef = useRef(false);
    // Kept so the card can fade out still showing what it described.
    const [displayed, setDisplayed] = useState<IndexedProject | null>(null);

    useEffect(() => {
        const track = (event: PointerEvent) => {
            pointerRef.current = { x: event.clientX, y: event.clientY };
        };

        window.addEventListener('pointermove', track, { passive: true });

        return () => {
            window.removeEventListener('pointermove', track);
        };
    }, []);

    useEffect(() => {
        if (!project) {
            shownRef.current = false;

            return;
        }

        setDisplayed(project);

        const box = boxRef.current;

        if (!box || shownRef.current) {
            return;
        }

        // First appearance: start at the cursor rather than sliding in from 0,0.
        const target = targetFor(pointerRef.current);

        shownRef.current = true;
        positionRef.current = target;
        box.style.transform = `translate3d(${target.x.toFixed(1)}px, ${target.y.toFixed(1)}px, 0)`;
    }, [project]);

    useRaf(() => {
        const box = boxRef.current;

        if (!box) {
            return;
        }

        const target = targetFor(pointerRef.current);
        const next = {
            x: lerp(positionRef.current.x, target.x, FOLLOW),
            y: lerp(positionRef.current.y, target.y, FOLLOW),
        };

        positionRef.current = next;
        box.style.transform = `translate3d(${next.x.toFixed(1)}px, ${next.y.toFixed(1)}px, 0)`;
    }, project !== null);

    return (
        <div
            ref={boxRef}
            className={`${styles.preview}${project ? ` ${styles.previewOn}` : ''}`}
            aria-hidden="true"
        >
            <div className={styles.card}>
                <div className={styles.path}>{displayed ? `~/work/${displayed.id}` : ''}</div>
                <div className={styles.name}>{displayed?.name ?? ''}</div>
                <ul className="tags">
                    {displayed?.stack.map(item => <li key={item}>{item}</li>)}
                </ul>
            </div>
        </div>
    );
};
