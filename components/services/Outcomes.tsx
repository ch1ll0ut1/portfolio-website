import { type FC } from 'react';
import { caseStudies } from '@/config/caseStudies';
import type { ServicesPageCopy } from '@/config/services/types';
import styles from './ServicesPage.module.css';

interface Props {
    copy: ServicesPageCopy;
}

/** A few case studies, told as outcomes. The project names come from `config/caseStudies.ts`. */
export const Outcomes: FC<Props> = ({ copy }) => (
    <section className={styles.band} aria-labelledby="outcomes-title">
        <div className={styles.bandHead}>
            <h2 id="outcomes-title">{copy.outcomes.title}</h2>
            <p>{copy.outcomes.lede}</p>
        </div>
        <ul className={styles.outcomes}>
            {copy.outcomes.items.map(item => (
                <li key={item.caseId} className={styles.outcome}>
                    <h3>{caseTitle(item.caseId)}</h3>
                    <p className={styles.outcomeClient}>{item.client}</p>
                    <p>{item.outcome}</p>
                </li>
            ))}
        </ul>
    </section>
);

const caseTitle = (id: string) => caseStudies.find(study => study.id === id)?.title ?? id;
