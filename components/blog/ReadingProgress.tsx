'use client';

import { FC, useEffect, useRef } from 'react';
import { registerScrub } from '@/lib/motion';
import { claimReadingProgress } from '@/components/chrome/readingProgressClaim';
import styles from './ReadingProgress.module.css';

interface Props {
    /** Id of the element whose scroll-through drives the indicator. */
    targetId: string;
}

/**
 * A caret travelling across the top of the viewport as the article is read.
 *
 * Decorative: the information is already in the scrollbar, so the whole thing
 * is hidden from assistive technology. The scrub is registered against an
 * element this component does not render, so it uses the plain registration
 * rather than `useScrub`'s ref form.
 *
 * While mounted it claims the top strip, so the site chrome's document-wide
 * hairline steps aside instead of painting over it.
 */
export const ReadingProgress: FC<Props> = ({ targetId }) => {
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(claimReadingProgress, []);

    useEffect(() => {
        const track = trackRef.current;
        const target = document.getElementById(targetId);

        if (!track || !target) {
            return;
        }

        return registerScrub(target, (progress) => {
            track.style.setProperty('--p', progress.toFixed(4));
        }, { start: 0, end: 1 });
    }, [targetId]);

    return (
        <div ref={trackRef} className={styles.track} aria-hidden="true">
            <span className={styles.fill} />
            <span className={styles.caret} />
        </div>
    );
};
