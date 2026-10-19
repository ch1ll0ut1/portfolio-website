import { type FC } from 'react';
import Link from 'next/link';
import { links } from '@/config/links';
import type { ServicesPageCopy } from '@/config/services/types';
import { CONTACT_HREF } from './contactHref';
import styles from './ServicesPage.module.css';

interface Props {
    copy: ServicesPageCopy;
}

/** The closing call to action: a call on Calendly, or the contact form. */
export const ServicesCta: FC<Props> = ({ copy }) => (
    <section className={styles.closing} aria-labelledby="cta-title">
        <h2 id="cta-title">{copy.cta.title}</h2>
        <p>{copy.cta.lede}</p>
        <div className={styles.ctas}>
            <a className="btn btn--primary" href={links.calendly} target="_blank" rel="noopener noreferrer">
                <span className="btn__label">{copy.hero.callLabel}</span>
            </a>
            <Link className="btn" href={CONTACT_HREF}>
                <span className="btn__label">{copy.hero.writeLabel}</span>
            </Link>
        </div>
    </section>
);
