import React, { FC } from 'react';
import type { Metadata } from 'next';
import { blogPosts } from '@/config/blog';
import { PageViewTracker } from '@/components/analytics/ClientAnalytics';
import { BlogIndex } from '@/components/blog/BlogIndex';
import { ReadingShell } from '@/components/blog/ReadingShell';
import { GlobalChrome } from '@/components/chrome/GlobalChrome';
import { ContactFooter } from '@/components/home/contact/ContactFooter';
import { NavTools } from '@/components/nav/NavTools';
import { SiteNav } from '@/components/nav/SiteNav';
import { JsonLd } from '@/components/seo/JsonLd';
import { absoluteUrl, siteConfig } from '@/config/site';
import { blogSchema } from '@/lib/structuredData';

const TITLE = 'Blog — Software engineering, tech leadership, and AI';
const DESCRIPTION = 'Writing on software engineering, technical leadership, hiring, and building software with AI, from years of shipping products and leading teams.';

export const metadata: Metadata = {
    // Absolute, so the layout's "| Stefan Knoch" template is not stacked onto a second separator.
    title: { absolute: `${TITLE} | ${siteConfig.name}` },
    description: DESCRIPTION,
    keywords: [
        'software engineering blog',
        'tech leadership',
        'hiring developers',
        'startups',
        'AI-assisted development',
        'software architecture',
        'TypeScript',
        'React',
    ],
    openGraph: {
        title: TITLE,
        description: DESCRIPTION,
        url: absoluteUrl('/blog'),
        type: 'website',
    },
    twitter: {
        title: TITLE,
        description: DESCRIPTION,
    },
    alternates: {
        canonical: '/blog',
    },
};

const Blog: FC = () => {
    return (
        <>
            <PageViewTracker
                pageName="Blog"
                pageType="blog"
            />
            <JsonLd data={blogSchema(blogPosts)} />

            <ReadingShell
                header={<SiteNav tools={<NavTools />} />}
                footer={<ContactFooter />}
            >
                <BlogIndex posts={blogPosts} />
            </ReadingShell>

            <GlobalChrome />
        </>
    );
};

export default Blog;
