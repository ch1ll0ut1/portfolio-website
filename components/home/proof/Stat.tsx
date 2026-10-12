'use client';

import { type FC, useRef, useState } from 'react';
import type { ProofStat } from '@/config/proof';
import { useInView } from '@/lib/motion';
import type { CssVars } from '@/lib/cssVars';
import { StatOdometer } from './StatOdometer';
import styles from './Proof.module.css';

interface Props {
    stat: ProofStat;
    /** Position in the row. Drives the entrance stagger. */
    index: number;
}

export const Stat: FC<Props> = ({ stat, index }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [rolling, setRolling] = useState(false);

    const roll = () => {
        setRolling(true);
    };

    useInView(ref, {
        // No arm step: the number rests on its final value, and the starting
        // digits only ever exist inside the entrance animation. An entrance
        // that never runs leaves the correct number on screen.
        onEnter: roll,
        onIntro: roll,
        onReduced: () => undefined,
    });

    const classes = rolling ? `${styles.stat} ${styles.isIn}` : styles.stat;
    const vars: CssVars = { '--si': index };

    return (
        <div className={classes} ref={ref} style={vars}>
            <dt className={styles.label}>{stat.label}</dt>
            <dd className={styles.value}>
                <StatOdometer stat={stat} />
            </dd>
        </div>
    );
};
