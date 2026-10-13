'use client';

import { type RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { clamp, useReducedMotion, useScrub, useStageEvent } from '@/lib/motion';
import { DEFAULT_LANE, type GraphGeometry, buildGeometry, measureRows, xAt } from './graphGeometry';

/** Reading line: progress 0 and 1 both sit at 62% of the viewport, so this tracks one line. */
const READING_LINE = { start: 0.62, end: 0.62 };
/** Sentinel for "not measured yet", which keeps the first update silent. */
const UNMEASURED = -2;
/** Largest jump that still counts as reading. Anything bigger is a scroll jump. */
const PULSE_MAX_STEP = 2;
/** How far past the root commit the current-row highlight survives, in px. */
const CURRENT_FALLOFF = 140;
/** Slack around the first and last node where the write head stays visible, in px. */
const HEAD_MARGIN = 2;

export interface CareerLogState {
    logRef: RefObject<HTMLDivElement | null>;
    inkRef: RefObject<SVGSVGElement | null>;
    headRef: RefObject<SVGGElement | null>;
    /** One stable ref callback per row, so the graph can measure them. */
    rowRefs: ((node: HTMLLIElement | null) => void)[];
    geometry: GraphGeometry | null;
    /** Per commit, bumped every time its node should pulse and its hash re-roll. */
    pulses: number[];
    /** Index of the last commit the ink has reached, or -1. */
    reached: number;
    /** Index of the commit at the reading line, or -1. */
    current: number;
    /** Index of the hovered commit, or -1. */
    hovered: number;
    /** False under reduced motion, where the ink is drawn in full at rest. */
    showHead: boolean;
    hover: (index: number) => void;
    endHover: () => void;
}

/**
 * Drives the career log: measures the rows, turns scroll into ink, and decides
 * which commits pulse.
 *
 * Per-frame work writes to the DOM directly (the clip-path inset and the write
 * head's transform). React state only carries the things that change at most
 * once per commit, so scrolling the whole log costs a handful of renders.
 */
export const useCareerLog = (count: number): CareerLogState => {
    const logRef = useRef<HTMLDivElement>(null);
    const inkRef = useRef<SVGSVGElement>(null);
    const headRef = useRef<SVGGElement>(null);
    const rowsRef = useRef<(HTMLLIElement | null)[]>([]);
    const geometryRef = useRef<GraphGeometry | null>(null);
    const progressRef = useRef(0);
    const reachedRef = useRef(UNMEASURED);
    const currentRef = useRef(UNMEASURED);
    const reducedRef = useRef(false);

    const reduced = useReducedMotion();
    const [geometry, setGeometry] = useState<GraphGeometry | null>(null);
    const [pulses, setPulses] = useState<number[]>(() => Array.from({ length: count }, () => 0));
    const [reached, setReached] = useState(-1);
    const [current, setCurrent] = useState(-1);
    const [hovered, setHovered] = useState(-1);

    reducedRef.current = reduced;

    const rowRefs = useMemo(
        () => Array.from({ length: count }, (_, index) => (node: HTMLLIElement | null) => {
            rowsRef.current[index] = node;
        }),
        [count],
    );

    const pulse = useCallback((index: number) => {
        setPulses(previous => previous.map((token, at) => (at === index ? token + 1 : token)));
    }, []);

    const measure = useCallback(() => {
        const log = logRef.current;

        if (!log) {
            return;
        }

        const lane = parseFloat(getComputedStyle(log).getPropertyValue('--log-lane'));
        // `CareerGraph` renders both layers empty from the first paint, so this
        // reads the gutter the CSS actually gave the graph. The viewBox has to
        // match that width 1:1 or the lanes drift sideways.
        const width = inkRef.current === null ? 0 : inkRef.current.clientWidth;
        const next = buildGeometry(measureRows(rowsRef.current, log), {
            lane: Number.isNaN(lane) ? DEFAULT_LANE : lane,
            width,
            height: log.offsetHeight,
        });

        // The nodes moved, so whatever the ink had reached no longer means
        // anything. Resetting keeps the next update quiet instead of pulsing
        // every commit the ink now covers.
        reachedRef.current = UNMEASURED;
        geometryRef.current = next;
        setGeometry(next);
    }, []);

    const applyProgress = useCallback((progress: number, quiet: boolean) => {
        const snapshot = geometryRef.current;

        if (!snapshot) {
            return;
        }

        const { nodes, height, lookup } = snapshot;
        const first = nodes[0];
        const last = nodes.at(-1);

        if (first === undefined || last === undefined) {
            return;
        }

        progressRef.current = progress;

        const y = progress * height;

        inkRef.current?.style.setProperty('--ink', `${Math.max(0, height - y).toFixed(1)}px`);

        const head = headRef.current;

        if (head) {
            const x = xAt(lookup, y);

            head.setAttribute('transform', `translate(${x.toFixed(2)} ${clamp(y, first.y, last.y).toFixed(2)})`);
            head.style.opacity = y > first.y - HEAD_MARGIN && y < last.y + HEAD_MARGIN ? '1' : '0';
        }

        let nextReached = -1;

        nodes.forEach((node, index) => {
            if (y >= node.y) {
                nextReached = index;
            }
        });

        if (nextReached !== reachedRef.current) {
            const stepped = nextReached > reachedRef.current && nextReached - reachedRef.current <= PULSE_MAX_STEP;

            // Only a commit the reading line just arrived at gets a pulse. Big
            // jumps, backwards scrolling and the first measurement stay quiet.
            if (!quiet && stepped) {
                pulse(nextReached);
            }

            reachedRef.current = nextReached;
            setReached(nextReached);
        }

        const nextCurrent = y > last.y + CURRENT_FALLOFF ? -1 : nextReached;

        if (nextCurrent !== currentRef.current) {
            currentRef.current = nextCurrent;
            setCurrent(nextCurrent);
        }
    }, [pulse]);

    useScrub(logRef, (progress) => {
        // Under reduced motion the ink layer is drawn in full by CSS, so there
        // is nothing for the scroll position to reveal.
        if (reducedRef.current) {
            return;
        }

        applyProgress(progress, reachedRef.current === UNMEASURED);
    }, READING_LINE);

    useStageEvent('layout', measure);

    useEffect(() => {
        const log = logRef.current;

        if (!log) {
            return;
        }

        measure();

        if (typeof ResizeObserver === 'undefined') {
            return;
        }

        const observer = new ResizeObserver(() => {
            measure();
        });

        observer.observe(log);

        return () => {
            observer.disconnect();
        };
    }, [measure]);

    useEffect(() => {
        if (reduced) {
            return;
        }

        applyProgress(progressRef.current, true);
    }, [geometry, reduced, applyProgress]);

    const hover = useCallback((index: number) => {
        setHovered(index);
        pulse(index);
    }, [pulse]);

    const endHover = useCallback(() => {
        setHovered(-1);
    }, []);

    return {
        logRef,
        inkRef,
        headRef,
        rowRefs,
        geometry,
        pulses,
        reached,
        current,
        hovered,
        showHead: !reduced,
        hover,
        endHover,
    };
};
