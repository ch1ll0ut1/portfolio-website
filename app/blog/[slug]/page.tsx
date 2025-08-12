import React, { FC } from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BlogPostHeader } from '@/components/blog/BlogPostHeader';
import { BlogPostContent } from '@/components/blog/BlogPostContent';
import { blogPosts } from '@/config/blog';
import { readMarkdownFile } from '@/lib/markdownProcessor';

/**
 * Gets blog post data and content from configuration and markdown files.
 * Returns post metadata and parsed markdown content.
 */
function getBlogPostData(slug: string) {
    const postMetadata = blogPosts.find(p => p.slug === slug);
    if (!postMetadata) return null;

    const markdownContent = readMarkdownFile(slug);
    if (!markdownContent) return null;

    return {
        ...postMetadata,
        content: markdownContent,
    };
}

const BlogPost: FC<{ params: Promise<{ slug: string }> }> = async ({ params }) => {
    const { slug } = await params;
    const post = getBlogPostData(slug);

    if (!post) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-primary mb-4">Post Not Found</h1>
                    <Link href="/blog">
                        <Button>Back to Blog</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
            {/* Header */}
            <Header currentPage="blog" />

            {/* Article */}
            <article className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Blog
                    </Link>

                    <BlogPostHeader post={post} />
                    <BlogPostContent content={post.content} />
                </div>
            </article>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default BlogPost;
