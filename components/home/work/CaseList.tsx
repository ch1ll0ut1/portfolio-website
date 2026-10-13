'use client';

import { type FC, useCallback, useRef, useState } from 'react';
import { caseStudies } from '@/config/caseStudies';
import { CaseCard } from './CaseCard';
import { useCaseStack } from './caseStack';
import styles from './Work.module.css';

/**
 * The four case studies, stacking as you scroll: each sticks under the header
 * while the next slides over it, settling back and dimming.
 *
 * Which card is covered is held here, because that is what tells an
 * illustration to pause.
 */
export const CaseList: FC = () => {
    const casesRef = useRef<HTMLDivElement>(null);
    const [covered, setCovered] = useState<readonly boolean[]>(() => caseStudies.map(() => false));

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
        <div ref={casesRef} className={styles.cases}>
            {caseStudies.map((study, index) => (
                <CaseCard
                    key={study.id}
                    study={study}
                    index={index}
                    covered={covered[index] ?? false}
                />
            ))}
        </div>
    );
};
