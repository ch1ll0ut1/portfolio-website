import { FC } from 'react';
import { notFound } from 'next/navigation';
import { ReadingShell } from '@/components/blog/ReadingShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { caseStudiesFor } from '@/config/caseStudies';
import { caseStudyDetailsFor } from '@/config/caseStudyDetails';
import { caseStudyBreadcrumbs, caseStudySchema } from '@/lib/caseStudySchema';
import type { Locale } from '@/lib/i18n/locale';
import { breadcrumbSchema, jsonLdGraph } from '@/lib/structuredData';
import { CaseStudyArticle } from '../CaseStudyArticle';

interface Props {
    slug: string;
    locale: Locale;
}

/**
 * One case study in `locale`: the body of `/work/[slug]` and its German twin.
 * An unknown slug renders the route's not-found page with a real 404; the
 * route's layout (`CaseStudyBoundary`) keeps the throw from failing the
 * document's server render.
 */
export const CaseStudyPage: FC<Props> = ({ slug, locale }) => {
    const study = caseStudiesFor(locale).find(candidate => candidate.slug === slug);

    if (!study) {
        notFound();
    }

    const detail = caseStudyDetailsFor(locale)[study.id];

    return (
        <>
            <JsonLd data={jsonLdGraph(caseStudySchema(study, detail, locale), breadcrumbSchema(caseStudyBreadcrumbs(study, locale)))} />

            <ReadingShell>
                <CaseStudyArticle study={study} locale={locale} />
            </ReadingShell>
        </>
    );
};
