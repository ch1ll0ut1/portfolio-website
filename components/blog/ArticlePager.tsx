import { FC } from 'react';
import Link from 'next/link';
import { type BlogPost } from '@/config/blog';
import { PagerLink } from './PagerLink';
import styles from './Article.module.css';

interface Props {
    /** The next post up the index, i.e. published more recently. */
    newer?: BlogPost;
    /** The next post down the index. */
    older?: BlogPost;
}

export const ArticlePager: FC<Props> = ({ newer, older }) => {
    return (
        <nav className={styles.pager} aria-label="More articles">
            {newer && <PagerLink post={newer} label="Newer" />}
            {older && <PagerLink post={older} label="Older" />}

            <Link href="/blog" className={`btn ${styles.pagerAll}`}>
                <span className="btn__label">All articles</span>
            </Link>
        </nav>
    );
};
