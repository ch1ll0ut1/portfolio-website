'use client';

import { type FC } from 'react';
import { careerLog } from '@/config/career';
import { CareerGraph } from './CareerGraph';
import { CommitRow } from './CommitRow';
import { useCareerLog } from './useCareerLog';
import styles from './Experience.module.css';

/**
 * The history as an ordered list of real text, beside the decorative graph
 * that draws the same two lanes and reveals them as the page scrolls.
 */
export const CareerLog: FC = () => {
    const {
        logRef,
        inkRef,
        headRef,
        rowRefs,
        geometry,
        pulses,
        showHead,
        reached,
        current,
        hovered,
        hover,
        endHover,
    } = useCareerLog(careerLog.length);

    return (
        <div className={styles.log} ref={logRef}>
            <CareerGraph
                geometry={geometry}
                pulses={pulses}
                showHead={showHead}
                inkRef={inkRef}
                headRef={headRef}
            />

            <ol className={styles.list}>
                {careerLog.map((commit, index) => (
                    <CommitRow
                        key={commit.hash}
                        commit={commit}
                        pulseToken={pulses[index] ?? 0}
                        isReached={index <= reached}
                        isCurrent={index === current}
                        isHovered={index === hovered}
                        rowRef={rowRefs[index]}
                        onHover={() => { hover(index); }}
                        onLeave={endHover}
                    />
                ))}
            </ol>
        </div>
    );
};
