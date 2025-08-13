import React, { FC } from 'react';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import BlogPostPage from '../../components/BlogPostPage';
import { blogPosts } from '@/config/blog';
import { readMarkdownFile } from '@/lib/markdownProcessor';

/**
 * Gets blog post data and content from configuration and markdown files.
 * Returns post metadata and parsed markdown content.
 */
function getBlogPostData(slug: string) {
    const postMetadata = blogPosts.find(p => p.slug === slug);
    if (!postMetadata) return null;

    const markdownContent = readMarkdownFile(slug);
    if (!markdownContent) return null;

    return {
        ...postMetadata,
        content: markdownContent,
    };
}

/**
 * Generates metadata for individual blog posts
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = getBlogPostData(slug);

    if (!post) {
        return {
            title: 'Post Not Found',
            description: 'The requested blog post could not be found.',
        };
    }

    return {
        title: post.title,
        description: post.excerpt,
        keywords: [
            ...post.tags,
            'software development',
            'technology',
            'blog post',
        ],
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: `https://stefanknoch.dev/blog/${slug}`,
            type: 'article',
            publishedTime: post.date,
            authors: ['Stefan Knoch'],
            tags: post.tags,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
        },
        alternates: {
            canonical: `/blog/${slug}`,
        },
    };
}

const BlogPost: FC<{ params: Promise<{ slug: string }> }> = async ({ params }) => {
    const { slug } = await params;
    const post = getBlogPostData(slug);

    if (!post) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-primary mb-4">Post Not Found</h1>
                    <Link href="/blog">
                        <Button>Back to Blog</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BlogPosting',
                        'headline': post.title,
                        'description': post.excerpt,
                        'author': {
                            '@type': 'Person',
                            'name': 'Stefan Knoch',
                            'url': 'https://stefanknoch.dev',
                        },
                        'publisher': {
                            '@type': 'Organization',
                            'name': 'Stefan Knoch',
                            'logo': {
                                '@type': 'ImageObject',
                                'url': 'https://stefanknoch.dev/logo.png',
                            },
                        },
                        'datePublished': post.date,
                        'dateModified': post.date,
                        'mainEntityOfPage': {
                            '@type': 'WebPage',
                            '@id': `https://stefanknoch.dev/blog/${slug}`,
                        },
                        'url': `https://stefanknoch.dev/blog/${slug}`,
                        'articleSection': 'Technology',
                        'keywords': post.tags.join(', '),
                        'inLanguage': 'en-US',
                        'isAccessibleForFree': true,
                    }),
                }}
            />
            <BlogPostPage post={post} />
        </>
    );
};

export default BlogPost;
