'use client';

import { FC } from 'react';
import { usePathname } from 'next/navigation';
import './globals.css';
import { ErrorPanel } from '@/components/blog/ErrorPanel';
import { ReadingShell } from '@/components/blog/ReadingShell';
import { errorsCopy } from '@/config/errors';
import { localeFromPath } from '@/lib/i18n/paths';

interface Props {
    error: Error & { digest?: string };
    reset: () => void;
}

/**
 * The last resort, for an error in the root layout itself. It replaces that
 * layout, so it brings its own `<html>` and `<body>` and the global styles. The
 * web fonts are not loaded here — the font stacks fall back to system faces —
 * since whatever broke the layout may be what loads them.
 *
 * It sits above both root layouts, so the language comes from the URL, and
 * it is the one client module that holds both languages' words: the error
 * panel's few lines, in config/errors.
 */
const GlobalError: FC<Props> = ({ error, reset }) => {
    const locale = localeFromPath(usePathname());

    return (
        <html lang={locale}>
            <body>
                <ReadingShell>
                    <ErrorPanel error={error} onRetry={reset} copy={errorsCopy[locale].error} locale={locale} />
                </ReadingShell>
            </body>
        </html>
    );
};

export default GlobalError;
