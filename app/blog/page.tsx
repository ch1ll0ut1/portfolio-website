import { FC } from 'react';
import type { Metadata } from 'next';
import { blogPosts } from '@/config/blog';
import { BlogIndex } from '@/components/blog/BlogIndex';
import { ReadingShell } from '@/components/blog/ReadingShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { absoluteUrl, siteConfig } from '@/config/site';
import { baseOpenGraph } from '@/lib/baseOpenGraph';
import { blogSchema, jsonLdGraph } from '@/lib/structuredData';
import { twitterCard } from '@/lib/twitterCard';

const TITLE = 'Blog — Software engineering, tech leadership, and AI';
const DESCRIPTION = 'Writing on software engineering, technical leadership, hiring, and building software with AI, from years of shipping products and leading teams.';

export const metadata: Metadata = {
    // Absolute, so the layout's "| Stefan Knoch" template is not stacked onto a second separator.
    title: { absolute: `${TITLE} | ${siteConfig.name}` },
    description: DESCRIPTION,
    openGraph: {
        ...baseOpenGraph,
        title: TITLE,
        description: DESCRIPTION,
        url: absoluteUrl('/blog'),
        type: 'website',
    },
    twitter: twitterCard(TITLE, DESCRIPTION),
    alternates: {
        canonical: '/blog',
    },
};

const Blog: FC = () => {
    return (
        <>
            <JsonLd data={jsonLdGraph(blogSchema(blogPosts))} />

            <ReadingShell>
                <BlogIndex posts={blogPosts} />
            </ReadingShell>
        </>
    );
};

export default Blog;
