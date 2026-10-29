import { FC } from 'react';
import type { Metadata } from 'next';
import { BlogIndexPage } from '@/components/blog/pages/BlogIndexPage';
import { blogIndexMetadata } from '@/lib/blog/postMetadata';

export const metadata: Metadata = blogIndexMetadata('en');

const Blog: FC = () => <BlogIndexPage locale="en" />;

export default Blog;
