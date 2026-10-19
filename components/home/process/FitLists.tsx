'use client';

/**
 * Who the engagement suits and who it does not.
 *
 * The markers carry the brand rather than icons: a caret standing where a line
 * would be picked up for the fits, the same mark struck through for the
 * mismatches.
 */

import { FC, useRef } from 'react';
import { useMaskReveal, useReveal } from '@/lib/motion';
import { type FitTone, fitContent } from '@/config/fit';
import styles from './ProcessBlocks.module.css';

const REVEAL_STAGGER = 0.08;

export const FitLists: FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);

    useMaskReveal(headingRef, { intro: false });
    useReveal(ref, { selector: '[data-reveal]', stagger: REVEAL_STAGGER });

    return (
        <div className={styles.fit} ref={ref}>
            <div className={styles.head}>
                <p className={styles.label}>{fitContent.label}</p>
                <h3 ref={headingRef}>{fitContent.heading}</h3>
                <p className={styles.lede}>{fitContent.intro}</p>
            </div>

            <div className={styles.fitLists}>
                {fitContent.lists.map(list => (
                    <div className={styles.fitList} key={list.id} data-reveal="">
                        <h4>{list.title}</h4>

                        <ul className={`${styles.fitItems} ${toneClass(list.tone)}`}>
                            {list.items.map(item => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

const toneClass = (tone: FitTone) => (tone === 'fit' ? styles.isFit : styles.isUnfit);
