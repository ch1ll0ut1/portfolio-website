import { FC } from 'react';
import Link from 'next/link';
import { type ListedPost, blogCopy, tagLabel } from '@/config/blog';
import { formatDate } from '@/lib/date';
import type { Locale } from '@/lib/i18n/locale';
import { localizedPath } from '@/lib/i18n/paths';
import styles from './BlogIndex.module.css';

interface Props {
    post: ListedPost;
    locale: Locale;
}

/** Beyond this the pills wrap into a block and stop reading as metadata. */
const VISIBLE_TAGS = 4;

export const PostRow: FC<Props> = ({ post, locale }) => {
    return (
        <li className={styles.post} data-post>
            <Link href={localizedPath(locale, `/blog/${post.slug}`)} className={styles.link}>
                <span className={styles.meta}>
                    {/* Date, dot and read time wrap as one unit, so a narrow row
                        moves the chip down rather than breaking the line in them. */}
                    <span className={styles.when}>
                        <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
                        <span className={styles.dot} aria-hidden="true" />
                        <span>{post.readTime}</span>
                    </span>
                    {post.featured && <span className={styles.featured}>{blogCopy[locale].featured}</span>}
                </span>
                <h2 className={styles.postTitle}>
                    <span className={styles.selection}>{post.title}</span>
                </h2>
                <span className={styles.excerpt}>{post.excerpt}</span>
            </Link>

            {post.tags.length > 0 && (
                <ul className="tags">
                    {post.tags.slice(0, VISIBLE_TAGS).map(tag => (
                        <li key={tag}>{tagLabel(locale, tag)}</li>
                    ))}
                </ul>
            )}
        </li>
    );
};
