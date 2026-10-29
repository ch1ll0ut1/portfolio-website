import { FC } from 'react';
import type { Metadata } from 'next';
import { NotFoundPanel } from '@/components/blog/NotFoundPanel';
import { ReadingShell } from '@/components/blog/ReadingShell';

/**
 * Shown when `/work/[slug]` matches no case study, with a real 404. The
 * metadata lives here because Next discards the page's once `notFound()` is
 * thrown; `robots: null` leaves the `noindex` to Next, as on the blog.
 */
export const metadata: Metadata = {
    title: 'Case study not found',
    description: 'That case study does not exist, or its link has changed.',
    robots: null,
};

const CaseStudyNotFound: FC = () => {
    return (
        <ReadingShell>
            <NotFoundPanel
                kicker="404"
                title="Case study not found"
                body="That case study does not exist, or its link has changed since it was shared."
                actionHref="/#work"
                actionLabel="All work"
            />
        </ReadingShell>
    );
};

export default CaseStudyNotFound;
