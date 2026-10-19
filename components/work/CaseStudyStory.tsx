import { FC } from 'react';
import type { CaseStudy } from '@/config/caseStudies';
import type { CaseStudyDetail } from '@/config/caseStudyDetails';
import styles from './CaseStudy.module.css';

interface Props {
    study: CaseStudy;
    detail: CaseStudyDetail;
}

/**
 * The case told as problem → what I did → result, in plain words, with the
 * engineering detail and the stack last for readers who want them.
 */
export const CaseStudyStory: FC<Props> = ({ study, detail }) => {
    return (
        <>
            <section className={styles.section} aria-labelledby="case-problem">
                <h2 id="case-problem" className={styles.sectionTitle}>Problem</h2>
                <div className={styles.body}>
                    {detail.problem.map(text => <p key={text}>{text}</p>)}
                </div>
            </section>

            <section className={styles.section} aria-labelledby="case-did">
                <h2 id="case-did" className={styles.sectionTitle}>What I did</h2>
                <ul className={`${styles.body} ${styles.points}`}>
                    {detail.did.map(text => <li key={text}>{text}</li>)}
                </ul>
            </section>

            <section className={styles.section} aria-labelledby="case-result">
                <h2 id="case-result" className={styles.sectionTitle}>Result</h2>
                <div className={styles.body}>
                    {detail.result.map(text => <p key={text}>{text}</p>)}
                </div>
            </section>

            <section className={styles.section} aria-labelledby="case-stack">
                <h2 id="case-stack" className={styles.sectionTitle}>Stack</h2>
                <div className={styles.body}>
                    {detail.technical.map(text => <p key={text}>{text}</p>)}
                    <ul className="tags">
                        {study.tags.map(tag => <li key={tag}>{tag}</li>)}
                    </ul>
                    {study.link && (
                        <a
                            className={`${styles.source} ulink`}
                            href={study.link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {study.link.label}
                        </a>
                    )}
                </div>
            </section>
        </>
    );
};
