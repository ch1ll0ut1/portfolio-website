import { FC } from 'react';
import Link from 'next/link';
import { type CaseStudy, caseStudiesFor, caseStudyPath } from '@/config/caseStudies';
import { workCopy } from '@/config/caseStudyDetails';
import { links } from '@/config/links';
import type { Locale } from '@/lib/i18n/locale';
import { localizedPath } from '@/lib/i18n/paths';
import styles from './CaseStudy.module.css';

interface Props {
    /** The case on this page, left out of the list of others. */
    current: CaseStudy;
    locale: Locale;
}

/**
 * The end of a case study: what to do next if the reader has a project of
 * their own (a call first, the services second, the form as a quiet third),
 * then the other case studies.
 */
export const CaseStudyNext: FC<Props> = ({ current, locale }) => {
    const copy = workCopy[locale];
    const others = caseStudiesFor(locale).filter(study => study.id !== current.id);

    return (
        <>
            <section className={styles.next} aria-labelledby="case-next">
                <h2 id="case-next" className={styles.nextTitle}>{copy.next.title}</h2>
                <p className={styles.nextBody}>{copy.next.body}</p>
                <div className={styles.actions}>
                    <a href={links.calendly} className="btn btn--primary" target="_blank" rel="noopener noreferrer">
                        <span className="btn__label">{copy.next.book}</span>
                    </a>
                    <Link href={localizedPath(locale, '/services')} className="btn">
                        <span className="btn__label">{copy.next.services}</span>
                    </Link>
                </div>
                <p className={styles.nextAlt}>
                    <Link href={localizedPath(locale, '/contact?topic=project')} className={styles.nextAltLink}>
                        {copy.next.contact}
                    </Link>
                </p>
            </section>

            <nav className={styles.others} aria-labelledby="case-others">
                <h2 id="case-others" className={styles.othersTitle}>{copy.next.others}</h2>
                <ul className={styles.otherList}>
                    {others.map(study => (
                        <li key={study.id}>
                            <Link href={localizedPath(locale, caseStudyPath(study))} className={styles.otherLink}>
                                <span className={styles.otherClient}>{study.title}</span>
                                <span className={styles.otherTitle}>{copy.details[study.id].heading}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    );
};
