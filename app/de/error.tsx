'use client';

import { FC } from 'react';
import { ErrorPanel } from '@/components/blog/ErrorPanel';
import { ReadingShell } from '@/components/blog/ReadingShell';
import { errorsDe } from '@/config/errors/de';

interface Props {
    error: Error & { digest?: string };
    reset: () => void;
}

/** The German error boundary, below the German root layout; see app/(en)/error.tsx. */
const GermanRouteError: FC<Props> = ({ error, reset }) => {
    return (
        <ReadingShell>
            <ErrorPanel error={error} onRetry={reset} copy={errorsDe.error} locale="de" />
        </ReadingShell>
    );
};

export default GermanRouteError;
