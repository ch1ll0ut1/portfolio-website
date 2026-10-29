import { FC } from 'react';
import Link from 'next/link';
import { MaskHeading } from '@/components/blog/MaskHeading';
import { Reveal } from '@/components/motion/Reveal';
import type { CaseStudy } from '@/config/caseStudies';
import type { CaseStudyDetail } from '@/config/caseStudyDetails';
import styles from './CaseStudy.module.css';

interface Props {
    study: CaseStudy;
    detail: CaseStudyDetail;
}

/**
 * The top of a case study: the breadcrumb back to the homepage's work
 * section, the search-facing headline, a plain-language lede, and the key
 * facts beside the case's headline number.
 */
export const CaseStudyHeader: FC<Props> = ({ study, detail }) => {
    return (
        <header className={styles.header}>
            <nav aria-label="Breadcrumb" className={styles.crumbs}>
                <ol>
                    <li>
                        <Link href="/" className={styles.crumb}>Home</Link>
                    </li>
                    <li aria-hidden="true" className={styles.crumbSep}>/</li>
                    <li>
                        <Link href="/#work" className={styles.crumb}>Work</Link>
                    </li>
                    <li aria-hidden="true" className={styles.crumbSep}>/</li>
                    <li aria-current="page" className={styles.crumbCurrent}>{study.title}</li>
                </ol>
            </nav>

            <p className={styles.kicker}>Case study</p>

            <MaskHeading className={styles.title}>{detail.heading}</MaskHeading>

            <Reveal delay={0.12}>
                <p className={styles.lede}>{detail.lede}</p>
            </Reveal>

            <div className={styles.facts}>
                <dl className={styles.factList}>
                    <div>
                        <dt>Client</dt>
                        <dd>{study.client}</dd>
                    </div>
                    <div>
                        <dt>Role</dt>
                        <dd>{study.role}</dd>
                    </div>
                    <div>
                        <dt>Years</dt>
                        <dd>{study.years}</dd>
                    </div>
                    {detail.team && (
                        <div>
                            <dt>Team</dt>
                            <dd>{detail.team}</dd>
                        </div>
                    )}
                </dl>
                <p className={styles.metric}>
                    <span className={styles.metricValue}>{study.metric.value}</span>
                    <span className={styles.metricLabel}>{study.metric.label}</span>
                </p>
            </div>
        </header>
    );
};
