'use client';

import { type FC, useCallback, useEffect, useRef } from 'react';
import type { CaseMetric, CaseVisualId } from '@/config/caseStudies';
import { prefersReducedMotion, useMaskReveal, useStageEvent } from '@/lib/motion';
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
 * Loads an illustration on first approach.
 *
 * The four modules together are the biggest thing in this section, so they are
 * imported here rather than at the top of the file: nothing is fetched until a
 * case study is about to be looked at.
 */
const load = async (id: CaseVisualId, stage: HTMLElement): Promise<Illustration> => {
    switch (id) {
        case 'edithing': {
            const { buildEdithing } = await import('./edithing');

            return buildEdithing(stage, frameClasses, edithingClasses);
        }

        case 'bluereceipt': {
            const { buildBluereceipt } = await import('./bluereceipt');

            return buildBluereceipt(stage, frameClasses, bluereceiptClasses);
        }

        case 'socialbee': {
            const { buildSocialbee } = await import('./socialbee');

            return buildSocialbee(stage, frameClasses, socialbeeClasses);
        }

        case 'eko': {
            const { buildEko } = await import('./eko');

            return buildEko(stage, frameClasses, ekoClasses);
        }
    }
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
        let loading = false;

        stage.className = vizClass;
        host.appendChild(stage);
        stageRef.current = stage;

        const mount = async () => {
            const illustration = await load(id, stage);

            if (disposed) {
                return;
            }

            illustrationRef.current = illustration;
            stage.style.width = `${illustration.width}px`;
            stage.style.height = `${illustration.height}px`;
            fit();

            // Reduced motion gets one meaningful frame and no clock at all.
            if (prefersReducedMotion()) {
                illustration.still();

                return;
            }

            runnerRef.current = createRunner(stage, illustration.script);
            sync();
        };

        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                onScreenRef.current = entry.isIntersecting;
            }

            if (onScreenRef.current && !loading) {
                loading = true;
                void mount().catch((error: unknown) => {
                    console.error('[work] illustration failed to mount', error);
                });
            }

            sync();
        }, { threshold: 0.2 });

        const resizeObserver = new ResizeObserver(() => {
            fit();
        });

        observer.observe(host);
        resizeObserver.observe(host);
        document.addEventListener('visibilitychange', sync);

        return () => {
            disposed = true;
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
