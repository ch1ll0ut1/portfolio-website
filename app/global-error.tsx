'use client';

import React, { FC } from 'react';
import './globals.css';
import { ErrorPanel } from '@/components/blog/ErrorPanel';
import { ReadingShell } from '@/components/blog/ReadingShell';

interface Props {
    error: Error & { digest?: string };
    reset: () => void;
}

/**
 * The last resort, for an error in the root layout itself. It replaces that
 * layout, so it brings its own `<html>` and `<body>` and the global styles. The
 * web fonts are not loaded here — the font stacks fall back to system faces —
 * since whatever broke the layout may be what loads them.
 */
const GlobalError: FC<Props> = ({ error, reset }) => {
    return (
        <html lang="en">
            <body>
                <ReadingShell>
                    <ErrorPanel error={error} onRetry={reset} />
                </ReadingShell>
            </body>
        </html>
    );
};

export default GlobalError;
