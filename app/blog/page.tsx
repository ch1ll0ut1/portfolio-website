import React, { FC } from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BlogHero } from '@/components/blog/BlogHero';
import { BlogPostList } from '@/components/blog/BlogPostList';
import { blogPosts } from '@/config/blog';

export const metadata: Metadata = {
    title: 'Blog | Software Development & Technology Insights',
    description: 'Insights on software development, technology leadership, AI implementation, and building scalable applications. Learn from real-world experience and strategic thinking.',
    keywords: [
        'software development blog',
        'technology insights',
        'React development',
        'TypeScript tips',
        'AI implementation',
        'tech leadership',
        'software architecture',
        'development best practices',
    ],
    openGraph: {
        title: 'Blog | Software Development & Technology Insights',
        description: 'Insights on software development, technology leadership, AI implementation, and building scalable applications.',
        url: 'https://stefanknoch.dev/blog',
        type: 'website',
    },
    twitter: {
        title: 'Blog | Software Development & Technology Insights',
        description: 'Insights on software development, technology leadership, AI implementation, and building scalable applications.',
    },
    alternates: {
        canonical: '/blog',
    },
};

const Blog: FC = () => {
    const posts = blogPosts;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Blog',
                        'name': 'Stefan Knoch Blog',
                        'description': 'Insights on software development, technology leadership, and AI implementation',
                        'url': 'https://stefanknoch.dev/blog',
                        'author': {
                            '@type': 'Person',
                            'name': 'Stefan Knoch',
                        },
                        'blogPost': posts.map(post => ({
                            '@type': 'BlogPosting',
                            'headline': post.title,
                            'description': post.excerpt,
                            'author': {
                                '@type': 'Person',
                                'name': 'Stefan Knoch',
                            },
                            'datePublished': post.date,
                            'url': `https://stefanknoch.dev/blog/${post.slug}`,
                            'mainEntityOfPage': {
                                '@type': 'WebPage',
                                '@id': `https://stefanknoch.dev/blog/${post.slug}`,
                            },
                        })),
                    }),
                }}
            />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
                <Header currentPage="blog" />
                <BlogHero />
                <BlogPostList posts={posts} />
                <Footer className="mt-16" />
            </div>
        </>
    );
};

export default Blog;
