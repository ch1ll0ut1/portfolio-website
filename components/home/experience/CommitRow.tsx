'use client';

import { type FC, type PointerEvent, useEffect, useRef } from 'react';
import type { CareerCommit } from '@/config/career';
import { startScramble } from './hashScramble';
import styles from './CommitRow.module.css';

export interface Props {
    commit: CareerCommit;
    /** Bumped to re-roll the hash. 0 means it has not been triggered yet. */
    pulseToken: number;
    /** True once the ink has reached this commit. */
    isReached: boolean;
    /** True while this commit sits on the reading line. */
    isCurrent: boolean;
    isHovered: boolean;
    /** Registers the row with the graph, which measures it. */
    rowRef: (node: HTMLLIElement | null) => void;
    onHover: () => void;
    onLeave: () => void;
}

/**
 * One commit in the log: hash, years and the role itself.
 *
 * The grid's first column is the graph's gutter, so the SVG lanes line up with
 * the rows without either knowing the other's layout. Below 760px the row
 * collapses to two columns and the hash drops out, since a seven-character
 * hash is the least useful thing on a phone.
 */
export const CommitRow: FC<Props> = ({
    commit,
    pulseToken,
    isReached,
    isCurrent,
    isHovered,
    rowRef,
    onHover,
    onLeave,
}) => {
    const hashRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const node = hashRef.current;

        if (pulseToken === 0 || !node) {
            return;
        }

        return startScramble(node);
    }, [pulseToken]);

    const handlePointerEnter = (event: PointerEvent<HTMLLIElement>) => {
        // Mouse only: on touch, `pointerenter` fires on tap and would light up
        // a row the reader never pointed at.
        if (event.pointerType === 'mouse') {
            onHover();
        }
    };

    const className = [
        styles.commit,
        isReached ? styles.isReached : '',
        isCurrent ? styles.isCurrent : '',
        isHovered ? styles.isHovered : '',
    ].join(' ');

    return (
        <li
            className={className}
            data-branch={commit.branch}
            ref={rowRef}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={onLeave}
        >
            <span className={styles.hash} ref={hashRef}>{commit.hash}</span>
            <span className={styles.years} data-graph-anchor="">{commit.years}</span>

            <div className={styles.body}>
                <h3>
                    {commit.ref && (
                        <span
                            className={`${styles.ref} ${commit.ref.isHead ? styles.refHead : ''}`}
                            aria-hidden="true"
                        >
                            {commit.ref.label}
                        </span>
                    )}
                    {commit.title}
                </h3>
                <p>{commit.description}</p>
            </div>
        </li>
    );
};
