import { FC, ReactNode } from 'react';
import { BlogPostBoundary } from '@/components/blog/pages/BlogPostBoundary';

interface Props {
    children: ReactNode;
    params: Promise<{ slug: string }>;
}

/** Keeps an unknown slug's 404 inside the root layout's server render; see `BlogPostBoundary`. */
const PostLayout: FC<Props> = async ({ children, params }) => {
    const { slug } = await params;

    return <BlogPostBoundary slug={slug} locale="de">{children}</BlogPostBoundary>;
};

export default PostLayout;
