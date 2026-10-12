'use client';

import { type FC, useRef } from 'react';
import { useMaskReveal, useReveal } from '@/lib/motion';
import { careerLog } from '@/config/career';
import { CareerGraph } from './CareerGraph';
import { CommitRow } from './CommitRow';
import { useCareerLog } from './useCareerLog';
import styles from './Experience.module.css';

/** Matches the sub-line's beat in the other sections' entrances. */
const LEAD_DELAY = 0.15;

/**
 * Experience: eighteen years of roles printed as a `git log --graph`.
 *
 * The history is an ordered list of real text, so it reads with JavaScript off
 * and in a screen reader. The graph beside it is decorative: it draws the same
 * two lanes the list already describes, and reveals them as the page scrolls.
 */
export const Experience: FC = () => {
    const headingRef = useRef<HTMLHeadingElement>(null);
    const leadRef = useRef<HTMLParagraphElement>(null);
    const log = useCareerLog(careerLog.length);

    useMaskReveal(headingRef);
    useReveal(leadRef, { delay: LEAD_DELAY });

    return (
        <section className="section" id="experience" data-section="experience" aria-labelledby="experience-title">
            <div className="wrap">
                <header className="sec-head">
                    <h2 id="experience-title" ref={headingRef}>Eighteen years, one log</h2>
                    <p ref={leadRef}>
                        Every role, newest first. Independent work since 2020 forks off main onto its own branch.
                    </p>
                </header>

                <div className={styles.log} ref={log.logRef}>
                    <CareerGraph
                        geometry={log.geometry}
                        pulses={log.pulses}
                        showHead={log.showHead}
                        inkRef={log.inkRef}
                        headRef={log.headRef}
                    />

                    <ol className={styles.list}>
                        {careerLog.map((commit, index) => (
                            <CommitRow
                                key={commit.hash}
                                commit={commit}
                                pulseToken={log.pulses[index]}
                                isReached={index <= log.reached}
                                isCurrent={index === log.current}
                                isHovered={index === log.hovered}
                                rowRef={log.rowRefs[index]}
                                onHover={() => { log.hover(index); }}
                                onLeave={log.endHover}
                            />
                        ))}
                    </ol>
                </div>
            </div>
        </section>
    );
};
