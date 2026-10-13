'use client';

/**
 * The small terminal shown inline under each step in the stacked layout.
 *
 * It types itself when it scrolls into view. While the stepper is pinned it is
 * off screen, so it just sits at its finished state and costs nothing.
 */

import { FC, useEffect, useRef } from 'react';
import { observeInView, prefersReducedMotion } from '@/lib/motion';
import { type TerminalSpan, terminalPath } from '@/config/processSteps';
import { TerminalScreen } from './TerminalScreen';
import { createTyper } from './terminalTyper';
import styles from './Process.module.css';

interface Props {
    transcript: TerminalSpan[][];
    /** True while the pinned stepper owns the typing, which leaves this one static. */
    pinned: boolean;
}

/** Fires once the little terminal is comfortably inside the viewport. */
const FIRE_MARGIN = '0px 0px -18% 0px';

export const StepTerminal: FC<Props> = ({ transcript, pinned }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const root = ref.current;

        if (!root) {
            return;
        }

        const screen = root.querySelector<HTMLElement>('[data-screen]');

        if (!screen) {
            return;
        }

        const typer = createTyper(screen, {
            off: styles.off,
            caret: styles.caret,
            caretIdle: styles.caretIdle,
        });

        if (pinned || prefersReducedMotion()) {
            typer.finish();

            return () => {
                typer.destroy();
            };
        }

        const stopObserving = observeInView(root, {
            margin: FIRE_MARGIN,
            onArm: () => { typer.clear(); },
            onEnter: () => { typer.type(false); },
            // On screen before any scrolling — a `#process` deep link, or a
            // restored position. The transcript is already being read, so it
            // stays finished rather than clearing itself to type again.
            onIntro: () => { typer.finish(); },
            onReduced: () => { typer.finish(); },
        });

        return () => {
            stopObserving();
            typer.destroy();
        };
    }, [pinned]);

    return (
        <div className={styles.stepTerm} ref={ref} aria-hidden="true" data-term="inline">
            <div className={styles.bar}>
                <i />
                <i />
                <i />
                <span className={styles.name}>{terminalPath}</span>
            </div>
            <TerminalScreen transcript={transcript} />
        </div>
    );
};
