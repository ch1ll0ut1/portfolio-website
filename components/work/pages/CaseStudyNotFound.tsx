import { FC } from 'react';
import { NotFoundPanel } from '@/components/blog/NotFoundPanel';
import { ReadingShell } from '@/components/blog/ReadingShell';
import { workCopy } from '@/config/caseStudyDetails';
import type { Locale } from '@/lib/i18n/locale';
import { localizedPath } from '@/lib/i18n/paths';

interface Props {
    locale: Locale;
}

/** The 404 of a case study slug that matches no case, in `locale`, with the way back to the work section. */
export const CaseStudyNotFound: FC<Props> = ({ locale }) => {
    const copy = workCopy[locale].notFound;

    return (
        <ReadingShell>
            <NotFoundPanel
                kicker="404"
                title={copy.title}
                body={copy.body}
                actionHref={localizedPath(locale, '/#work')}
                actionLabel={copy.action}
            />
        </ReadingShell>
    );
};
