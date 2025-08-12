import React, { FC } from 'react';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BlogPostHeader } from '@/components/blog/BlogPostHeader';
import { BlogPostContent } from '@/components/blog/BlogPostContent';
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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
                {/* Header */}
                <Header currentPage="blog" />

                {/* Article */}
                <article className="py-16 px-6">
                    <div className="max-w-4xl mx-auto">
                        <nav aria-label="Breadcrumb" className="mb-8">
                            <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <li>
                                    <Link href="/" className="hover:text-primary transition-colors">
                                        Home
                                    </Link>
                                </li>
                                <li>/</li>
                                <li>
                                    <Link href="/blog" className="hover:text-primary transition-colors">
                                        Blog
                                    </Link>
                                </li>
                                <li>/</li>
                                <li className="text-primary">{post.title}</li>
                            </ol>
                        </nav>

                        <Link
                            href="/blog"
                            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Blog
                        </Link>

                        <BlogPostHeader post={post} />
                        <BlogPostContent content={post.content} />
                    </div>
                </article>

                {/* Footer */}
                <Footer />
            </div>
        </>
    );
};

export default BlogPost;
