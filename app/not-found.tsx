import React, { FC } from 'react';
import type { Metadata } from 'next';
import { NotFoundPanel } from '@/components/blog/NotFoundPanel';
import { ReadingShell } from '@/components/blog/ReadingShell';
import { GlobalChrome } from '@/components/chrome/GlobalChrome';
import { ContactFooter } from '@/components/home/contact/ContactFooter';
import { NavTools } from '@/components/nav/NavTools';
import { SiteNav } from '@/components/nav/SiteNav';

export const metadata: Metadata = {
    title: 'Page not found',
    description: 'The page you were looking for does not exist.',
    robots: {
        index: false,
        follow: true,
    },
};

/**
 * Catches every mistyped URL on the site. Without it Next serves its own bare
 * 404, which carries none of the site's chrome or type scale.
 */
const NotFound: FC = () => {
    return (
        <>
            <ReadingShell
                header={<SiteNav tools={<NavTools />} />}
                footer={<ContactFooter />}
            >
                <NotFoundPanel
                    kicker="404"
                    title="Page not found"
                    body="That page does not exist, or it has moved since the link was made."
                    actionHref="/"
                    actionLabel="Back to home"
                />
            </ReadingShell>

            <GlobalChrome />
        </>
    );
};

export default NotFound;
