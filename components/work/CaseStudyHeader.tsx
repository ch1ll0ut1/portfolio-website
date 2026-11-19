import { FC } from 'react';
import Link from 'next/link';
import { MaskHeading } from '@/components/blog/MaskHeading';
import { Reveal } from '@/components/motion/Reveal';
import type { CaseStudy } from '@/config/caseStudies';
import { type CaseStudyDetail, workCopy } from '@/config/caseStudyDetails';
import type { Locale } from '@/lib/i18n/locale';
import { localizedPath } from '@/lib/i18n/paths';
import styles from './CaseStudy.module.css';

interface Props {
    study: CaseStudy;
    detail: CaseStudyDetail;
    locale: Locale;
}

/**
 * The top of a case study: the breadcrumb back to the homepage's work
 * section, the search-facing headline, a plain-language lede, and the key
 * facts beside the case's headline number.
 */
export const CaseStudyHeader: FC<Props> = ({ study, detail, locale }) => {
    const copy = workCopy[locale];

    return (
        <header className={styles.header}>
            <nav aria-label={copy.breadcrumbs.label} className={styles.crumbs}>
                <ol>
                    <li>
                        <Link href={localizedPath(locale, '/')} className={styles.crumb}>{copy.breadcrumbs.home}</Link>
                    </li>
                    <li aria-hidden="true" className={styles.crumbSep}>/</li>
                    <li>
                        <Link href={localizedPath(locale, '/#work')} className={styles.crumb}>{copy.breadcrumbs.work}</Link>
                    </li>
                    <li aria-hidden="true" className={styles.crumbSep}>/</li>
                    <li aria-current="page" className={styles.crumbCurrent}>{study.title}</li>
                </ol>
            </nav>

            <p className={styles.kicker}>{copy.kicker}</p>

            <MaskHeading className={styles.title}>{detail.heading}</MaskHeading>

            <Reveal delay={0.12}>
                <p className={styles.lede}>{detail.lede}</p>
            </Reveal>

            <div className={styles.facts}>
                <dl className={styles.factList}>
                    <div>
                        <dt>{copy.facts.client}</dt>
                        <dd>{study.client}</dd>
                    </div>
                    <div>
                        <dt>{copy.facts.role}</dt>
                        <dd>{study.role}</dd>
                    </div>
                    <div>
                        <dt>{copy.facts.years}</dt>
                        <dd>{study.years}</dd>
                    </div>
                    {detail.team && (
                        <div>
                            <dt>{copy.facts.team}</dt>
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
