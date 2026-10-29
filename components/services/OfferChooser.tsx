import { type FC } from 'react';
import type { ServicesPageCopy } from '@/config/services/types';
import styles from './ServicesPage.module.css';

interface Props {
    copy: ServicesPageCopy;
}

/** "Not sure which you need?": a situation per row, each linking to the offer that fits it. */
export const OfferChooser: FC<Props> = ({ copy }) => (
    <section className={styles.chooser} aria-labelledby="chooser-title">
        <h2 id="chooser-title" className={styles.chooserTitle}>{copy.chooser.title}</h2>
        <ul className={styles.chooserRows}>
            {copy.chooser.rows.map(row => (
                <li key={row.offerId}>
                    <a className={styles.chooserRow} href={`#${row.offerId}`}>
                        <span className={styles.situation}>{row.situation}</span>
                        <span className={styles.answer}>
                            {offerName(copy, row.offerId)}
                            <span aria-hidden="true"> ↓</span>
                        </span>
                    </a>
                </li>
            ))}
        </ul>
    </section>
);

const offerName = (copy: ServicesPageCopy, id: string) => copy.offers.find(offer => offer.id === id)?.name ?? id;
