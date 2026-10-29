'use client';

import { FC } from 'react';
import { ErrorPanel } from '@/components/blog/ErrorPanel';
import { ReadingShell } from '@/components/blog/ReadingShell';

interface Props {
    error: Error & { digest?: string };
    reset: () => void;
}

/**
 * Catches a render error in any route below the root layout. The layout — and
 * with it the fonts, theme, consent and the site chrome — survives, so only the
 * page is swapped for the panel. An error in the chrome itself happens in the
 * layout, out of this boundary's reach, and lands in global-error instead.
 *
 * Next preloads a boundary's CSS on every page under it, so the panel can
 * paint the moment something throws: each route sends `<link rel="preload"
 * as="style">` for the NotFoundPanel and ReadingShell chunks, and Chromium
 * logs "preloaded but not used" on the pages that never need them. That is
 * Next's choice (server/app-render/render-css-resource.js), with no option to
 * turn it off. Loading the panel lazily would silence it, but would also make
 * the error page depend on one more chunk download, often what just failed.
 */
const RouteError: FC<Props> = ({ error, reset }) => {
    return (
        <ReadingShell>
            <ErrorPanel error={error} onRetry={reset} />
        </ReadingShell>
    );
};

export default RouteError;
