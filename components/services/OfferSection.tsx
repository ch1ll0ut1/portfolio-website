import { type FC } from 'react';
import Link from 'next/link';
import type { ServiceOfferCopy, ServicesPageCopy } from '@/config/services/types';
import { CONTACT_HREF } from './contactHref';
import styles from './OfferSection.module.css';

interface Props {
    offer: ServiceOfferCopy;
    labels: ServicesPageCopy['labels'];
}

/**
 * One engagement in full, anchored at its id so the homepage cards and the
 * chooser can link straight to it: the problem in the buyer's words, who it
 * is for, what they get, how it runs, the typical size and the proof.
 */
export const OfferSection: FC<Props> = ({ offer, labels }) => {
    const titleId = `${offer.id}-title`;

    return (
        <section id={offer.id} className={styles.offer} aria-labelledby={titleId}>
            <div className={styles.lead}>
                <p className={styles.subtitle}>{offer.subtitle}</p>
                <h2 id={titleId} className={styles.name}>{offer.name}</h2>
                <blockquote className={styles.problem}>
                    <p>{offer.problem}</p>
                </blockquote>
                <div className={styles.block}>
                    <h3 className={styles.label}>{labels.forWho}</h3>
                    <p>{offer.forWho}</p>
                </div>
                <div className={styles.range}>
                    <h3 className={styles.label}>{labels.typical}</h3>
                    <p className={styles.rangeValue}>{offer.range}</p>
                    <p className={styles.billing}>{labels.billing}</p>
                </div>
                <Link className={`btn btn--primary ${styles.cta}`} href={CONTACT_HREF}>
                    <span className="btn__label">{labels.offerCta}</span>
                </Link>
            </div>

            <div className={styles.detail}>
                <div className={styles.block}>
                    <h3 className={styles.label}>{labels.youGet}</h3>
                    <ul className={styles.list}>
                        {offer.youGet.map(item => <li key={item}>{item}</li>)}
                    </ul>
                </div>
                <div className={styles.block}>
                    <h3 className={styles.label}>{labels.howItRuns}</h3>
                    <ol className={styles.steps}>
                        {offer.howItRuns.map(step => <li key={step}>{step}</li>)}
                    </ol>
                </div>
                <div className={styles.block}>
                    <h3 className={styles.label}>{labels.proof}</h3>
                    <ul className={styles.proof}>
                        {offer.proof.map(item => <li key={item}>{item}</li>)}
                    </ul>
                </div>
            </div>
        </section>
    );
};
