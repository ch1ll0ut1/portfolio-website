import { FC } from 'react';
import { JsonLd } from '@/components/seo/JsonLd';
import { listBlogPosts } from '@/lib/content/blogPosts';
import type { Locale } from '@/lib/i18n/locale';
import { blogSchema, jsonLdGraph } from '@/lib/structuredData';
import { BlogIndex } from '../BlogIndex';
import { ReadingShell } from '../ReadingShell';

interface Props {
    locale: Locale;
}

/** The writing index in `locale`: the body of `/blog` and its German twin. */
export const BlogIndexPage: FC<Props> = ({ locale }) => {
    const posts = listBlogPosts(locale);

    return (
        <>
            <JsonLd data={jsonLdGraph(blogSchema(posts, locale))} />

            <ReadingShell>
                <BlogIndex posts={posts} locale={locale} />
            </ReadingShell>
        </>
    );
};
