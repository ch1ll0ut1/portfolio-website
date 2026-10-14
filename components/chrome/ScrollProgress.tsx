'use client';

import { type FC, useEffect, useRef } from 'react';
import { clamp, scrollState, useScrollState, useStageEvent } from '@/lib/motion';
import styles from './ScrollProgress.module.css';

/** Below this the bar stays hidden, so the top of the page reads clean. */
const VISIBLE_AFTER = 24;

export const ScrollProgress: FC = () => {
    const ref = useRef<HTMLDivElement>(null);

    useScrollState((state) => {
        paint(ref.current, state.y, state.p);
    });

    // Progress depends on document height, so a re-measure has to repaint too.
    useStageEvent('layout', () => {
        paint(ref.current, scrollState.y, scrollState.p);
    });

    // A page restored mid-scroll must show its real progress on the first frame.
    useEffect(() => {
        paint(ref.current, window.scrollY, clamp(window.scrollY / scrollState.max, 0, 1));
    }, []);

    return <div className={styles.bar} ref={ref} aria-hidden="true" />;
};

const paint = (element: HTMLDivElement | null, y: number, progress: number) => {
    if (!element) {
        return;
    }

    element.style.setProperty('--sp', progress.toFixed(4));
    element.classList.toggle(styles.on, y > VISIBLE_AFTER);
};
