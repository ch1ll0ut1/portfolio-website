import React, { FC } from 'react';
import { type BlogPost } from '@/config/blog';
import { Markdown } from '@/components/markdown/Markdown';
import { ArticleHeader } from './ArticleHeader';
import { ArticlePager } from './ArticlePager';
import { ReadingProgress } from './ReadingProgress';
import styles from './Article.module.css';

interface Props {
    post: BlogPost & { content: string };
    /** The next post up the index, i.e. published more recently. */
    newer?: BlogPost;
    /** The next post down the index. */
    older?: BlogPost;
}

/**
 * Scroll target for both the reading indicator and the analytics scroll
 * tracker, which is configured with the `article` selector.
 */
const ARTICLE_ID = 'article-body';

export const Article: FC<Props> = ({ post, newer, older }) => {
    return (
        <>
            <ReadingProgress targetId={ARTICLE_ID} />

            <div className="wrap">
                <article id={ARTICLE_ID} className={styles.article} data-scroll-target>
                    <ArticleHeader post={post} />
                    <Markdown content={post.content} />
                </article>

                <ArticlePager newer={newer} older={older} />
            </div>
        </>
    );
};
