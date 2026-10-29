import { FC, ReactNode } from 'react';
import { CaseStudyBoundary } from '@/components/work/pages/CaseStudyBoundary';

interface Props {
    children: ReactNode;
    params: Promise<{ slug: string }>;
}

/** Keeps an unknown slug's 404 inside the root layout's server render; see `CaseStudyBoundary`. */
const CaseStudyLayout: FC<Props> = async ({ children, params }) => {
    const { slug } = await params;

    return <CaseStudyBoundary slug={slug} locale="de">{children}</CaseStudyBoundary>;
};

export default CaseStudyLayout;
