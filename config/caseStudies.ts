/**
 * The four case studies in the "Selected work" section.
 *
 * Each one reads problem → what I did → result, the structure the brief asks
 * for. The `id` doubles as the key of the illustration that runs in the case's
 * visual well, so adding a case means adding a matching visual module.
 */

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

export const caseStudies: CaseStudy[] = [
    {
        id: 'edithing',
        years: '2023–2025',
        role: 'Lead architect',
        title: 'Edithing',
        client: 'Parliament of Iceland',
        problem: 'Icelandic law lives in deeply nested documents: chapters, articles, paragraphs, and numbered items. Ordinary editors flatten that structure or break it.',
        did: 'Designed a typed, hierarchical document model on Slate.js with continuous normalization, so every keystroke keeps the legal structure valid. Shaped the editing concepts with parliamentary staff.',
        result: 'An open-source editor for drafting the legal codex, bills, and amendments. My third production rich text editor, after Slimwiki and DirectMail.',
        tags: ['TypeScript', 'React', 'Slate.js', 'Node.js', 'MySQL', 'Zustand'],
        link: {
            href: 'https://github.com/althingi-net/edithing',
            label: 'Read the source on GitHub',
        },
        metric: { value: '3rd', label: 'production editor' },
    },
    {
        id: 'bluereceipt',
        years: '2020–2021',
        role: 'Technical co-founder',
        title: 'BlueReceipt',
        client: 'SMS marketing for Shopify brands',
        problem: 'Marketing automation, collaborative editing, Shopify, and Twilio all had to agree on one data model, while thousands of SMS went out without tripping spam blocks or running up costs.',
        did: 'Built a fully typed data layer from database schema to a generated frontend SDK, including a custom ORM, and one automation pipeline for schema sync, API docs, SDK generation, visual tests, and deploys. Chose ECS over serverless on AWS CDK, and set the standards for a team of six.',
        result: 'A whole class of integration bugs eliminated: a schema change fails the build, not production.',
        tags: ['TypeScript', 'Koa', 'GraphQL', 'MySQL', 'AWS CDK', 'ECS'],
        metric: { value: 'DB → UI', label: 'one typed data layer' },
    },
    {
        id: 'socialbee',
        years: '2022–2023',
        role: 'Technical lead & product architect',
        title: 'Social-Bee',
        client: 'Immigrant support platform, Germany',
        problem: 'An organization helping immigrants through German bureaucracy, courses and resources had a mission and no tech team.',
        did: 'Built the tech and product department from zero: hired developers and designers, set up the process, designed the UX with stakeholders, and architected the platform on AWS with automated pipelines.',
        result: 'A complete technical foundation, from the core platform to CI/CD and AWS infrastructure, and an in-house team I hired and mentored.',
        tags: ['TypeScript', 'React', 'Node.js', 'TypeORM', 'PostgreSQL', 'AWS'],
        metric: { value: '0 → 1', label: 'tech department' },
    },
    {
        id: 'eko',
        years: '2015–2017',
        role: 'Senior full-stack developer',
        title: 'Eko',
        client: 'Employee communication, $28M+ funded',
        problem: 'Real-time messaging lagged under load for the iOS and Android apps of a fast-growing communication platform.',
        did: 'Refactored the core messaging system, rewrote the high-traffic APIs behind the mobile apps, and built full-text message search on Elasticsearch.',
        result: 'Messaging performance doubled and the user-facing lag was gone.',
        tags: ['Node.js', 'MongoDB', 'Redis', 'Elasticsearch', 'Docker', 'AWS'],
        metric: { value: '2×', label: 'messaging performance' },
    },
];
