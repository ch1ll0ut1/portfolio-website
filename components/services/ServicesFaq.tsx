import { type FC } from 'react';
import type { ServicesPageCopy } from '@/config/services/types';
import pageStyles from './ServicesPage.module.css';
import styles from './ServicesFaq.module.css';

interface Props {
    copy: ServicesPageCopy;
}

/**
 * The buyers' questions as a list of disclosures. Every answer is in the
 * markup, so it reads without JavaScript and is indexed with the page.
 */
export const ServicesFaq: FC<Props> = ({ copy }) => (
    <section className={pageStyles.band} aria-labelledby="faq-title">
        <div className={pageStyles.bandHead}>
            <h2 id="faq-title">{copy.faq.title}</h2>
        </div>
        <ul className={styles.faq}>
            {copy.faq.items.map(item => (
                <li key={item.question}>
                    <details className={styles.question}>
                        <summary>
                            <h3>{item.question}</h3>
                        </summary>
                        <p>{item.answer}</p>
                    </details>
                </li>
            ))}
        </ul>
    </section>
);
