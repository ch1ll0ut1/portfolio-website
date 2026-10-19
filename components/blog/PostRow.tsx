import { FC } from 'react';
import Link from 'next/link';
import { type ListedPost } from '@/config/blog';
import { formatDate } from '@/lib/date';
import styles from './BlogIndex.module.css';

interface Props {
    post: ListedPost;
}

/** Beyond this the pills wrap into a block and stop reading as metadata. */
const VISIBLE_TAGS = 4;

export const PostRow: FC<Props> = ({ post }) => {
    return (
        <li className={styles.post} data-post>
            <Link href={`/blog/${post.slug}`} className={styles.link}>
                <span className={styles.meta}>
                    {/* Date, dot and read time wrap as one unit, so a narrow row
                        moves the chip down rather than breaking the line in them. */}
                    <span className={styles.when}>
                        <time dateTime={post.date}>{formatDate(post.date)}</time>
                        <span className={styles.dot} aria-hidden="true" />
                        <span>{post.readTime}</span>
                    </span>
                    {post.featured && <span className={styles.featured}>Featured</span>}
                </span>
                <span className={styles.postTitle}>
                    <span className={styles.selection}>{post.title}</span>
                </span>
                <span className={styles.excerpt}>{post.excerpt}</span>
            </Link>

            {post.tags.length > 0 && (
                <ul className="tags">
                    {post.tags.slice(0, VISIBLE_TAGS).map(tag => (
                        <li key={tag}>{tag}</li>
                    ))}
                </ul>
            )}
        </li>
    );
};
