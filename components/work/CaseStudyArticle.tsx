import { FC } from 'react';
import type { CaseStudy } from '@/config/caseStudies';
import { caseStudyDetails } from '@/config/caseStudyDetails';
import { CaseStudyHeader } from './CaseStudyHeader';
import { CaseStudyNext } from './CaseStudyNext';
import { CaseStudyStory } from './CaseStudyStory';
import styles from './CaseStudy.module.css';

interface Props {
    study: CaseStudy;
}

/** The body of a `/work/[slug]` page, inside the reading shell's `<main>`. */
export const CaseStudyArticle: FC<Props> = ({ study }) => {
    const detail = caseStudyDetails[study.id];

    return (
        <div className="wrap">
            <div className={styles.page}>
                <article>
                    <CaseStudyHeader study={study} detail={detail} />
                    <CaseStudyStory study={study} detail={detail} />
                </article>
                <CaseStudyNext current={study} />
            </div>
        </div>
    );
};
