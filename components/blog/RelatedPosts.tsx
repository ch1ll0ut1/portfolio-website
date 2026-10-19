import { FC } from 'react';
import { type ListedPost } from '@/config/blog';
import { PagerLink } from './PagerLink';
import styles from './Article.module.css';

interface Props {
    posts: ListedPost[];
}

/** Posts on the same topics as the article, set as cards above the pager. */
export const RelatedPosts: FC<Props> = ({ posts }) => {
    if (posts.length === 0) {
        return null;
    }

    return (
        <section className={styles.related} aria-label="Related posts">
            <h2 className={styles.relatedTitle}>Related posts</h2>
            <ul className={styles.relatedList}>
                {posts.map(post => (
                    <li key={post.slug} className={styles.relatedItem}>
                        <PagerLink post={post} label={post.readTime} />
                    </li>
                ))}
            </ul>
        </section>
    );
};
