import { FC } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/config/blog';
import { EngagementTracker } from '@/components/analytics/EngagementTracker';
import { Article } from '@/components/blog/Article';
import { ReadingShell } from '@/components/blog/ReadingShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { absoluteUrl, siteConfig } from '@/config/site';
import { baseOpenGraph } from '@/lib/baseOpenGraph';
import { getBlogPostData } from '@/lib/content/blogPosts';
import { bangkokDateTime } from '@/lib/date';
import { blogPostBreadcrumbs, blogPostingSchema, breadcrumbSchema, jsonLdGraph } from '@/lib/structuredData';
import { twitterCard } from '@/lib/twitterCard';

/*
 * `dynamicParams` stays at its default on purpose. Every post is generated at
 * build time anyway, but with `false` Next answers an unknown slug from the
 * root not-found page, skipping ./not-found.tsx and its "All articles" way
 * back. Left on, an unknown slug renders here, hits `notFound()` and gets the
 * post-specific 404.
 */

/**
 * Generates static params for all blog posts to enable static generation.
 */
export async function generateStaticParams() {
    return blogPosts.map(post => ({ slug: post.slug }));
}

/**
 * Generates metadata for individual blog posts
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const data = getBlogPostData(slug);

    // Guards the property reads below. Matches ./not-found.tsx, robots
    // included: Next sends its own `noindex` with the 404, and a value here
    // would be a second robots tag (this result does reach the page).
    if (!data) {
        return {
            title: 'Post not found',
            description: 'That article does not exist, or its link has changed.',
            robots: null,
        };
    }

    const { post } = data;

    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            ...baseOpenGraph,
            title: post.title,
            description: post.excerpt,
            url: absoluteUrl(`/blog/${slug}`),
            type: 'article',
            publishedTime: bangkokDateTime(post.date),
            authors: [siteConfig.name],
            tags: post.tags,
        },
        twitter: twitterCard(post.title, post.excerpt),
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
    // ./layout.tsx keeps the throw from failing the document's server render.
    if (!data) {
        notFound();
    }

    const { post, newer, older } = data;

    return (
        <>
            <JsonLd data={jsonLdGraph(blogPostingSchema(post), breadcrumbSchema(blogPostBreadcrumbs(post)))} />

            <EngagementTracker pageType="blog_post" scrollTarget="article" />

            <ReadingShell>
                <Article post={post} newer={newer} older={older} />
            </ReadingShell>
        </>
    );
};

export default BlogPost;
