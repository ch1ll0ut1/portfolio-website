import React, { FC } from 'react';
import { BlogPostCard } from './BlogPostCard';
import { BlogPost } from '@/config/blog';

interface Props {
    posts: BlogPost[];
    className?: string;
}

/**
 * Component for displaying a list of blog posts.
 * Renders BlogPostCard components for each post.
 */
export const BlogPostList: FC<Props> = ({ posts, className = '' }) => {
    return (
        <section className={`py-12 px-6 ${className}`}>
            <div className="max-w-4xl mx-auto">
                <div className="space-y-8">
                    {posts.map(post => (
                        <BlogPostCard key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </section>
    );
};
