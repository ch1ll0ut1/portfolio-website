'use client';

/**
 * The nine-step feature cycle that runs inside the stepper's "Build" step.
 *
 * The `bridge` line is load-bearing: without it a four-step process and a
 * nine-step process on the same page read as a contradiction instead of as one
 * nested inside the other. Kept to a dense strip for the same reason — it is
 * detail under the stepper, not a rival to it.
 */

import { FC, useRef } from 'react';
import { useMaskReveal, useReveal } from '@/lib/motion';
import { featureCycleContent } from '@/config/featureCycle';
import styles from './ProcessBlocks.module.css';

const REVEAL_STAGGER = 0.035;

export const FeatureCycle: FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);

    useMaskReveal(headingRef, { intro: false });
    useReveal(ref, { selector: '[data-reveal]', stagger: REVEAL_STAGGER });

    return (
        <div className={styles.cycle} ref={ref}>
            <div className={styles.head}>
                <p className={styles.label}>{featureCycleContent.label}</p>
                <h3 ref={headingRef}>{featureCycleContent.heading}</h3>
                <p className={styles.lede}>{featureCycleContent.bridge}</p>
                <p className={styles.lede}>{featureCycleContent.intro}</p>
            </div>

            <ol className={styles.cycleList}>
                {featureCycleContent.steps.map((step, index) => (
                    <li className={styles.cycleStep} key={step.id} data-reveal="">
                        <span className={styles.cycleNumber} aria-hidden="true">
                            {String(index + 1).padStart(2, '0')}
                        </span>

                        <div>
                            <p className={styles.cycleTitle}>{step.title}</p>
                            <p className={styles.cycleDesc}>{step.description}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
};
