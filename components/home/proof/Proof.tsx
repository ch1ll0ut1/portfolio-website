import { type FC } from 'react';
import { proofClients, proofStats } from '@/config/proof';
import { Marquee } from './Marquee';
import { Stat } from './Stat';
import styles from './Proof.module.css';

/**
 * Proof: the organisations the work was for, then the numbers behind the pitch.
 *
 * Sits directly under the hero, which is where a consultant site has to put its
 * evidence.
 */
export const Proof: FC = () => (
    <section className={styles.proof} id="proof" data-section="proof" aria-labelledby="proof-title">
        <h2 className="visually-hidden" id="proof-title">Teams and organizations I have built for</h2>

        <Marquee names={proofClients} />

        <div className="wrap">
            <dl className={styles.stats}>
                {proofStats.map((stat, index) => (
                    <Stat key={stat.id} stat={stat} index={index} />
                ))}
            </dl>
        </div>
    </section>
);
