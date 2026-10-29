import { FC } from 'react';
import type { Metadata } from 'next';
import { CaseStudyPage } from '@/components/work/pages/CaseStudyPage';
import { caseStudiesFor } from '@/config/caseStudies';
import { caseStudyMetadata } from '@/lib/work/caseStudyMetadata';

/*
 * `dynamicParams` stays at its default on purpose, as on the blog article:
 * with `false` Next answers an unknown slug from the root not-found page and
 * skips ./not-found.tsx and its way back to the work section. Every case is
 * still generated at build time, and an unknown slug still answers 404.
 */

interface Props {
    params: Promise<{ slug: string }>;
}

/** One page per case study, generated at build time. */
export async function generateStaticParams() {
    return caseStudiesFor('en').map(study => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    return caseStudyMetadata(slug, 'en');
}

const CaseStudy: FC<Props> = async ({ params }) => {
    const { slug } = await params;

    return <CaseStudyPage slug={slug} locale="en" />;
};

export default CaseStudy;
