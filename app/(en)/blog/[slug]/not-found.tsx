import { FC } from 'react';
import type { Metadata } from 'next';
import { BlogPostNotFound } from '@/components/blog/pages/BlogPostNotFound';
import { postNotFoundMetadata } from '@/lib/blog/postMetadata';

/**
 * Shown when `/blog/[slug]` matches no post.
 *
 * The page used to render this panel inline and answer 200, which let a
 * mistyped or stale link be indexed as real content. Living in the not-found
 * boundary instead means Next serves the identical page with a real 404.
 *
 * The metadata lives here rather than in the page's `generateMetadata`, which
 * Next discards once `notFound()` is thrown — without this the 404 shipped no
 * title at all, leaving the tab showing a bare URL.
 */
export const metadata: Metadata = postNotFoundMetadata('en');

const PostNotFound: FC = () => <BlogPostNotFound locale="en" />;

export default PostNotFound;
