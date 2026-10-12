import React, { FC } from 'react';
import type { Metadata } from 'next';
import { NotFoundPanel } from '@/components/blog/NotFoundPanel';
import { ReadingShell } from '@/components/blog/ReadingShell';
import { GlobalChrome } from '@/components/chrome/GlobalChrome';
import { ContactFooter } from '@/components/home/contact/ContactFooter';
import { NavTools } from '@/components/nav/NavTools';
import { SiteNav } from '@/components/nav/SiteNav';

/**
 * Shown when `/blog/[slug]` matches no post.
 *
 * The page used to render this panel inline and answer 200, which let a
 * mistyped or stale link be indexed as real content. Living in the not-found
 * boundary instead means Next serves the identical page with a real 404.
 *
 * The metadata lives here rather than in the page's `generateMetadata`, which
 * Next discards once `notFound()` is thrown — without this the 404 shipped no
 * title at all, leaving the tab showing a bare URL.
 */
export const metadata: Metadata = {
    title: 'Post not found',
    description: 'That article does not exist, or its link has changed.',
    robots: {
        index: false,
        follow: true,
    },
};

const PostNotFound: FC = () => {
    return (
        <>
            <ReadingShell
                header={<SiteNav tools={<NavTools />} />}
                footer={<ContactFooter />}
            >
                <NotFoundPanel
                    kicker="404"
                    title="Post not found"
                    body="That article does not exist, or its link has changed since it was shared."
                    actionHref="/blog"
                    actionLabel="All articles"
                />
            </ReadingShell>

            {/* Scroll progress stays on: there is no article here to own it. */}
            <GlobalChrome />
        </>
    );
};

export default PostNotFound;
