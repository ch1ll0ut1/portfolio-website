import { FC } from 'react';
import type { Metadata } from 'next';
import { NotFoundPanel } from '@/components/blog/NotFoundPanel';
import { ReadingShell } from '@/components/blog/ReadingShell';
import { localizedPath } from '@/lib/i18n/paths';

export const metadata: Metadata = {
    title: 'Seite nicht gefunden',
    description: 'Die gesuchte Seite gibt es nicht.',
    // Null for the reason given in app/(en)/not-found.tsx: Next adds its own noindex.
    robots: null,
};

/**
 * The German 404, for every unknown path under `/de` (app/de/[...missing])
 * and every `notFound()` in a German page without a closer boundary.
 */
const GermanNotFound: FC = () => {
    return (
        <ReadingShell>
            <NotFoundPanel
                kicker="404"
                title="Seite nicht gefunden"
                body="Diese Seite gibt es nicht, oder sie ist umgezogen, seit der Link entstanden ist."
                actionHref={localizedPath('de', '/')}
                actionLabel="Zur Startseite"
            />
        </ReadingShell>
    );
};

export default GermanNotFound;
