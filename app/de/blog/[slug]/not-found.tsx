import { FC } from 'react';
import type { Metadata } from 'next';
import { NotFoundPage } from '@/components/errors/NotFoundPage';
import { notFoundMetadata } from '@/components/errors/notFoundMetadata';

/** Shown when `/de/blog/[slug]` matches no post, with a real 404, as on the English article. */
export const metadata: Metadata = notFoundMetadata('de', 'post');

const PostNotFound: FC = () => <NotFoundPage locale="de" kind="post" />;

export default PostNotFound;
