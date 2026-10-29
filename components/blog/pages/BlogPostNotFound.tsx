import { FC } from 'react';
import { blogCopy } from '@/config/blog';
import type { Locale } from '@/lib/i18n/locale';
import { localizedPath } from '@/lib/i18n/paths';
import { NotFoundPanel } from '../NotFoundPanel';
import { ReadingShell } from '../ReadingShell';

interface Props {
    locale: Locale;
}

/**
 * The 404 of an article slug that matches no post, in `locale`, with the way
 * back to the index. The route's `not-found.tsx` renders it, so Next serves it
 * with a real 404 status.
 */
export const BlogPostNotFound: FC<Props> = ({ locale }) => {
    const copy = blogCopy[locale].notFound;

    return (
        <ReadingShell>
            <NotFoundPanel
                kicker="404"
                title={copy.title}
                body={copy.body}
                actionHref={localizedPath(locale, '/blog')}
                actionLabel={copy.action}
            />
        </ReadingShell>
    );
};
