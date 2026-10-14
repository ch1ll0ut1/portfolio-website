'use client';

import { type FC, useEffect, useId, useRef } from 'react';
import { useInView } from '@/lib/motion';
import { type Engagement, formatLabel } from '@/config/engagements';
import type { CssVars } from '@/lib/cssVars';
import { runBorderTrace } from './borderTrace';
import { useSpotlight } from './useSpotlight';
import styles from './Services.module.css';

export interface Props {
    engagement: Engagement;
    /** Position in the row. Drives the entrance stagger. */
    index: number;
}

/** Added per card, in seconds. */
const STAGGER_S = 0.09;
/** Time after a card's own delay before it stops owning its transitions. */
const SETTLE_S = 1.9;

/**
 * One engagement model.
 *
 * The card rises into place, then its bullet markers draw left to right one by
 * one. The featured card sits on the raised surface, parks a blinking caret
 * after its name and has its border traced once as it scrolls in. A card
 * already on screen at load is left at rest.
 *
 * Every state the entrance passes through is a class on the card: with motion
 * off the markup renders in its finished state and nothing here changes it.
 */
export const ServiceCard: FC<Props> = ({ engagement, index }) => {
    const cardRef = useRef<HTMLElement>(null);
    const traceRef = useRef<HTMLDivElement>(null);
    const stopTraceRef = useRef<(() => void) | null>(null);
    const settleTimerRef = useRef(0);
    const nameId = useId();
    const delay = index * STAGGER_S;

    useSpotlight(cardRef, styles.isLit);

    // Only the featured card renders a trace element, so this is a no-op on the
    // other two.
    const startTrace = () => {
        if (traceRef.current) {
            stopTraceRef.current = runBorderTrace(traceRef.current);
        }
    };

    useInView(cardRef, {
        onArm: () => {
            cardRef.current?.classList.add(styles.isArmed);
        },
        onEnter: () => {
            // One frame between arming and releasing, so the pre-state paints.
            requestAnimationFrame(() => {
                const card = cardRef.current;

                if (!card) {
                    return;
                }

                card.classList.add(styles.isIn);
                card.classList.remove(styles.isArmed);
                startTrace();

                // Hover lifts the card on its own transition; the entrance one
                // is handed back once the rise and the markers are done.
                settleTimerRef.current = window.setTimeout(() => {
                    card.classList.add(styles.isSettled);
                }, (delay + SETTLE_S) * 1000);
            });
        },
        // Already on screen at load: left at rest, as the design does. The
        // rise and the border trace are an arrival, and this card has not
        // arrived; it was already there. A no-op rather than nothing, since
        // without an intro path the entrance would run straight away.
        onIntro: () => undefined,
    });

    useEffect(() => () => {
        window.clearTimeout(settleTimerRef.current);
        stopTraceRef.current?.();
    }, []);

    const cardStyle: CssVars = { '--d': `${delay.toFixed(2)}s` };
    const className = engagement.featured
        ? `${styles.offer} ${styles.isFeature}`
        : styles.offer;

    return (
        <article
            ref={cardRef}
            className={className}
            style={cardStyle}
            aria-labelledby={nameId}
            data-engagement={engagement.id}
            data-featured={engagement.featured ? 'true' : undefined}
        >
            <div className={styles.top}>
                <h3 className={styles.name} id={nameId}>
                    {engagement.name}
                    {engagement.featured && <span className="visually-hidden">, featured</span>}
                </h3>
                <p className={styles.who}>{engagement.who}</p>
            </div>

            <ul className={styles.list}>
                {engagement.bullets.map((bullet, bulletIndex) => {
                    const itemStyle: CssVars = { '--i': bulletIndex };

                    return <li key={bullet} style={itemStyle}>{bullet}</li>;
                })}
            </ul>

            <p className={styles.format}>
                <span>{formatLabel}</span>
                {engagement.format}
            </p>

            {engagement.featured && <div ref={traceRef} className={styles.trace} aria-hidden="true" />}
        </article>
    );
};
