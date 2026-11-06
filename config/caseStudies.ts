/**
 * The four case studies in the "Selected work" section.
 *
 * Each also has its own page at `/work/<slug>`, whose longer copy lives in
 * `caseStudyDetails.ts`. The words of the card (role, client, the story and
 * the labels) are in the work section's dictionary, `config/home/work/`.
 *
 * Each one reads problem → what I did → result, the structure the brief asks
 * for. The `id` doubles as the key of the illustration that runs in the case's
 * visual well, so adding a case means adding a matching visual module.
 */

import type { Locale } from '@/lib/i18n/locale';
import { workCopy } from './home/work';

/** Illustrations available in `components/home/work/visuals`. */
export type CaseVisualId = 'edithing' | 'bluereceipt' | 'socialbee' | 'eko';

export interface CaseMetric {
    /** The number itself, set in display type. */
    value: string;
    /** What the number counts. */
    label: string;
}

export interface CaseLink {
    href: string;
    label: string;
}

export interface CaseStudy {
    /** Anchor-safe id, and the illustration key. */
    id: CaseVisualId;
    /** URL segment of the case's own page, `/work/<slug>`. Keyword-bearing, and never changed once live. */
    slug: string;
    /** Years worked, as shown. */
    years: string;
    /** Role held on the project. */
    role: string;
    title: string;
    /** Who it was for, in one line. */
    client: string;
    problem: string;
    /** The "What I did" body. */
    did: string;
    result: string;
    tags: string[];
    /** Optional outbound link, e.g. public source. */
    link?: CaseLink;
    metric: CaseMetric;
}

/** What a case study is apart from its words. */
interface CaseStudyData {
    id: CaseVisualId;
    slug: string;
    years: string;
    /** The project's name. */
    title: string;
    tags: string[];
    /** Target of the outbound link; its label is in the dictionary. */
    linkHref?: string;
    /** The figure: one for both languages, or one per language where it is a word, such as an ordinal. */
    metricValue: string | Record<Locale, string>;
}

const caseStudyData: CaseStudyData[] = [
    {
        id: 'edithing',
        slug: 'parliament-of-iceland-legislative-editor',
        years: '2023–2025',
        title: 'Edithing',
        tags: ['TypeScript', 'React', 'Slate.js', 'Node.js', 'MySQL', 'Zustand'],
        linkHref: 'https://github.com/althingi-net/edithing',
        metricValue: { en: '3rd', de: '3.' },
    },
    {
        id: 'bluereceipt',
        slug: 'bluereceipt-shopify-sms-marketing-platform',
        years: '2020–2021',
        title: 'BlueReceipt',
        tags: ['TypeScript', 'Koa', 'GraphQL', 'MySQL', 'AWS CDK', 'ECS'],
        metricValue: 'DB → UI',
    },
    {
        id: 'socialbee',
        slug: 'social-bee-tech-department-from-zero',
        years: '2022–2023',
        title: 'Social-Bee',
        tags: ['TypeScript', 'React', 'Node.js', 'TypeORM', 'PostgreSQL', 'AWS'],
        metricValue: '0 → 1',
    },
    {
        id: 'eko',
        slug: 'eko-real-time-messaging-performance',
        years: '2015–2017',
        title: 'Eko',
        tags: ['Node.js', 'MongoDB', 'Redis', 'Elasticsearch', 'Docker', 'AWS'],
        metricValue: '2×',
    },
];

/**
 * Cases moved to the front in a language. German readers, mostly DACH
 * buyers, meet the German client first; the rest keep their order.
 */
const leadingCases: Record<Locale, CaseVisualId[]> = {
    en: [],
    de: ['socialbee'],
};

const inLocaleOrder = (locale: Locale) => {
    const leading = leadingCases[locale];

    return [
        ...caseStudyData.filter(data => leading.includes(data.id)),
        ...caseStudyData.filter(data => !leading.includes(data.id)),
    ];
};

/** The case studies, in card order, told in `locale`. */
export const caseStudiesFor = (locale: Locale): CaseStudy[] => inLocaleOrder(locale).map((data) => {
    const { linkLabel, metricLabel, ...story } = workCopy[locale].cases[data.id];

    return {
        id: data.id,
        slug: data.slug,
        years: data.years,
        role: story.role,
        title: data.title,
        client: story.client,
        problem: story.problem,
        did: story.did,
        result: story.result,
        tags: data.tags,
        ...(data.linkHref !== undefined && linkLabel !== undefined && { link: { href: data.linkHref, label: linkLabel } }),
        metric: { value: typeof data.metricValue === 'string' ? data.metricValue : data.metricValue[locale], label: metricLabel },
    };
});

/** The case studies in English, which the `/work` pages, the sitemap and the services page read. */
export const caseStudies = caseStudiesFor('en');

/** The case study whose page is `/work/<slug>`, if there is one. */
export const findCaseStudy = (slug: string) => caseStudies.find(study => study.slug === slug);

export { caseStudyPath } from './pagePaths';
