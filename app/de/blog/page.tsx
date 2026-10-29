import { FC } from 'react';
import type { Metadata } from 'next';
import { BlogIndexPage } from '@/components/blog/pages/BlogIndexPage';
import { blogIndexMetadata } from '@/lib/blog/postMetadata';

export const metadata: Metadata = blogIndexMetadata('de');

/** The German writing index, the twin of `/blog`. */
const Blog: FC = () => <BlogIndexPage locale="de" />;

export default Blog;
