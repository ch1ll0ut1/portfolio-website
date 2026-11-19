import { FC } from 'react';
import { notFound } from 'next/navigation';
import { EngagementTracker } from '@/components/analytics/EngagementTracker';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBlogPostData } from '@/lib/content/blogPosts';
import type { Locale } from '@/lib/i18n/locale';
import { blogPostBreadcrumbs, blogPostingSchema, breadcrumbSchema, jsonLdGraph } from '@/lib/structuredData';
import { Article } from '../Article';
import { ReadingShell } from '../ReadingShell';

interface Props {
    slug: string;
    locale: Locale;
}

/**
 * One article in `locale`: the body of `/blog/[slug]` and its German twin.
 *
 * An unknown slug renders the route's not-found page with a real 404.
 * Returning the panel from here answered 200, which made every stale link
 * indexable as real content. The route's layout (`BlogPostBoundary`) keeps the
 * throw from failing the document's server render.
 */
export const BlogPostPage: FC<Props> = ({ slug, locale }) => {
    const data = getBlogPostData(slug, locale);

    if (!data) {
        notFound();
    }

    const { post, newer, older, related } = data;

    return (
        <>
            <JsonLd data={jsonLdGraph(blogPostingSchema(post, locale), breadcrumbSchema(blogPostBreadcrumbs(post, locale)))} />

            <EngagementTracker pageType="blog_post" scrollTarget="article" />

            <ReadingShell>
                <Article post={post} locale={locale} newer={newer} older={older} related={related} />
            </ReadingShell>
        </>
    );
};
