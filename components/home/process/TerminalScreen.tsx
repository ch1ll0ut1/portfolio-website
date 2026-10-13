/**
 * One terminal transcript, rendered whole.
 *
 * Every line and every character of the command is in the markup, so the
 * transcript reads with JavaScript off. `terminalTyper.ts` finds the pieces through the
 * `data-line` and `data-char` hooks and only toggles classes on them, which
 * keeps the hashed CSS Module names out of the imperative engine.
 */

import React, { FC } from 'react';
import type { TerminalSpan, TerminalTone } from '@/config/processSteps';
import styles from './Process.module.css';

interface Props {
    /** Transcript lines. The first one is the command and types out. */
    transcript: TerminalSpan[][];
    /** Owner-supplied state classes, the active-screen marker mainly. */
    className?: string;
}

const toneClass: Record<TerminalTone, string> = {
    prompt: styles.tonePrompt,
    dim: styles.toneDim,
    ok: styles.toneOk,
    warn: styles.toneWarn,
};

export const TerminalScreen: FC<Props> = ({ transcript, className = '' }) => (
    <pre className={`${styles.screen} ${className}`.trim()} data-screen="">
        {transcript.map((line, lineIndex) => (
            <span className={styles.tl} data-line="" key={lineIndex}>
                {line.map((span, spanIndex) => (
                    <span className={span.tone ? toneClass[span.tone] : undefined} key={spanIndex}>
                        {lineIndex === 0 ? splitChars(span.text) : span.text}
                    </span>
                ))}
            </span>
        ))}

        {/* The prompt the caret comes to rest on once the run is over. */}
        <span className={styles.tl} data-line="">
            <span className={styles.tonePrompt}>$</span>
            {' '}
        </span>
    </pre>
);

/** The command line types character by character, so each character is its own node. */
const splitChars = (text: string) => Array.from(text).map((char, index) => (
    <span className={styles.tch} data-char="" key={index}>{char}</span>
));
