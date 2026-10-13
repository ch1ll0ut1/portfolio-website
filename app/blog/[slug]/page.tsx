import React, { FC } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/config/blog';
import { readMarkdownFile } from '@/components/markdown/markdownProcessor';
import { EngagementTracker } from '@/components/analytics/EngagementTracker';
import { Article } from '@/components/blog/Article';
import { ReadingShell } from '@/components/blog/ReadingShell';
import { GlobalChrome } from '@/components/chrome/GlobalChrome';
import { ContactFooter } from '@/components/home/contact/ContactFooter';
import { NavTools } from '@/components/nav/NavTools';
import { SiteNav } from '@/components/nav/SiteNav';
import { JsonLd } from '@/components/seo/JsonLd';
import { absoluteUrl, siteConfig } from '@/config/site';
import { blogPostingSchema } from '@/lib/structuredData';

/**
 * Generates static params for all blog posts to enable static generation.
 */
export async function generateStaticParams() {
    return blogPosts.map(post => ({ slug: post.slug }));
}

/**
 * Gets blog post data and content from configuration and markdown files.
 * Returns the post metadata, its markdown, and its neighbours in the index.
 */
function getBlogPostData(slug: string) {
    const index = blogPosts.findIndex(p => p.slug === slug);
    if (index === -1) return null;

    const postMetadata = blogPosts[index];
    const markdownContent = readMarkdownFile(slug);
    if (!markdownContent) return null;

    // The index is newest first, so the entry before this one is the newer post.
    return {
        post: { ...postMetadata, content: markdownContent },
        newer: blogPosts[index - 1],
        older: blogPosts[index + 1],
    };
}

/**
 * Generates metadata for individual blog posts
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const data = getBlogPostData(slug);

    // Guards the property reads below. The 404 response is described by
    // ./not-found.tsx, since Next drops this result once `notFound()` is thrown.
    if (!data) {
        return {
            title: 'Post not found',
            description: 'That article does not exist, or its link has changed.',
            robots: {
                index: false,
                follow: true,
            },
        };
    }

    const { post } = data;

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
            url: absoluteUrl(`/blog/${slug}`),
            type: 'article',
            publishedTime: post.date,
            authors: [siteConfig.name],
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
    const data = getBlogPostData(slug);

    // Renders ./not-found.tsx with a real 404. Returning the panel from here
    // answered 200, which made every stale link indexable as real content.
    if (!data) {
        notFound();
    }

    const { post, newer, older } = data;

    return (
        <>
            <JsonLd data={blogPostingSchema(post)} />

            <EngagementTracker pageType="blog_post" scrollTarget="article" />

            <ReadingShell
                header={<SiteNav tools={<NavTools />} />}
                footer={<ContactFooter />}
            >
                <Article post={post} newer={newer} older={older} />
            </ReadingShell>

            {/* The article renders its own article-scoped progress caret. */}
            <GlobalChrome scrollProgress={false} />
        </>
    );
};

export default BlogPost;
