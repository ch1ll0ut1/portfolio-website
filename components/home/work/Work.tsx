'use client';

import { type FC, useCallback, useRef, useState } from 'react';
import { caseStudies } from '@/config/caseStudies';
import { useMaskReveal, useReveal } from '@/lib/motion';
import { CaseCard } from './CaseCard';
import { MoreProjects } from './MoreProjects';
import { useCaseStack } from './caseStack';
import styles from './Work.module.css';

/**
 * Selected work.
 *
 * The four case studies stack as you scroll: each sticks under the header
 * while the next slides over it, settling back and dimming. Which card is
 * covered is held here, because that is what tells an illustration to pause.
 */
export const Work: FC = () => {
    const headingRef = useRef<HTMLHeadingElement>(null);
    const leadRef = useRef<HTMLParagraphElement>(null);
    const casesRef = useRef<HTMLDivElement>(null);
    const [covered, setCovered] = useState<readonly boolean[]>(() => caseStudies.map(() => false));

    useMaskReveal(headingRef);
    useReveal(leadRef, { delay: 0.15 });

    const handleCovered = useCallback((index: number, value: boolean) => {
        setCovered((current) => {
            if (current[index] === value) {
                return current;
            }

            const next = [...current];

            next[index] = value;

            return next;
        });
    }, []);

    useCaseStack(casesRef, handleCovered);

    return (
        <section className="section" id="work" aria-labelledby="work-title">
            <div className="wrap">
                <header className="sec-head">
                    <h2 ref={headingRef} id="work-title">Selected work</h2>
                    <p ref={leadRef}>
                        Four projects where the difficult part was the whole point: structured
                        documents, typed data across three APIs, a department built from nothing,
                        and a messaging system under load.
                    </p>
                </header>

                <div ref={casesRef} className={styles.cases}>
                    {caseStudies.map((study, index) => (
                        <CaseCard
                            key={study.id}
                            study={study}
                            index={index}
                            covered={covered[index]}
                        />
                    ))}
                </div>

                <MoreProjects />
            </div>
        </section>
    );
};
