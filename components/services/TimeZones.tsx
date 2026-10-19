import { type FC } from 'react';
import type { ServicesPageCopy } from '@/config/services/types';
import styles from './ServicesPage.module.css';

interface Props {
    copy: ServicesPageCopy;
}

/** "Your time zone, your language": the hours covered from Bangkok, the two languages, and data protection. */
export const TimeZones: FC<Props> = ({ copy }) => (
    <section className={styles.band} aria-labelledby="zones-title">
        <div className={styles.bandHead}>
            <h2 id="zones-title">{copy.timeZones.title}</h2>
            <p>{copy.timeZones.lede}</p>
        </div>
        <dl className={styles.zones}>
            {copy.timeZones.zones.map(zone => (
                <div key={zone.region} className={styles.zone}>
                    <dt>{zone.region}</dt>
                    <dd>{zone.detail}</dd>
                </div>
            ))}
        </dl>
        <ul className={styles.notes}>
            <li>{copy.timeZones.languages}</li>
            <li>{copy.timeZones.privacy}</li>
        </ul>
    </section>
);
