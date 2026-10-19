import { FC } from 'react';
import Link from 'next/link';
import { type ListedPost, lastModified } from '@/config/blog';
import { formatDate } from '@/lib/date';
import { MaskHeading } from './MaskHeading';
import { Reveal } from '@/components/motion/Reveal';
import styles from './Article.module.css';

interface Props {
    post: ListedPost;
}

export const ArticleHeader: FC<Props> = ({ post }) => {
    const updated = lastModified(post);

    return (
        <header className={styles.header}>
            <nav aria-label="Breadcrumb" className={styles.crumbs}>
                <ol>
                    <li>
                        <Link href="/" className={styles.crumb}>Home</Link>
                    </li>
                    <li aria-hidden="true" className={styles.crumbSep}>/</li>
                    <li>
                        <Link href="/blog" className={styles.crumb}>Writing</Link>
                    </li>
                    <li aria-hidden="true" className={styles.crumbSep}>/</li>
                    <li aria-current="page" className={styles.crumbCurrent}>{post.title}</li>
                </ol>
            </nav>

            <p className={styles.meta}>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                {updated !== post.date && (
                    <>
                        <span className={styles.dot} aria-hidden="true" />
                        <span>
                            Updated
                            {' '}
                            <time dateTime={updated}>{formatDate(updated)}</time>
                        </span>
                    </>
                )}
                <span className={styles.dot} aria-hidden="true" />
                <span>{post.readTime}</span>
                <span className={styles.dot} aria-hidden="true" />
                <span>Stefan Knoch</span>
            </p>

            <MaskHeading className={styles.title}>{post.title}</MaskHeading>

            <Reveal delay={0.12}>
                <p className={styles.excerpt}>{post.excerpt}</p>
            </Reveal>

            {post.tags.length > 0 && (
                <ul className="tags">
                    {post.tags.map(tag => (
                        <li key={tag}>{tag}</li>
                    ))}
                </ul>
            )}
        </header>
    );
};
