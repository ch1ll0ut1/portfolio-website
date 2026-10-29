import { FC } from 'react';
import type { Metadata } from 'next';
import { BlogPostPage } from '@/components/blog/pages/BlogPostPage';
import { blogPostsFor } from '@/config/blog';
import { blogPostMetadata } from '@/lib/blog/postMetadata';

/*
 * `dynamicParams` stays at its default on purpose. Every post is generated at
 * build time anyway, but with `false` Next answers an unknown slug from the
 * root not-found page, skipping ./not-found.tsx and its "All articles" way
 * back. Left on, an unknown slug renders here, hits `notFound()` and gets the
 * post-specific 404.
 */

interface Props {
    params: Promise<{ slug: string }>;
}

/**
 * Generates static params for all blog posts to enable static generation.
 */
export async function generateStaticParams() {
    return blogPostsFor('en').map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    return blogPostMetadata(slug, 'en');
}

const BlogPost: FC<Props> = async ({ params }) => {
    const { slug } = await params;

    return <BlogPostPage slug={slug} locale="en" />;
};

export default BlogPost;
