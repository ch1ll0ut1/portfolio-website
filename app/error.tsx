'use client';

import React, { FC } from 'react';
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
 */
const RouteError: FC<Props> = ({ error, reset }) => {
    return (
        <ReadingShell>
            <ErrorPanel error={error} onRetry={reset} />
        </ReadingShell>
    );
};

export default RouteError;
