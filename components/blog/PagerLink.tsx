import { FC } from 'react';
import Link from 'next/link';
import { type BlogPost } from '@/config/blog';
import styles from './Article.module.css';

interface Props {
    post: BlogPost;
    /** Where this post sits relative to the one being read, e.g. "Older". */
    label: string;
}

export const PagerLink: FC<Props> = ({ post, label }) => {
    return (
        <Link href={`/blog/${post.slug}`} className={styles.pagerLink}>
            <span className={styles.pagerLabel}>{label}</span>
            <span className={styles.pagerTitle}>{post.title}</span>
        </Link>
    );
};
