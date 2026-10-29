import { type FC } from 'react';
import { proofCopy } from '@/config/home/proof';
import { proofStatsFor } from '@/config/proof';
import type { Locale } from '@/lib/i18n/locale';
import { Marquee } from './Marquee';
import { Stat } from './Stat';
import styles from './Proof.module.css';

/**
 * Proof: the organisations the work was for, then the numbers behind the pitch.
 *
 * Sits directly under the hero, which is where a consultant site has to put its
 * evidence.
 */
interface Props {
    locale: Locale;
}

export const Proof: FC<Props> = ({ locale }) => (
    <section className={styles.proof} id="proof" data-section="proof" aria-labelledby="proof-title">
        <h2 className="visually-hidden" id="proof-title">{proofCopy[locale].heading}</h2>

        <Marquee names={proofCopy[locale].clients} />

        <div className="wrap">
            <dl className={styles.stats}>
                {proofStatsFor(locale).map((stat, index) => (
                    <Stat key={stat.id} stat={stat} index={index} />
                ))}
            </dl>
        </div>
    </section>
);
