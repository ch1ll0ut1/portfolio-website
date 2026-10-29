'use client';

import { type FC, useCallback, useEffect, useRef } from 'react';
import type { CaseMetric, CaseVisualId } from '@/config/caseStudies';
import { prefersReducedMotion, useMaskReveal, useStageEvent } from '@/lib/motion';
import { whenIdle } from '@/lib/whenIdle';
import styles from './CaseVisual.module.css';
import { bluereceiptClasses, edithingClasses, ekoClasses, frameClasses, socialbeeClasses, vizClass } from './classes';
import type { Illustration } from './dom';
import { type Runner, createRunner } from './runner';

interface Props {
    id: CaseVisualId;
    metric: CaseMetric;
    /** True once the next card has slid over this one, so the loop can pause. */
    covered: boolean;
}

/** Scale bounds, so a very small or very wide panel still reads. */
const MIN_SCALE = 0.3;
const MAX_SCALE = 1.3;
const NARROW = 520;

/**
 * How far outside the viewport an illustration is built: a full viewport above
 * and below. Built that early, it is complete, and its fade-in has played,
 * before the first pixel of its panel scrolls into view.
 */
const APPROACH_MARGIN = '100% 0px';

type Build = (stage: HTMLElement) => Illustration;

/**
 * Each illustration's code, resolved to the function that builds it.
 *
 * The four modules together are the biggest thing in this section, so they are
 * imported here rather than at the top of the file and stay out of the page's
 * first load. Each one is fetched once the page is idle, and built a viewport
 * before its panel arrives. A second call costs nothing: the module is cached.
 */
const loaders: Record<CaseVisualId, () => Promise<Build>> = {
    edithing: () => import('./edithing').then(({ buildEdithing }) =>
        (stage: HTMLElement) => buildEdithing(stage, frameClasses, edithingClasses),
    ),
    bluereceipt: () => import('./bluereceipt').then(({ buildBluereceipt }) =>
        (stage: HTMLElement) => buildBluereceipt(stage, frameClasses, bluereceiptClasses),
    ),
    socialbee: () => import('./socialbee').then(({ buildSocialbee }) =>
        (stage: HTMLElement) => buildSocialbee(stage, frameClasses, socialbeeClasses),
    ),
    eko: () => import('./eko').then(({ buildEko }) =>
        (stage: HTMLElement) => buildEko(stage, frameClasses, ekoClasses),
    ),
};

/**
 * The visual well of a case study.
 *
 * Owns three jobs and no animation logic of its own: mount the illustration,
 * keep it scaled to the panel, and tell its runner when to run.
 */
export const CaseVisual: FC<Props> = ({ id, metric, covered }) => {
    const hostRef = useRef<HTMLDivElement>(null);
    const metricRef = useRef<HTMLParagraphElement>(null);
    const valueRef = useRef<HTMLSpanElement>(null);
    const stageRef = useRef<HTMLDivElement | null>(null);
    const illustrationRef = useRef<Illustration | null>(null);
    const runnerRef = useRef<Runner | null>(null);
    const coveredRef = useRef(covered);
    const onScreenRef = useRef(false);

    useMaskReveal(valueRef, { delay: 0.25 });

    /** Centres the fixed-size illustration in the panel, above the metric. */
    const fit = useCallback(() => {
        const host = hostRef.current;
        const stage = stageRef.current;
        const illustration = illustrationRef.current;

        if (!host || !stage || !illustration) {
            return;
        }

        const width = host.clientWidth;
        const height = host.clientHeight;

        if (width === 0 || height === 0) {
            return;
        }

        const pad = width < NARROW ? 18 : 36;
        const metricEl = metricRef.current;
        const offset = metricEl ? Number.parseFloat(window.getComputedStyle(metricEl).bottom) : 0;
        const reserve = metricEl
            ? metricEl.offsetHeight + (Number.isFinite(offset) ? offset : 0) + (width < NARROW ? 16 : 28)
            : 0;
        const scale = Math.max(MIN_SCALE, Math.min(
            (width - pad * 2) / illustration.width,
            (height - pad - reserve) / illustration.height,
            MAX_SCALE,
        ));
        const x = (width - illustration.width * scale) / 2;
        const y = pad + Math.max(0, (height - pad - reserve - illustration.height * scale) / 2);

        stage.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;
    }, []);

    const sync = useCallback(() => {
        runnerRef.current?.setRunning(onScreenRef.current && !coveredRef.current && !document.hidden);
    }, []);

    useEffect(() => {
        coveredRef.current = covered;
        sync();
    }, [covered, sync]);

    useStageEvent('layout', () => {
        illustrationRef.current?.onLayout?.();
        fit();
    });

    useEffect(() => {
        const host = hostRef.current;

        if (!host) {
            return;
        }

        const stage = document.createElement('div');
        let disposed = false;
        let fadeFrame = 0;

        stage.className = `${vizClass} ${styles.stage}`;
        host.appendChild(stage);
        stageRef.current = stage;

        const mount = async () => {
            const build = await loaders[id]();

            if (disposed) {
                return;
            }

            const illustration = build(stage);

            illustrationRef.current = illustration;
            stage.style.width = `${illustration.width}px`;
            stage.style.height = `${illustration.height}px`;
            fit();

            // A frame later, so the transparent start is painted and the fade
            // has something to run from.
            fadeFrame = requestAnimationFrame(() => {
                stage.classList.add(styles.built);
            });

            // Reduced motion gets one meaningful frame and no clock at all.
            if (prefersReducedMotion()) {
                illustration.still();

                return;
            }

            // Built ahead of time, so it waits, paused, for its panel to show.
            runnerRef.current = createRunner(stage, illustration.script);
            sync();
        };

        // Fetch the code while the page is idle, so a reader who jumps straight
        // here finds it already downloaded.
        const cancelPreload = whenIdle(() => {
            loaders[id]().catch(ignoreFailedPreload);
        });

        // Build as soon as the panel is within a viewport of being seen.
        const approach = new IntersectionObserver((entries) => {
            if (!entries.some(entry => entry.isIntersecting)) {
                return;
            }

            approach.disconnect();
            cancelPreload();
            void mount().catch((error: unknown) => {
                console.error('[work] illustration failed to mount', error);
            });
        }, { rootMargin: APPROACH_MARGIN });

        // Run only while enough of it is actually on screen.
        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                onScreenRef.current = entry.isIntersecting;
            }

            sync();
        }, { threshold: 0.2 });

        const resizeObserver = new ResizeObserver(() => {
            fit();
        });

        approach.observe(host);
        observer.observe(host);
        resizeObserver.observe(host);
        document.addEventListener('visibilitychange', sync);

        return () => {
            disposed = true;
            cancelAnimationFrame(fadeFrame);
            cancelPreload();
            approach.disconnect();
            observer.disconnect();
            resizeObserver.disconnect();
            document.removeEventListener('visibilitychange', sync);
            runnerRef.current?.dispose();
            runnerRef.current = null;
            illustrationRef.current = null;
            stageRef.current = null;
            stage.remove();
        };
    }, [id, fit, sync]);

    return (
        <div className={styles.well}>
            <div ref={hostRef} className={styles.host} aria-hidden="true" />
            <p ref={metricRef} className={styles.metric}>
                <span ref={valueRef} className={styles.value}>{metric.value}</span>
                <span className={styles.label}>{metric.label}</span>
            </p>
        </div>
    );
};

/** A failed warm-up is not news: the build retries the import and reports it. */
const ignoreFailedPreload = () => undefined;
