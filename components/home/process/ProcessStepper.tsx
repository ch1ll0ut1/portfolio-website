'use client';

/**
 * The process section's pinned four-step stepper.
 *
 * Signature moment: the stepper is pinned while a 340vh track scrolls past, and
 * a terminal types a short transcript for whichever step the scroll has reached.
 *
 * Two modes, one predicate. `pinned` is true only at desktop width with motion
 * allowed; it decides whether the scroll drives the stepper or every step just
 * reads at rest with its own inline terminal. The *layout* for those two modes
 * comes from the media queries in `Process.module.css`, not from this boolean:
 * swapping the markup on a client-only check would mean a 340vh track appearing
 * after hydration on every desktop load, and nothing at all without JavaScript.
 */

import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
    REDUCED_MOTION_QUERY,
    clamp,
    mapRange,
    observeInView,
    prefersReducedMotion,
    useScrub,
    watchMedia,
} from '@/lib/motion';
import { processSteps, processTitle } from '@/config/processSteps';
import { StepList } from './StepList';
import { Terminal } from './Terminal';
import { scrambleInto } from './scramble';
import { type Typer, createTyper } from './typer';
import styles from './Process.module.css';

const PINNED_QUERY = '(min-width: 901px)';

/**
 * Dead zones at each end of the track. The pin settles before the first step
 * commits and holds after the last, so the sequence does not feel twitchy as
 * the sticky element arrives and leaves.
 */
const TRACK_START = 0.12;
const TRACK_END = 0.88;

export const ProcessStepper: FC = () => {
    const trackRef = useRef<HTMLDivElement>(null);
    const termRef = useRef<HTMLDivElement>(null);
    const typersRef = useRef<Typer[]>([]);
    const visitedRef = useRef(new Set<number>());
    const unscrambleRef = useRef<(() => void) | null>(null);
    const indexRef = useRef(0);

    const [pinned, setPinned] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    // One typer per screen, built from the rendered markup.
    useEffect(() => {
        const term = termRef.current;

        if (!term) {
            return;
        }

        const typers = Array.from(term.querySelectorAll<HTMLElement>('[data-screen]')).map(screen => createTyper(screen, {
            off: styles.off,
            caret: styles.caret,
            caretIdle: styles.caretIdle,
        }));

        typersRef.current = typers;

        return () => {
            typersRef.current = [];
            typers.forEach((typer) => {
                typer.destroy();
            });
        };
    }, []);

    useEffect(() => {
        const sync = () => {
            setPinned(window.matchMedia(PINNED_QUERY).matches && !prefersReducedMotion());
        };

        sync();

        const stopWidth = watchMedia(PINNED_QUERY, sync);
        const stopMotion = watchMedia(REDUCED_MOTION_QUERY, sync);

        return () => {
            stopWidth();
            stopMotion();
        };
    }, []);

    // Leaving the pinned mode hands the transcripts back to the reader whole.
    useEffect(() => {
        if (pinned) {
            return;
        }

        typersRef.current.forEach((typer) => {
            typer.finish();
        });
    }, [pinned]);

    const scramble = useCallback((index: number) => {
        const heading = trackRef.current?.querySelectorAll<HTMLElement>('[data-step-title]').item(index);
        const step = processSteps.at(index);

        if (!heading || !step || prefersReducedMotion()) {
            return;
        }

        unscrambleRef.current?.();
        unscrambleRef.current = scrambleInto(heading, step.title);
    }, []);

    const setStep = useCallback((next: number) => {
        const previous = indexRef.current;

        if (next === previous) {
            return;
        }

        indexRef.current = next;
        setActiveIndex(next);

        const typers = typersRef.current;

        // The step being left shows its whole transcript rather than freezing
        // halfway through a line.
        typers.at(previous)?.finish();
        scramble(next);
        typers.at(next)?.type(visitedRef.current.has(next));
        visitedRef.current.add(next);
    }, [scramble]);

    const apply = useCallback((progress: number) => {
        if (!pinned) {
            return;
        }

        const travelled = clamp(mapRange(progress, TRACK_START, TRACK_END, 0, 1), 0, 1);

        trackRef.current?.style.setProperty('--p', travelled.toFixed(4));
        setStep(Math.min(processSteps.length - 1, Math.floor(travelled * processSteps.length)));
    }, [pinned, setStep]);

    useScrub(trackRef, apply, { start: 0, end: 1 });

    /**
     * The scrub only reports changes, so a page that loads already scrolled
     * into the track — or a viewport that grows into the pinned mode — would
     * sit at step one until the next scroll. Sync once on the way in.
     */
    useEffect(() => {
        const track = trackRef.current;

        if (!pinned || !track) {
            return;
        }

        const rect = track.getBoundingClientRect();
        const travel = rect.height - window.innerHeight;

        apply(travel > 0 ? clamp(-rect.top / travel, 0, 1) : 0);
    }, [pinned, apply]);

    // First arrival: the opening transcript waits until the terminal is really
    // on screen, so it is never already typed by the time it is read.
    useEffect(() => {
        const term = termRef.current;

        if (!term || !pinned) {
            return;
        }

        let armed = false;

        return observeInView(term, {
            onArm: () => {
                if (indexRef.current === 0) {
                    armed = true;
                    typersRef.current.at(0)?.clear();
                }
            },
            onEnter: () => {
                if (!armed || indexRef.current !== 0) {
                    return;
                }

                armed = false;
                visitedRef.current.add(0);
                typersRef.current.at(0)?.type(false);
            },
            // Already on screen, so the transcript is rendered and readable.
            // Leave it alone instead of clearing it to type from scratch.
            onIntro: () => undefined,
            onReduced: () => undefined,
        });
    }, [pinned]);

    useEffect(() => () => {
        unscrambleRef.current?.();
    }, []);

    return (
        <div className={styles.track} ref={trackRef} data-process-track="">
            <div className={styles.sticky}>
                <div className={`wrap ${styles.grid}`}>
                    <div>
                        <h2 className={styles.title} id="process-title">{processTitle}</h2>
                        <StepList steps={processSteps} activeIndex={activeIndex} pinned={pinned} />
                    </div>

                    <Terminal steps={processSteps} activeIndex={activeIndex} rootRef={termRef} />
                </div>
            </div>
        </div>
    );
};
