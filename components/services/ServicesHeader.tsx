import { type FC } from 'react';
import Link from 'next/link';
import { MaskHeading } from '@/components/blog/MaskHeading';
import { links } from '@/config/links';
import type { ServicesPageCopy } from '@/config/services/types';
import { contactHref } from './contactHref';
import styles from './ServicesPage.module.css';

interface Props {
    copy: ServicesPageCopy;
}

/** The page's kicker, h1, lede and calls to action. The nav's switch goes to the other language. */
export const ServicesHeader: FC<Props> = ({ copy }) => (
    <header className={styles.header}>
        <p className={styles.kicker}>{copy.hero.kicker}</p>
        <MaskHeading className={styles.title}>{copy.hero.title}</MaskHeading>
        <p className={styles.lede}>{copy.hero.lede}</p>
        <div className={styles.ctas}>
            <a className="btn btn--primary" href={links.calendly} target="_blank" rel="noopener noreferrer">
                <span className="btn__label">{copy.hero.callLabel}</span>
            </a>
            <Link className="btn" href={contactHref(copy.lang)}>
                <span className="btn__label">{copy.hero.writeLabel}</span>
            </Link>
        </div>
    </header>
);
