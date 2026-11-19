import { FC } from 'react';
import Link from 'next/link';
import { type BlogPost } from '@/config/blog';
import type { Locale } from '@/lib/i18n/locale';
import { localizedPath } from '@/lib/i18n/paths';
import styles from './Article.module.css';

interface Props {
    post: BlogPost;
    /** Where this post sits relative to the one being read, e.g. "Older". */
    label: string;
    locale: Locale;
}

export const PagerLink: FC<Props> = ({ post, label, locale }) => {
    return (
        <Link href={localizedPath(locale, `/blog/${post.slug}`)} className={styles.pagerLink}>
            <span className={styles.pagerLabel}>{label}</span>
            <span className={styles.pagerTitle}>{post.title}</span>
        </Link>
    );
};
