/**
 * The stepper's terminal: chrome, step counter and one screen per step.
 *
 * Decorative — the same words are already in the step list — so the whole
 * thing is hidden from assistive technology.
 */

import React, { FC, RefObject } from 'react';
import { type ProcessStep, terminalPath } from '@/config/processSteps';
import { TerminalScreen } from './TerminalScreen';
import styles from './Process.module.css';

interface Props {
    steps: ProcessStep[];
    activeIndex: number;
    /** Handed in so the stepper can create the typers and watch for first view. */
    rootRef: RefObject<HTMLDivElement | null>;
}

const pad = (value: number) => String(value).padStart(2, '0');

export const Terminal: FC<Props> = ({ steps, activeIndex, rootRef }) => (
    <div className={styles.term} ref={rootRef} aria-hidden="true" data-term="main">
        <div className={styles.bar}>
            <i />
            <i />
            <i />
            <span className={styles.name}>{terminalPath}</span>
            <span className={styles.counter} data-counter="">
                {pad(activeIndex + 1)}
                {' / '}
                {pad(steps.length)}
            </span>
        </div>

        <div className={styles.screens}>
            {steps.map((step, index) => (
                <TerminalScreen
                    key={step.id}
                    transcript={step.transcript}
                    className={index === activeIndex ? styles.isActive : ''}
                />
            ))}
        </div>

        {/* Scrubs with the track; the stepper writes `--p` on the section root. */}
        <div className={styles.progress}>
            <span />
        </div>
    </div>
);
