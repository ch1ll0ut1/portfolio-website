import { type FC } from 'react';
import Link from 'next/link';
import { caseStudies, caseStudyPath } from '@/config/caseStudies';
import type { ServicesPageCopy } from '@/config/services/types';
import styles from './ServicesPage.module.css';

interface Props {
    copy: ServicesPageCopy;
}

/**
 * A few case studies, told as outcomes, each linking on to its own page. The
 * project names come from `config/caseStudies.ts`.
 */
export const Outcomes: FC<Props> = ({ copy }) => (
    <section className={styles.band} aria-labelledby="outcomes-title">
        <div className={styles.bandHead}>
            <h2 id="outcomes-title">{copy.outcomes.title}</h2>
            <p>{copy.outcomes.lede}</p>
        </div>
        <ul className={styles.outcomes}>
            {copy.outcomes.items.map((item) => {
                const study = caseStudies.find(candidate => candidate.id === item.caseId);
                const title = study?.title ?? item.caseId;

                return (
                    <li key={item.caseId} className={styles.outcome}>
                        <h3>{title}</h3>
                        <p className={styles.outcomeClient}>{item.client}</p>
                        <p>{item.outcome}</p>
                        {study && (
                            <Link className={`${styles.outcomeLink} ulink`} href={caseStudyPath(study)}>
                                {copy.outcomes.linkLabel}
                                <span className="visually-hidden">{`: ${title}`}</span>
                            </Link>
                        )}
                    </li>
                );
            })}
        </ul>
    </section>
);
