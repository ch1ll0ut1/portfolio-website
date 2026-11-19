import { FC } from 'react';
import type { CaseStudy } from '@/config/caseStudies';
import { caseStudyDetailsFor } from '@/config/caseStudyDetails';
import type { Locale } from '@/lib/i18n/locale';
import { CaseStudyHeader } from './CaseStudyHeader';
import { CaseStudyNext } from './CaseStudyNext';
import { CaseStudyStory } from './CaseStudyStory';
import styles from './CaseStudy.module.css';

interface Props {
    study: CaseStudy;
    locale: Locale;
}

/** The body of a case study page, inside the reading shell's `<main>`. */
export const CaseStudyArticle: FC<Props> = ({ study, locale }) => {
    const detail = caseStudyDetailsFor(locale)[study.id];

    return (
        <div className="wrap">
            <div className={styles.page}>
                <article>
                    <CaseStudyHeader study={study} detail={detail} locale={locale} />
                    <CaseStudyStory study={study} detail={detail} locale={locale} />
                </article>
                <CaseStudyNext current={study} locale={locale} />
            </div>
        </div>
    );
};
