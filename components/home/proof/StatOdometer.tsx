import { type FC } from 'react';
import type { ProofStat } from '@/config/proof';
import type { CssVars } from '@/lib/cssVars';
import { buildReels } from './digitReels';
import styles from './Proof.module.css';

interface Props {
    stat: ProofStat;
}

/**
 * One stat's number as a digit-reel odometer.
 *
 * The reels are decorative: the real value sits in a visually hidden span, so
 * screen readers and crawlers get `2008`, not a column of loose digits.
 */
export const StatOdometer: FC<Props> = ({ stat }) => {
    const { prefix = '', suffix = '' } = stat;
    const reels = buildReels(stat.value, stat.from);

    return (
        <>
            <span className="visually-hidden">{`${prefix}${stat.value}${suffix}`}</span>
            <span className={styles.odo} aria-hidden="true">
                {prefix && <span className={styles.affix}>{prefix}</span>}
                {reels.map((reel, column) => {
                    const vars: CssVars = { '--n': reel.offset, '--k': reel.weight };

                    return (
                        <span className={styles.col} data-odometer-column={column} key={column}>
                            <span className={styles.reel} style={vars}>
                                {reel.digits.map((digit, step) => (
                                    <span className={styles.digit} key={step}>{digit}</span>
                                ))}
                            </span>
                        </span>
                    );
                })}
                {suffix && <span className={styles.affix}>{suffix}</span>}
            </span>
        </>
    );
};
