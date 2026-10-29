import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import styles from './AuthorBox.module.css';

/** The headshot's rendered size in CSS pixels; the source is 800×800. */
const AVATAR_SIZE = 72;

/**
 * Who wrote the article, closing its body: a headshot, a short bio and the
 * ways to work together.
 */
export const AuthorBox: FC = () => {
    return (
        <aside className={styles.box} aria-label="About the author">
            <div className={styles.head}>
                <Image
                    src="/stefan-knoch.jpg"
                    alt={siteConfig.name}
                    width={AVATAR_SIZE}
                    height={AVATAR_SIZE}
                    className={styles.avatar}
                />
                <div className={styles.byline}>
                    <p className={styles.kicker}>Written by</p>
                    <h2 className={styles.name}>
                        <Link href="/" rel="author" className={styles.nameLink}>{siteConfig.name}</Link>
                    </h2>
                </div>
            </div>
            <p className={styles.bio}>
                Software architect & tech lead since
                {' '}
                {siteConfig.sinceYear}
                . I build new apps, fix broken ones and lead developers for
                startups and small businesses, working remotely from Bangkok in
                English and
                {' '}
                <span lang="de">Deutsch</span>
                .
            </p>
            <div className={styles.actions}>
                <Link href="/services" className="btn btn--primary">
                    <span className="btn__label">How I can help</span>
                </Link>
                <Link href="/contact" className="btn">
                    <span className="btn__label">Get in touch</span>
                </Link>
            </div>
        </aside>
    );
};
