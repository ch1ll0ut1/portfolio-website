'use client';

import { type FC, type PointerEvent, useRef } from 'react';
import { useMagnet } from '@/lib/motion';
import { links } from '@/config/links';
import { conversionHandlers } from './outboundTracking';
import styles from './CtaMagnet.module.css';

const LABEL = 'Book a 30-min call';
/* Carried over from the pre-redesign closing CTA so the GA4 series continues. */
const CONVERSION_TYPE = 'footer';
const CONVERSION_LOCATION = 'cta_section';

/**
 * The closing call to action: a damped-spring pointer magnet.
 *
 * `useMagnet` (spring) writes `--bx` / `--by`, which the stylesheet turns into the
 * button's own transform and, at a fraction of it, the inner content's — the
 * label lags behind the shell, which reads as depth. It no-ops on coarse
 * pointers and under reduced motion, so the button simply sits still there.
 *
 * `--fx` / `--fy` record where the pointer crossed the edge so the caret-orange
 * fill grows out of that point instead of always from the centre. Hover states
 * are mirrored on `:focus-visible` in CSS, so a keyboard user sees the same
 * label roll and arrow swap.
 */
export const CtaMagnet: FC = () => {
    const ctaRef = useRef<HTMLAnchorElement>(null);
    const tracking = conversionHandlers(CONVERSION_TYPE, CONVERSION_LOCATION);

    useMagnet(ctaRef, { kind: 'spring' });

    const trackOrigin = (event: PointerEvent<HTMLAnchorElement>) => {
        const element = event.currentTarget;
        const rect = element.getBoundingClientRect();

        if (rect.width === 0 || rect.height === 0) {
            return;
        }

        element.style.setProperty('--fx', `${(((event.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`);
        element.style.setProperty('--fy', `${(((event.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`);
    };

    return (
        <a
            ref={ctaRef}
            className={`btn btn--primary ${styles.cta}`}
            href={links.calendly}
            target="_blank"
            rel="noopener noreferrer"
            onPointerEnter={trackOrigin}
            onPointerLeave={trackOrigin}
            onClick={tracking.onClick}
            onAuxClick={tracking.onAuxClick}
        >
            <span className={styles.in}>
                <span className={styles.roll}>
                    <span className={styles.rollA}>{LABEL}</span>
                    <span className={styles.rollB} aria-hidden="true">{LABEL}</span>
                </span>
                {/* Two identical glyphs: the first leaves up and right as the
                    second arrives from down and left. */}
                <span className={styles.arrow} aria-hidden="true">
                    {[0, 1].map(copy => (
                        <svg key={copy} viewBox="0 0 16 16" width="16" height="16">
                            <path
                                d="M4 12 12 4M5.5 4H12v6.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    ))}
                </span>
            </span>
        </a>
    );
};
