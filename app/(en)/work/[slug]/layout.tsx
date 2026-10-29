import { FC, ReactNode, Suspense } from 'react';
import { findCaseStudy } from '@/config/caseStudies';
import CaseStudyNotFound from './not-found';

interface Props {
    children: ReactNode;
    params: Promise<{ slug: string }>;
}

/**
 * Gives an unknown slug a Suspense boundary above the case's not-found
 * boundary, so the 404 keeps the root layout's server render. The reasoning is
 * the blog article's: see app/blog/[slug]/layout.tsx. A real case renders
 * without the boundary, so its prerendered HTML is not streamed out of order.
 */
const CaseStudyLayout: FC<Props> = async ({ children, params }) => {
    const { slug } = await params;

    if (findCaseStudy(slug)) {
        return children;
    }

    return (
        <Suspense fallback={<CaseStudyNotFound />}>
            {children}
        </Suspense>
    );
};

export default CaseStudyLayout;
