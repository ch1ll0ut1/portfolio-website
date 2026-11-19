import { type FC } from 'react';
import type { ServicesPageCopy } from '@/config/services/types';
import pageStyles from './ServicesPage.module.css';
import styles from './FitSection.module.css';

interface Props {
    copy: ServicesPageCopy;
}

/** Who the work suits and who it does not; in English, straight from `config/fit.ts`. */
export const FitSection: FC<Props> = ({ copy }) => (
    <section className={pageStyles.band} aria-labelledby="fit-title">
        <div className={pageStyles.bandHead}>
            <h2 id="fit-title">{copy.fit.title}</h2>
        </div>
        <div className={styles.fitLists}>
            <div>
                <h3>{copy.fit.goodTitle}</h3>
                <ul className={`${styles.fitItems} ${styles.isFit}`}>
                    {copy.fit.good.map(item => <li key={item}>{item}</li>)}
                </ul>
            </div>
            <div>
                <h3>{copy.fit.notTitle}</h3>
                <ul className={`${styles.fitItems} ${styles.isUnfit}`}>
                    {copy.fit.not.map(item => <li key={item}>{item}</li>)}
                </ul>
            </div>
        </div>
    </section>
);
