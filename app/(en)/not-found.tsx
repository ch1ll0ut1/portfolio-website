import { FC } from 'react';
import type { Metadata } from 'next';
import { NotFoundPanel } from '@/components/blog/NotFoundPanel';
import { ReadingShell } from '@/components/blog/ReadingShell';

export const metadata: Metadata = {
    title: 'Page not found',
    description: 'The page you were looking for does not exist.',
    // Null, not `{ index: false }`: Next already answers every 404 with its
    // own `<meta name="robots" content="noindex">`, so a value here would only
    // add a second tag. Null still clears the layout's "index, follow".
    robots: null,
};

/**
 * Catches every mistyped URL on the site. Without it Next serves its own bare
 * 404, which carries none of the site's chrome or type scale.
 */
const NotFound: FC = () => {
    return (
        <ReadingShell>
            <NotFoundPanel
                kicker="404"
                title="Page not found"
                body="That page does not exist, or it has moved since the link was made."
                actionHref="/"
                actionLabel="Back to home"
            />
        </ReadingShell>
    );
};

export default NotFound;
