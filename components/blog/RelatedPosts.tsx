import { FC } from 'react';
import { type ListedPost, blogCopy } from '@/config/blog';
import type { Locale } from '@/lib/i18n/locale';
import { PagerLink } from './PagerLink';
import styles from './Article.module.css';

interface Props {
    posts: ListedPost[];
    locale: Locale;
}

/** Posts on the same topics as the article, set as cards above the pager. */
export const RelatedPosts: FC<Props> = ({ posts, locale }) => {
    if (posts.length === 0) {
        return null;
    }

    const title = blogCopy[locale].related;

    return (
        <section className={styles.related} aria-label={title}>
            <h2 className={styles.relatedTitle}>{title}</h2>
            <ul className={styles.relatedList}>
                {posts.map(post => (
                    <li key={post.slug} className={styles.relatedItem}>
                        <PagerLink post={post} label={post.readTime} locale={locale} />
                    </li>
                ))}
            </ul>
        </section>
    );
};
