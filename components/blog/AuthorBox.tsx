import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { blogCopy } from '@/config/blog';
import { siteConfig } from '@/config/site';
import type { Locale } from '@/lib/i18n/locale';
import { localizedPath } from '@/lib/i18n/paths';
import styles from './AuthorBox.module.css';

interface Props {
    locale: Locale;
}

/** The headshot's rendered size in CSS pixels; the source is 800×800. */
const AVATAR_SIZE = 72;

/**
 * Who wrote the article, closing its body: a headshot, a short bio and the
 * ways to work together.
 */
export const AuthorBox: FC<Props> = ({ locale }) => {
    const copy = blogCopy[locale].author;

    return (
        <aside className={styles.box} aria-label={copy.label}>
            <div className={styles.head}>
                <Image
                    src="/stefan-knoch.jpg"
                    alt={copy.headshotAlt}
                    width={AVATAR_SIZE}
                    height={AVATAR_SIZE}
                    className={styles.avatar}
                />
                <div className={styles.byline}>
                    <p className={styles.kicker}>{copy.kicker}</p>
                    <h2 className={styles.name}>
                        <Link href={localizedPath(locale, '/')} rel="author" className={styles.nameLink}>{siteConfig.name}</Link>
                    </h2>
                </div>
            </div>
            <p className={styles.bio}>
                {copy.bio.beforeYear}
                {' '}
                {siteConfig.sinceYear}
                {copy.bio.afterYear}
                {' '}
                <span lang="de">{copy.bio.german}</span>
                {copy.bio.end}
            </p>
            <div className={styles.actions}>
                <Link href={localizedPath(locale, '/services')} className="btn btn--primary">
                    <span className="btn__label">{copy.actions.services}</span>
                </Link>
                <Link href={localizedPath(locale, '/contact')} className="btn">
                    <span className="btn__label">{copy.actions.contact}</span>
                </Link>
            </div>
        </aside>
    );
};
