import { FC } from 'react';
import { type ListedPost, blogIndexHeading } from '@/config/blog';
import { yearsShipping } from '@/config/site';
import { PostRow } from './PostRow';
import { MaskHeading } from './MaskHeading';
import { Reveal } from '@/components/motion/Reveal';
import styles from './BlogIndex.module.css';

interface Props {
    posts: ListedPost[];
}

/**
 * The writing index: one editorial heading, then the posts as rows that select
 * themselves on hover while their siblings step back.
 */
export const BlogIndex: FC<Props> = ({ posts }) => {
    return (
        <div className="wrap">
            <header className={styles.head}>
                <p className={styles.kicker}>{blogIndexHeading.kicker}</p>
                <MaskHeading className={styles.title}>
                    {blogIndexHeading.title}
                </MaskHeading>
                <Reveal delay={0.15}>
                    <p className={styles.lead}>
                        {blogIndexHeading.lede(yearsShipping())}
                    </p>
                </Reveal>
            </header>

            <Reveal selector="[data-post]" stagger={0.07}>
                <ol className={styles.posts}>
                    {posts.map(post => (
                        <PostRow key={post.id} post={post} />
                    ))}
                </ol>
            </Reveal>
        </div>
    );
};
