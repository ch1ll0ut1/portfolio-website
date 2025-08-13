import React, { FC } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BlogHero } from '@/components/blog/BlogHero';
import { BlogPostList } from '@/components/blog/BlogPostList';
import { blogPosts } from '@/config/blog';

/**
 * Blog listing page component containing hero and post list.
 * Extracted from the blog page.tsx file for better component isolation.
 */
const BlogPage: FC = () => {
    const posts = blogPosts;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
            <Header currentPage="blog" />
            <BlogHero />
            <BlogPostList posts={posts} />
            <Footer className="mt-16" />
        </div>
    );
};

export default BlogPage;
