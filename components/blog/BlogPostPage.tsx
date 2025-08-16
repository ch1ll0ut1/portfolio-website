import React, { FC } from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BlogPostHeader } from '@/components/blog/BlogPostHeader';
import { Markdown } from '@/components/markdown/Markdown';
import { BlogPost } from '@/config/blog';

interface Props {
    post: BlogPost & { content: string };
}

/**
 * Individual blog post page component containing post content and navigation.
 * Extracted from the blog post page.tsx file for better component isolation.
 */
const BlogPostPage: FC<Props> = ({ post }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
            <Header currentPage="blog" />

            <article className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <nav aria-label="Breadcrumb" className="mb-8">
                        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/" className="hover:text-primary transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>/</li>
                            <li>
                                <Link href="/blog" className="hover:text-primary transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>/</li>
                            <li className="text-primary">{post.title}</li>
                        </ol>
                    </nav>

                    <BlogPostHeader post={post} />
                    <Markdown content={post.content} />
                </div>
            </article>

            <Footer />
        </div>
    );
};

export default BlogPostPage;
