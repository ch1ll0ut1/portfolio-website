'use client';

import { type FC, useRef } from 'react';
import Link from 'next/link';
import { type CaseStudy, caseStudyPath } from '@/config/caseStudies';
import type { CssVars } from '@/lib/cssVars';
import { useMaskReveal, useReveal } from '@/lib/motion';
import { CaseVisual } from './visuals/CaseVisual';
import styles from './CaseCard.module.css';

interface Props {
    study: CaseStudy;
    /** Position in the stack. Drives the sticky offset so cards fan out. */
    index: number;
    /** True once the next card has slid over this one. */
    covered: boolean;
}

/**
 * One case study, read as problem → what I did → result, with a link to the
 * case's own page for the longer story.
 *
 * `data-stack-card` and `data-stack-inner` are the contract with `caseStack`:
 * it finds the cards by the first and scales the second. `data-reveal` marks
 * the story rows the entrance staggers.
 */
export const CaseCard: FC<Props> = ({ study, index, covered }) => {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const storyRef = useRef<HTMLDListElement>(null);
    // `--i` staggers the sticky offsets; `--dim` is written by the stack effect.
    const vars: CssVars = { '--i': index };

    useMaskReveal(titleRef);
    useReveal(storyRef, { selector: '[data-reveal]', delay: 0.12, stagger: 0.07 });

    return (
        <article className={styles.case} style={vars} data-stack-card={study.id}>
            <div className={styles.inner} data-stack-inner="">
                <div className={styles.text}>
                    <div className={styles.meta}>
                        <span>{study.years}</span>
                        <span>{study.role}</span>
                    </div>
                    <h3 ref={titleRef} className={styles.title}>{study.title}</h3>
                    <p className={styles.client}>{study.client}</p>
                    <dl ref={storyRef} className={styles.story}>
                        <div data-reveal="">
                            <dt>Problem</dt>
                            <dd>{study.problem}</dd>
                        </div>
                        <div data-reveal="">
                            <dt>What I did</dt>
                            <dd>{study.did}</dd>
                        </div>
                        <div data-reveal="">
                            <dt>Result</dt>
                            <dd>{study.result}</dd>
                        </div>
                    </dl>
                    <ul className="tags">
                        {study.tags.map(tag => <li key={tag}>{tag}</li>)}
                    </ul>
                    <div className={styles.links}>
                        <Link className={`${styles.link} ulink`} href={caseStudyPath(study)}>
                            Read the case study
                            {' '}
                            <span className="visually-hidden">{`about ${study.title}`}</span>
                        </Link>
                        {study.link && (
                            <a
                                className={`${styles.link} ${styles.linkSecondary} ulink`}
                                href={study.link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {study.link.label}
                            </a>
                        )}
                    </div>
                </div>
                <CaseVisual id={study.id} metric={study.metric} covered={covered} />
            </div>
        </article>
    );
};
