import { FC } from 'react';
import { type BlogPost, type ListedPost } from '@/config/blog';
import { Markdown } from '@/components/markdown/Markdown';
import { ArticleHeader } from './ArticleHeader';
import { AuthorBox } from './AuthorBox';
import { ArticlePager } from './ArticlePager';
import { RelatedPosts } from './RelatedPosts';
import { ReadingProgress } from './ReadingProgress';
import styles from './Article.module.css';

interface Props {
    post: ListedPost & { content: string };
    /** The next post up the index, i.e. published more recently. */
    newer?: BlogPost;
    /** The next post down the index. */
    older?: BlogPost;
    /** Posts on the same topics, shown above the pager. */
    related?: ListedPost[];
}

/**
 * Scroll target for both the reading indicator and the analytics scroll
 * tracker, which is configured with the `article` selector.
 */
const ARTICLE_ID = 'article-body';

export const Article: FC<Props> = ({ post, newer, older, related = [] }) => {
    return (
        <>
            <ReadingProgress targetId={ARTICLE_ID} />

            <div className="wrap">
                <article id={ARTICLE_ID} className={styles.article} data-scroll-target>
                    <ArticleHeader post={post} />
                    <Markdown content={post.content} />
                    <AuthorBox />
                </article>

                <RelatedPosts posts={related} />
                <ArticlePager newer={newer} older={older} />
            </div>
        </>
    );
};
