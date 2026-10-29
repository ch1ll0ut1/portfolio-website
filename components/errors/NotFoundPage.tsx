import { FC } from 'react';
import { NotFoundPanel } from '@/components/blog/NotFoundPanel';
import { ReadingShell } from '@/components/blog/ReadingShell';
import { type NotFoundKind, errorsCopy } from '@/config/errors';
import type { Locale } from '@/lib/i18n/locale';
import { localizedPath } from '@/lib/i18n/paths';

interface Props {
    locale: Locale;
    kind: NotFoundKind;
}

/** Where each 404 sends the visitor on, as an English path. */
const ACTION_PATHS: Record<NotFoundKind, string> = {
    page: '/',
    post: '/blog',
    caseStudy: '/#work',
};

/**
 * The body of every not-found boundary, in the page's language: the site-wide
 * 404 and the blog's and case studies' missing-slug pages. Each `not-found.tsx`
 * is one line around it, with `notFoundMetadata` for its metadata.
 */
export const NotFoundPage: FC<Props> = ({ locale, kind }) => {
    const copy = errorsCopy[locale].notFound[kind];

    return (
        <ReadingShell>
            <NotFoundPanel
                kicker="404"
                title={copy.title}
                body={copy.body}
                actionHref={localizedPath(locale, ACTION_PATHS[kind])}
                actionLabel={copy.action}
            />
        </ReadingShell>
    );
};
