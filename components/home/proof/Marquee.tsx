'use client';

import { type FC, useEffect, useRef } from 'react';
import { prefersReducedMotion, useReducedMotion } from '@/lib/motion';
import { startMarquee } from './marqueeEngine';
import styles from './Proof.module.css';

interface Props {
    /** Organisation names, in display order. */
    names: string[];
}

/**
 * Full-bleed row of organisation names that drifts with the scroll.
 *
 * The row is rendered twice so the loop has somewhere to wrap to; the second
 * copy is hidden from assistive technology. With motion off it is a plain,
 * readable row.
 */
export const Marquee: FC<Props> = ({ names }) => {
    const viewportRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLUListElement>(null);
    const reduced = useReducedMotion();

    useEffect(() => {
        const viewport = viewportRef.current;
        const track = trackRef.current;

        // The hook reports false until it mounts, so the live preference is read
        // here as well: a reduced-motion visitor must never see the first frame.
        if (!viewport || !track || reduced || prefersReducedMotion()) {
            return;
        }

        return startMarquee({ viewport, track, liveClass: styles.isLive });
    }, [reduced]);

    return (
        <div className={styles.marquee} ref={viewportRef}>
            <ul className={styles.track} ref={trackRef}>
                {names.map(name => (
                    <li className={styles.item} key={name}>{name}</li>
                ))}
                {names.map(name => (
                    <li className={styles.item} key={`loop-${name}`} aria-hidden="true">{name}</li>
                ))}
            </ul>
        </div>
    );
};
