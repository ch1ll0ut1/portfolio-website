import { type FC } from 'react';
import Link from 'next/link';
import { MaskHeading } from '@/components/blog/MaskHeading';
import { links } from '@/config/links';
import type { ServicesPageCopy } from '@/config/services/types';
import { CONTACT_HREF } from './contactHref';
import styles from './ServicesPage.module.css';

interface Props {
    copy: ServicesPageCopy;
}

/** The page's kicker, h1, lede and calls to action, with the switch to the other language. */
export const ServicesHeader: FC<Props> = ({ copy }) => (
    <header className={styles.header}>
        <div className={styles.headerTop}>
            <p className={styles.kicker}>{copy.hero.kicker}</p>
            <Link
                className={styles.language}
                href={copy.otherLanguage.href}
                hrefLang={copy.otherLanguage.lang}
                lang={copy.otherLanguage.lang}
            >
                {copy.otherLanguage.label}
            </Link>
        </div>
        <MaskHeading className={styles.title}>{copy.hero.title}</MaskHeading>
        <p className={styles.lede}>{copy.hero.lede}</p>
        <div className={styles.ctas}>
            <a className="btn btn--primary" href={links.calendly} target="_blank" rel="noopener noreferrer">
                <span className="btn__label">{copy.hero.callLabel}</span>
            </a>
            <Link className="btn" href={CONTACT_HREF}>
                <span className="btn__label">{copy.hero.writeLabel}</span>
            </Link>
        </div>
    </header>
);
