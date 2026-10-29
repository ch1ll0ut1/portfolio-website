import { FC } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ReadingShell } from '@/components/blog/ReadingShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { CaseStudyArticle } from '@/components/work/CaseStudyArticle';
import { caseStudies, caseStudyPath, findCaseStudy } from '@/config/caseStudies';
import { caseStudyDetails } from '@/config/caseStudyDetails';
import { absoluteUrl, siteConfig } from '@/config/site';
import { baseOpenGraph } from '@/lib/baseOpenGraph';
import { caseStudyBreadcrumbs, caseStudySchema } from '@/lib/caseStudySchema';
import { breadcrumbSchema, jsonLdGraph } from '@/lib/structuredData';
import { twitterCard } from '@/lib/twitterCard';

/*
 * `dynamicParams` stays at its default on purpose, as on the blog article:
 * with `false` Next answers an unknown slug from the root not-found page and
 * skips ./not-found.tsx and its way back to the work section. Every case is
 * still generated at build time, and an unknown slug still answers 404.
 */

/** One page per case study, generated at build time. */
export async function generateStaticParams() {
    return caseStudies.map(study => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const study = findCaseStudy(slug);

    // Matches ./not-found.tsx, robots included; see app/blog/[slug]/page.tsx.
    if (!study) {
        return {
            title: 'Case study not found',
            description: 'That case study does not exist, or its link has changed.',
            robots: null,
        };
    }

    const detail = caseStudyDetails[study.id];
    const path = caseStudyPath(study);
    /** What the share cards show: the page title with the layout's name suffix. */
    const shareTitle = `${detail.metaTitle} | ${siteConfig.name}`;

    return {
        title: detail.metaTitle,
        description: detail.description,
        openGraph: {
            ...baseOpenGraph,
            title: shareTitle,
            description: detail.description,
            url: absoluteUrl(path),
            type: 'article',
            authors: [siteConfig.name],
            tags: study.tags,
        },
        twitter: twitterCard(shareTitle, detail.description),
        alternates: {
            canonical: path,
        },
    };
}

const CaseStudyPage: FC<{ params: Promise<{ slug: string }> }> = async ({ params }) => {
    const { slug } = await params;
    const study = findCaseStudy(slug);

    // Renders ./not-found.tsx with a real 404; ./layout.tsx keeps the throw
    // from failing the document's server render.
    if (!study) {
        notFound();
    }

    const detail = caseStudyDetails[study.id];

    return (
        <>
            <JsonLd data={jsonLdGraph(caseStudySchema(study, detail), breadcrumbSchema(caseStudyBreadcrumbs(study)))} />

            <ReadingShell>
                <CaseStudyArticle study={study} />
            </ReadingShell>
        </>
    );
};

export default CaseStudyPage;
