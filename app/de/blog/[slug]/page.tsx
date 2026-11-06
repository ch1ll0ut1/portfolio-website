import { FC } from 'react';
import type { Metadata } from 'next';
import { BlogPostPage } from '@/components/blog/pages/BlogPostPage';
import { blogPostsFor } from '@/config/blog';
import { blogPostMetadata } from '@/lib/blog/postMetadata';

/*
 * `dynamicParams` stays at its default on purpose, as on the English article
 * (app/(en)/blog/[slug]/page.tsx): with `false` an unknown slug would skip
 * ./not-found.tsx and its way back to the German index.
 */

interface Props {
    params: Promise<{ slug: string }>;
}

/** Every German post, generated at build time. */
export async function generateStaticParams() {
    return blogPostsFor('de').map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    return blogPostMetadata(slug, 'de');
}

/** One German article, the twin of `/blog/[slug]`. */
const BlogPost: FC<Props> = async ({ params }) => {
    const { slug } = await params;

    return <BlogPostPage slug={slug} locale="de" />;
};

export default BlogPost;
