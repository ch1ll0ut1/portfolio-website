import { FC } from 'react';
import Link from 'next/link';
import { type BlogPost, blogCopy } from '@/config/blog';
import type { Locale } from '@/lib/i18n/locale';
import { localizedPath } from '@/lib/i18n/paths';
import { PagerLink } from './PagerLink';
import styles from './Article.module.css';

interface Props {
    /** The next post up the index, i.e. published more recently. */
    newer?: BlogPost;
    /** The next post down the index. */
    older?: BlogPost;
    locale: Locale;
}

export const ArticlePager: FC<Props> = ({ newer, older, locale }) => {
    const copy = blogCopy[locale].pager;

    return (
        <nav className={styles.pager} aria-label={copy.label}>
            {newer && <PagerLink post={newer} label={copy.newer} locale={locale} />}
            {older && <PagerLink post={older} label={copy.older} locale={locale} />}

            <Link href={localizedPath(locale, '/blog')} className={`btn ${styles.pagerAll}`}>
                <span className="btn__label">{copy.all}</span>
            </Link>
        </nav>
    );
};
