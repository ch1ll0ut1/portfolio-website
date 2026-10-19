import { type FC } from 'react';
import { FeatureCycle } from './FeatureCycle';
import { FitLists } from './FitLists';
import { Principles } from './Principles';
import { ProcessStepper } from './ProcessStepper';
import styles from './Process.module.css';

/**
 * The process section: a pinned four-step stepper, then three quieter blocks.
 */
export const Process: FC = () => (
    <section className={styles.process} id="process" aria-labelledby="process-title">
        <ProcessStepper />

        <div className={`wrap ${styles.secondary}`}>
            <Principles />
            <FeatureCycle />
            <FitLists />
        </div>
    </section>
);
