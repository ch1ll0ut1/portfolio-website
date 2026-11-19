import { FC } from 'react';
import type { Metadata } from 'next';
import { NotFoundPage } from '@/components/errors/NotFoundPage';
import { notFoundMetadata } from '@/components/errors/notFoundMetadata';

/**
 * Shown when `/blog/[slug]` matches no post.
 *
 * The page used to render this panel inline and answer 200, which let a
 * mistyped or stale link be indexed as real content. Living in the not-found
 * boundary instead means Next serves the identical page with a real 404.
 */
export const metadata: Metadata = notFoundMetadata('en', 'post');

const PostNotFound: FC = () => <NotFoundPage locale="en" kind="post" />;

export default PostNotFound;
