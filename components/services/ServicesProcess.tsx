import { type FC } from 'react';
import type { ServicesPageCopy } from '@/config/services/types';
import styles from './ServicesPage.module.css';

interface Props {
    copy: ServicesPageCopy;
}

/** "How it works": the four steps every engagement runs through, numbered in order. */
export const ServicesProcess: FC<Props> = ({ copy }) => (
    <section className={styles.band} aria-labelledby="process-title">
        <div className={styles.bandHead}>
            <h2 id="process-title">{copy.process.title}</h2>
            <p>{copy.process.lede}</p>
        </div>
        <ol className={styles.processSteps}>
            {copy.process.steps.map((step, index) => (
                <li key={step.title}>
                    <span className={styles.stepNumber} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                </li>
            ))}
        </ol>
    </section>
);
