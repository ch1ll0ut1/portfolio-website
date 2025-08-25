import React, { FC } from 'react';
import type { Metadata } from 'next';
import BlogPage from '../../components/blog/BlogPage';
import { blogPosts } from '@/config/blog';
import { PageViewTracker } from '@/components/analytics/ClientAnalytics';

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
        url: 'https://stefanknoch.com/blog',
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
    return (
        <>
            <PageViewTracker
                pageName="Blog"
                pageType="blog"
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Blog',
                        'name': 'Stefan Knoch Blog',
                        'description': 'Insights on software development, technology leadership, and AI implementation',
                        'url': 'https://stefanknoch.com/blog',
                        'author': {
                            '@type': 'Person',
                            'name': 'Stefan Knoch',
                        },
                        'blogPost': blogPosts.map(post => ({
                            '@type': 'BlogPosting',
                            'headline': post.title,
                            'description': post.excerpt,
                            'author': {
                                '@type': 'Person',
                                'name': 'Stefan Knoch',
                            },
                            'datePublished': post.date,
                            'url': `https://stefanknoch.com/blog/${post.slug}`,
                            'mainEntityOfPage': {
                                '@type': 'WebPage',
                                '@id': `https://stefanknoch.com/blog/${post.slug}`,
                            },
                        })),
                    }),
                }}
            />
            <BlogPage />
        </>
    );
};

export default Blog;
