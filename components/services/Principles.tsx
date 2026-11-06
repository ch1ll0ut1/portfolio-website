'use client';

/**
 * The three working principles, as numbered articles.
 *
 * The number sits in a gutter next to the label, the way a line number sits
 * next to a line of code. Numbering comes from the list order, so the data
 * cannot drift out of sequence.
 */

import { FC, useRef } from 'react';
import { useReveal } from '@/lib/motion';
import { principlesFor } from '@/config/principles';
import { useLocale } from '@/lib/i18n/LocaleContext';
import styles from './WorkingMethod.module.css';

const REVEAL_STAGGER = 0.08;

export const Principles: FC = () => {
    const principlesContent = principlesFor(useLocale());
    const ref = useRef<HTMLDivElement>(null);

    useReveal(ref, { selector: '[data-reveal]', stagger: REVEAL_STAGGER });

    return (
        <div className={styles.principles} ref={ref}>
            <h3 className={styles.label}>{principlesContent.label}</h3>

            <ol className={styles.principleList}>
                {principlesContent.principles.map((principle, index) => (
                    <li className={styles.principle} key={principle.id} data-reveal="">
                        <p className={styles.gutter}>
                            <span className={styles.gutterNumber}>
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <span>{principle.label}</span>
                        </p>

                        <h4>{principle.heading}</h4>

                        {principle.paragraphs.map(paragraph => (
                            <p className={styles.copy} key={paragraph}>{paragraph}</p>
                        ))}
                    </li>
                ))}
            </ol>
        </div>
    );
};
