'use client';

/**
 * The four engagement steps, with the rail that tracks the active one.
 *
 * The rail caret is positioned from the live step geometry rather than from a
 * fixed row height, so a step that wraps to three lines still gets a caret the
 * height of its own row. It re-measures on the `layout` signal.
 */

import { FC, useCallback, useEffect, useRef } from 'react';
import { useStageEvent } from '@/lib/motion';
import type { ProcessStep } from '@/config/processSteps';
import { StepTerminal } from './StepTerminal';
import styles from './Process.module.css';

interface Props {
    steps: ProcessStep[];
    activeIndex: number;
    /** False in the stacked layout, where every step reads at full strength. */
    pinned: boolean;
}

/** Inset from the step's own box, so the caret reads as a text caret, not a row. */
const CARET_INSET = 14;
const CARET_MIN_HEIGHT = 20;
/** The caret's unscaled height in the stylesheet. */
const CARET_BASE_HEIGHT = 100;

export const StepList: FC<Props> = ({ steps, activeIndex, pinned }) => {
    const listRef = useRef<HTMLOListElement>(null);
    const caretRef = useRef<HTMLSpanElement>(null);

    const placeCaret = useCallback(() => {
        const list = listRef.current;
        const caret = caretRef.current;
        const step = list?.children.item(activeIndex);

        if (!caret || !(step instanceof HTMLElement)) {
            return;
        }

        const top = step.offsetTop + CARET_INSET;
        const height = Math.max(CARET_MIN_HEIGHT, step.offsetHeight - CARET_INSET * 2);

        caret.style.setProperty('--cy', `${top.toFixed(1)}px`);
        caret.style.setProperty('--ch', (height / CARET_BASE_HEIGHT).toFixed(3));
    }, [activeIndex]);

    useEffect(placeCaret, [placeCaret]);
    useStageEvent('layout', placeCaret);

    return (
        <div className={styles.stepsWrap}>
            <ol className={styles.steps} ref={listRef}>
                {steps.map((step, index) => (
                    <li
                        className={stepClass(index, activeIndex, pinned)}
                        key={step.id}
                        data-step={index}
                    >
                        <span className={styles.badge}>
                            <span className={styles.num}>{index + 1}</span>
                            <svg className={styles.check} viewBox="0 0 16 16" aria-hidden="true">
                                <path d="M3.5 8.5l3 3 6-7" />
                            </svg>
                        </span>

                        <div>
                            {/* The scramble rewrites the text content, so the accessible
                                name is pinned to the real title. */}
                            <h3 data-step-title="" aria-label={step.title}>{step.title}</h3>
                            <p>{step.description}</p>
                        </div>

                        <StepTerminal transcript={step.transcript} pinned={pinned} />
                    </li>
                ))}
            </ol>

            <div className={styles.rail} aria-hidden="true">
                <span className={styles.fill} />
                <span className={styles.railCaret} ref={caretRef} />
            </div>
        </div>
    );
};

/** Only the pinned layout dims the steps it is not on; stacked reads them all. */
const stepClass = (index: number, activeIndex: number, pinned: boolean) => {
    const active = !pinned || index === activeIndex;
    const done = pinned && index < activeIndex;

    return [styles.step, active ? styles.isActive : '', done ? styles.isDone : '']
        .filter(Boolean)
        .join(' ');
};
