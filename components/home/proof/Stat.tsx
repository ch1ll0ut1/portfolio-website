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

/** Where the entrance is: at rest on the final number, armed on the start digits, or rolling. */
type Phase = 'rest' | 'armed' | 'in';

export const Stat: FC<Props> = ({ stat, index }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [phase, setPhase] = useState<Phase>('rest');

    const roll = () => {
        setPhase('in');
    };

    useInView(ref, {
        // Armed while still below the fold, so the reels already sit on their
        // starting digits when the stat scrolls into view and the roll starts
        // from what the visitor sees. Without the arm step the final number
        // showed first and snapped back when the roll began.
        onArm: () => {
            setPhase('armed');
        },
        onEnter: roll,
        // On screen at load: the final number shows until the page intro,
        // then the roll starts from its first frame, as in the prototype.
        onIntro: roll,
        // Reduced motion never arms, so the final number simply stays.
        onReduced: () => undefined,
    });

    const classes = [styles.stat, phase === 'armed' && styles.isArmed, phase === 'in' && styles.isIn]
        .filter(Boolean)
        .join(' ');
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
