import { FC } from 'react';
import Link from 'next/link';
import { type ListedPost, blogCopy, lastModified, tagLabel } from '@/config/blog';
import { siteConfig } from '@/config/site';
import { formatDate } from '@/lib/date';
import type { Locale } from '@/lib/i18n/locale';
import { localizedPath } from '@/lib/i18n/paths';
import { MaskHeading } from './MaskHeading';
import { Reveal } from '@/components/motion/Reveal';
import styles from './Article.module.css';

interface Props {
    post: ListedPost;
    locale: Locale;
}

export const ArticleHeader: FC<Props> = ({ post, locale }) => {
    const copy = blogCopy[locale];
    const updated = lastModified(post);
    const home = localizedPath(locale, '/');

    return (
        <header className={styles.header}>
            <nav aria-label={copy.breadcrumbs.label} className={styles.crumbs}>
                <ol>
                    <li>
                        <Link href={home} className={styles.crumb}>{copy.breadcrumbs.home}</Link>
                    </li>
                    <li aria-hidden="true" className={styles.crumbSep}>/</li>
                    <li>
                        <Link href={localizedPath(locale, '/blog')} className={styles.crumb}>{copy.breadcrumbs.writing}</Link>
                    </li>
                    <li aria-hidden="true" className={styles.crumbSep}>/</li>
                    <li aria-current="page" className={styles.crumbCurrent}>{post.title}</li>
                </ol>
            </nav>

            <p className={styles.meta}>
                <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
                {updated !== post.date && (
                    <>
                        <span className={styles.dot} aria-hidden="true" />
                        <span>
                            {copy.updated}
                            {' '}
                            <time dateTime={updated}>{formatDate(updated, locale)}</time>
                        </span>
                    </>
                )}
                <span className={styles.dot} aria-hidden="true" />
                <span>{post.readTime}</span>
                <span className={styles.dot} aria-hidden="true" />
                <Link href={home} rel="author" className={styles.crumb}>{siteConfig.name}</Link>
            </p>

            <MaskHeading className={styles.title}>{post.title}</MaskHeading>

            <Reveal delay={0.12}>
                <p className={styles.excerpt}>{post.excerpt}</p>
            </Reveal>

            {post.tags.length > 0 && (
                <ul className="tags">
                    {post.tags.map(tag => (
                        <li key={tag}>{tagLabel(locale, tag)}</li>
                    ))}
                </ul>
            )}
        </header>
    );
};
