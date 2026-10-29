import { type FC } from 'react';
import Link from 'next/link';
import { allArticles, featuredPosts } from './featuredPosts';
import styles from './PostList.module.css';

/**
 * The featured posts, plus a smaller row into the blog index.
 *
 * `data-post` is what the section's entrance stagger reveals, so the rows are
 * ordinary markup here and readable with no JS at all.
 */
export const PostList: FC = () => {
    return (
        <ul className={styles.posts}>
            {featuredPosts.map(post => (
                <li className={styles.post} key={post.slug} data-post>
                    <Link className={styles.link} href={post.href}>
                        <span className={styles.kind}>{post.kind}</span>
                        <span className={styles.title}>
                            <span className={styles.sel}>{post.title}</span>
                        </span>
                        <span className={styles.desc}>{post.description}</span>
                    </Link>
                </li>
            ))}

            <li className={`${styles.post} ${styles.postAll}`} data-post>
                <Link className={styles.link} href={allArticles.href}>
                    <span className={styles.title}>
                        <span className={styles.sel}>{allArticles.label}</span>
                    </span>
                </Link>
            </li>
        </ul>
    );
};
