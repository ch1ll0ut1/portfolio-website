import React, { FC } from 'react';
import { type BlogPost } from '@/config/blog';
import { PostRow } from './PostRow';
import { MaskHeading } from './MaskHeading';
import { Reveal } from './Reveal';
import styles from './BlogIndex.module.css';

interface Props {
    posts: BlogPost[];
}

/**
 * The writing index: one editorial heading, then the posts as rows that select
 * themselves on hover while their siblings step back.
 */
export const BlogIndex: FC<Props> = ({ posts }) => {
    return (
        <div className="wrap">
            <header className={styles.head}>
                <p className={styles.kicker}>Writing</p>
                <MaskHeading className={styles.title}>
                    Insights on software development and tech leadership
                </MaskHeading>
                <Reveal delay={0.15}>
                    <p className={styles.lead}>
                        Practical advice from 15+ years of building software, leading teams, and helping
                        businesses navigate their technology challenges.
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
