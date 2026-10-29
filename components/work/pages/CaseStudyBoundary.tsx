import { FC, ReactNode, Suspense } from 'react';
import { findCaseStudy } from '@/config/caseStudies';
import type { Locale } from '@/lib/i18n/locale';
import { CaseStudyNotFound } from './CaseStudyNotFound';

interface Props {
    slug: string;
    locale: Locale;
    children: ReactNode;
}

/**
 * The body of a case study route's layout: gives an unknown slug a Suspense
 * boundary above the case's not-found boundary, so the 404 keeps the root
 * layout's server render. The reasoning is the blog article's: see
 * `BlogPostBoundary`. A real case renders without the boundary, so its
 * prerendered HTML is not streamed out of order.
 */
export const CaseStudyBoundary: FC<Props> = ({ slug, locale, children }) => {
    if (findCaseStudy(slug)) {
        return children;
    }

    return (
        <Suspense fallback={<CaseStudyNotFound locale={locale} />}>
            {children}
        </Suspense>
    );
};
