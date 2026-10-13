'use client';

import { type FC, useEffect, useRef, useState } from 'react';
import { prefersReducedMotion, useReducedMotion } from '@/lib/motion';
import { type MarqueeEngine, startMarquee } from './marqueeEngine';
import styles from './Proof.module.css';

interface Props {
    /** Organisation names, in display order. */
    names: string[];
}

/**
 * Full-bleed row of organisation names that drifts with the scroll.
 *
 * The row is rendered twice so the loop has somewhere to wrap to; the second
 * copy is hidden from assistive technology. It moves on its own, so it carries
 * a pause control (WCAG 2.2.2), and it holds still while hovered or while focus
 * is inside it. With motion off it is a plain, readable row and the control is
 * not needed.
 */
export const Marquee: FC<Props> = ({ names }) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLUListElement>(null);
    const engineRef = useRef<MarqueeEngine | null>(null);
    const reduced = useReducedMotion();
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        const root = rootRef.current;
        const viewport = viewportRef.current;
        const track = trackRef.current;

        // The hook reports false until it mounts, so the live preference is read
        // here as well: a reduced-motion visitor must never see the first frame.
        if (!root || !viewport || !track || reduced || prefersReducedMotion()) {
            return;
        }

        const engine = startMarquee({ root, viewport, track, liveClass: styles.isLive });

        engineRef.current = engine;

        return () => {
            engineRef.current = null;
            engine.destroy();
        };
    }, [reduced]);

    useEffect(() => {
        engineRef.current?.setPaused(paused);
    }, [paused, reduced]);

    return (
        <div className={styles.marqueeRoot} ref={rootRef}>
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
            {reduced || names.length === 0
                ? null
                : (
                    <button
                        className={styles.marqueeToggle}
                        data-paused={paused}
                        type="button"
                        aria-label={paused ? 'Play the moving list of organizations' : 'Pause the moving list of organizations'}
                        onClick={() => {
                            setPaused(previous => !previous);
                        }}
                    >
                        <span className={styles.marqueeIcon} aria-hidden="true" />
                        {paused ? 'Play' : 'Pause'}
                    </button>
                )}
        </div>
    );
};
