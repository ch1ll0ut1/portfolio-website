import type { WorkCopy } from './types';

export const workEn: WorkCopy = {
    heading: {
        title: 'Selected work',
        lede: 'Four projects where the difficult part was the whole point: structured documents, typed data from the database to the UI, a department built from nothing, and a messaging system under load.',
    },
    card: {
        problem: 'Problem',
        did: 'What I did',
        result: 'Result',
        readMore: 'Read the case study',
        readMoreAbout: title => `about ${title}`,
    },
    cases: {
        edithing: {
            role: 'Lead architect',
            client: 'Parliament of Iceland',
            problem: 'Icelandic law lives in deeply nested documents: chapters, articles, paragraphs, and numbered items. Ordinary editors flatten that structure or break it.',
            did: 'Designed a typed, hierarchical document model on Slate.js with continuous normalization, so every keystroke keeps the legal structure valid.',
            result: 'An open-source editor for drafting the legal codex, bills, and amendments. My third production rich text editor, after Slimwiki and DirectMail.',
            linkLabel: 'Read the source on GitHub',
            metricLabel: 'production editor',
        },
        bluereceipt: {
            role: 'Technical co-founder',
            client: 'SMS marketing for Shopify brands',
            problem: 'Marketing automation, collaborative editing, Shopify, and Twilio all had to agree on one data model, with every message going out through Twilio reliably.',
            did: 'Built a fully typed data layer from database schema to a generated frontend SDK, including a custom ORM, and one automation pipeline for schema sync, API docs, SDK generation, visual tests, and deploys. Chose ECS over serverless on AWS CDK, and set the standards for a team of six.',
            result: 'A schema change that broke something failed the build instead of reaching production, and deployments were automated end to end.',
            metricLabel: 'one typed data layer',
        },
        socialbee: {
            role: 'Technical lead & product architect',
            client: 'Immigrant support platform, Germany',
            problem: 'An organization helping immigrants with German bureaucracy, courses, and resources had a mission and no tech team.',
            did: 'Built the tech and product department from zero: hired developers and designers, set up the process, designed the UX with stakeholders, and architected the platform on AWS with automated pipelines.',
            result: 'A complete technical foundation, from the core platform to CI/CD and AWS infrastructure, and an in-house team I hired and mentored.',
            metricLabel: 'tech department',
        },
        eko: {
            role: 'Senior full-stack developer',
            client: 'Employee communication, $28M+ funded',
            problem: 'Real-time messaging lagged under load for the iOS and Android apps of a fast-growing communication platform.',
            did: 'Refactored the core messaging system, rewrote the high-traffic APIs behind the mobile apps, and built full-text message search on Elasticsearch.',
            result: 'Messaging performance doubled and the user-facing lag was gone.',
            metricLabel: 'messaging performance',
        },
    },
    moreProjects: {
        title: 'More projects',
        now: 'Now',
        projects: {
            'command-code': {
                name: 'Command&Code',
                description: 'Desktop app that adds a visual orchestration layer on top of Claude Code. In development.',
            },
            'fokus-nachhilfe': {
                name: 'Fokus-Nachhilfe.ch',
                description: 'Sole engineer on a Swiss tutoring company’s new customer platform.',
            },
            'directmail': {
                name: 'DirectMail',
                description: 'Rich text editor for structured email content, used by thousands.',
            },
            'slimwiki': {
                name: 'Slimwiki',
                description: 'Collaborative knowledge base with real-time editing and offline-first sync.',
            },
            'indycloud': {
                name: 'Indycloud',
                description: 'Zoomable maps of how enterprise data tables relate. Led development with a team of two.',
            },
            'hotel-visual-cms': {
                name: 'Hotel Visual CMS',
                description: 'Room-to-room walkthrough that feels 3D, made only of 2D transforms.',
            },
            'doctor-discovery': {
                name: 'Doctor discovery',
                description: 'Search engine for finding doctors abroad, built as sole developer.',
            },
        },
    },
    visuals: {
        edithing: {
            valid: 'valid',
            normalizing: 'normalizing',
            line: line => `Ln ${line}`,
        },
        bluereceipt: {
            title: 'typed data layer',
            layers: ['migration', 'custom ORM', 'generated', 'React'],
            clean: 'tsc · 0 errors',
            failed: 'tsc · 1 error',
            checking: 'tsc · checking',
            caught: 'Caught at build time, before it shipped.',
        },
        socialbee: {
            title: 'tech department',
            team: size => `team ${size}`,
            shipping: 'shipping',
            handover: 'handover',
            lead: 'tech lead',
            engineer: 'engineer',
            designer: 'designer',
            product: 'product',
        },
        eko: {
            title: 'messaging',
            before: 'before',
            after: 'after',
            throughput: 'throughput',
            latency: 'latency per message',
        },
    },
};
