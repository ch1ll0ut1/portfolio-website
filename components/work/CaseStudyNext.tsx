import { FC } from 'react';
import Link from 'next/link';
import { type CaseStudy, caseStudies, caseStudyPath } from '@/config/caseStudies';
import { caseStudyDetails } from '@/config/caseStudyDetails';
import styles from './CaseStudy.module.css';

interface Props {
    /** The case on this page, left out of the list of others. */
    current: CaseStudy;
}

/**
 * The end of a case study: what to do next if the reader has a project of
 * their own, then the other case studies.
 */
export const CaseStudyNext: FC<Props> = ({ current }) => {
    const others = caseStudies.filter(study => study.id !== current.id);

    return (
        <>
            <section className={styles.next} aria-labelledby="case-next">
                <h2 id="case-next" className={styles.nextTitle}>Have a project like this?</h2>
                <p className={styles.nextBody}>
                    I build new apps, fix broken ones, and lead your developers. Tell me what you are working on,
                    and I will tell you honestly whether I am the right fit.
                </p>
                <div className={styles.actions}>
                    <Link href="/services" className="btn btn--primary">
                        <span className="btn__label">How I can help</span>
                    </Link>
                    <Link href="/contact" className="btn">
                        <span className="btn__label">Get in touch</span>
                    </Link>
                </div>
            </section>

            <nav className={styles.others} aria-labelledby="case-others">
                <h2 id="case-others" className={styles.othersTitle}>More case studies</h2>
                <ul className={styles.otherList}>
                    {others.map(study => (
                        <li key={study.id}>
                            <Link href={caseStudyPath(study)} className={styles.otherLink}>
                                <span className={styles.otherClient}>{study.title}</span>
                                <span className={styles.otherTitle}>{caseStudyDetails[study.id].heading}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    );
};
