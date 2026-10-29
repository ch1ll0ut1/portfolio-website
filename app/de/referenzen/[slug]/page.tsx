import { FC } from 'react';
import type { Metadata } from 'next';
import { CaseStudyPage } from '@/components/work/pages/CaseStudyPage';
import { caseStudiesFor } from '@/config/caseStudies';
import { caseStudyMetadata } from '@/lib/work/caseStudyMetadata';

/*
 * `dynamicParams` stays at its default on purpose, as on the English case
 * study (app/(en)/work/[slug]/page.tsx): with `false` an unknown slug would
 * skip ./not-found.tsx.
 */

interface Props {
    params: Promise<{ slug: string }>;
}

/** One page per case study, generated at build time. */
export async function generateStaticParams() {
    return caseStudiesFor('de').map(study => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    return caseStudyMetadata(slug, 'de');
}

/** One German case study, the twin of `/work/[slug]`. */
const CaseStudy: FC<Props> = async ({ params }) => {
    const { slug } = await params;

    return <CaseStudyPage slug={slug} locale="de" />;
};

export default CaseStudy;
