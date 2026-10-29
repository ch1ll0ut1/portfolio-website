import { FC } from 'react';
import { type ListedPost, blogCopy } from '@/config/blog';
import { yearsShipping } from '@/config/site';
import type { Locale } from '@/lib/i18n/locale';
import { PostRow } from './PostRow';
import { MaskHeading } from './MaskHeading';
import { Reveal } from '@/components/motion/Reveal';
import styles from './BlogIndex.module.css';

interface Props {
    posts: ListedPost[];
    locale: Locale;
}

/**
 * The writing index: one editorial heading, then the posts as rows that select
 * themselves on hover while their siblings step back.
 */
export const BlogIndex: FC<Props> = ({ posts, locale }) => {
    const heading = blogCopy[locale].indexHeading;

    return (
        <div className="wrap">
            <header className={styles.head}>
                <p className={styles.kicker}>{heading.kicker}</p>
                <MaskHeading className={styles.title}>
                    {heading.title}
                </MaskHeading>
                <Reveal delay={0.15}>
                    <p className={styles.lead}>
                        {heading.lede(yearsShipping())}
                    </p>
                </Reveal>
            </header>

            <Reveal selector="[data-post]" stagger={0.07}>
                <ol className={styles.posts}>
                    {posts.map(post => (
                        <PostRow key={post.id} post={post} locale={locale} />
                    ))}
                </ol>
            </Reveal>
        </div>
    );
};
