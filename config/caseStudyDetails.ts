/**
 * The long form of each case study, for its own page at `/work/<slug>`.
 *
 * `caseStudies.ts` holds the short card the homepage shows; this file holds
 * what only the case page needs: the search-facing title and description, a
 * plain-language lede, and the story told at more length. Every fact here is
 * drawn from the CV and the career config. Nothing is added that they cannot
 * back up: no invented clients, numbers, or quotes.
 *
 * The copy is written for a buyer who does not write code. Technical detail
 * is kept for `technical`, which the page sets last.
 */

import type { CaseVisualId } from './caseStudies';

export interface CaseStudyDetail {
    /** The page's `h1`: who it was for and what was built, phrased the way someone would search for it. */
    heading: string;
    /** The `<title>`, before the layout's ` | Stefan Knoch`. Kept to 45 characters so the whole thing fits in 60. */
    metaTitle: string;
    /** Meta and share description, 140–160 characters. */
    description: string;
    /** One or two sentences under the heading, in plain words. */
    lede: string;
    /** Team size, when the CV gives one. */
    team?: string;
    problem: string[];
    did: string[];
    result: string[];
    /** The engineering detail, for readers who want it. */
    technical: string[];
    /** What the work is about, for the structured data's `about`. */
    topics: string[];
}

export const caseStudyDetails: Record<CaseVisualId, CaseStudyDetail> = {
    edithing: {
        heading: 'A legal text editor for the Parliament of Iceland',
        metaTitle: 'Legal Editor for the Parliament of Iceland',
        description: 'How I led the design of Edithing: an open-source editor built for the Parliament of Iceland to draft its legal codex, bills, and amendments in valid structure.',
        lede: 'The Parliament of Iceland writes its laws, bills, and amendments as long documents with a strict structure. I led the design and build of Edithing, an open-source editor that keeps that structure intact while people write.',
        problem: [
            'Icelandic law lives in deeply nested documents: chapters, articles, paragraphs, and numbered items. The structure is part of the law, not just its layout.',
            'Ordinary editors treat a document as running text. They flatten that structure or let it break, which leaves staff to check and repair it by hand.',
        ],
        did: [
            'I turned the structure of Icelandic legal documents into editing concepts and a technical design.',
            'I designed a document model that knows what a chapter, an article, a paragraph, and a numbered item are, and how they nest.',
            'The editor checks that model continuously, so every keystroke keeps the legal structure valid instead of leaving it to be fixed later.',
            'As lead architect I owned the system design, from the editor in the browser to the server and database behind it.',
        ],
        result: [
            'An open-source editor for drafting the Icelandic legal codex, bills, and amendments. The source is public on GitHub.',
            'It is my third production rich text editor, after Slimwiki and DirectMail.',
        ],
        technical: [
            'A typed, hierarchical document model on Slate.js with continuous normalization: after each change the editor checks the tree against the model and repairs it, so the document can never be saved in an invalid shape.',
            'TypeScript and React in the browser, with Zustand for state. Node.js and MySQL on the server.',
        ],
        topics: ['Legislative drafting', 'Rich text editor', 'Structured documents', 'Open source'],
    },
    bluereceipt: {
        heading: 'BlueReceipt: an SMS marketing platform for Shopify brands',
        metaTitle: 'Shopify SMS Marketing Platform: BlueReceipt',
        description: 'As technical co-founder of BlueReceipt, I built an SMS marketing platform for Shopify brands and led its team of six, with one typed data layer from DB to UI.',
        lede: 'BlueReceipt let Shopify brands market to their customers by text message. I co-founded it as the technical lead: I hired and led the developers and built the core of the platform myself.',
        team: 'Six developers',
        problem: [
            'Four things had to agree on the same data: the marketing automations, a collaborative editor for the messages, the brand\'s Shopify store, and Twilio, which sends the texts.',
            'Every message had to go out through Twilio reliably, within the brand\'s Shopify data.',
        ],
        did: [
            'I recruited and led a team of six developers while staying the lead hands-on engineer, and ran the project management.',
            'I set the architecture and the coding standards the team worked to.',
            'I built the core systems: the collaborative editing, the automation pipeline, and the Shopify and Twilio integrations.',
            'I chose infrastructure for cost as well as scale, and automated every deployment.',
        ],
        result: [
            'A schema change that broke something failed the build instead of reaching production.',
            'A team of six working to one set of standards, with deployments automated end to end.',
        ],
        technical: [
            'A fully typed data layer, from the database schema to a generated frontend SDK, including a custom ORM. A schema change that broke a caller failed the build instead of reaching production.',
            'One automation pipeline for schema sync, API docs, SDK generation, visual tests, and deploys.',
            'Containers on AWS ECS rather than serverless, defined and deployed with AWS CDK. TypeScript, React, Node.js, Koa, GraphQL, TypeORM, Redux-Saga, and MySQL.',
        ],
        topics: ['SMS marketing', 'Shopify integration', 'Marketing automation', 'Typed data layer'],
    },
    socialbee: {
        heading: 'Social-Bee: a tech department and platform built from zero',
        metaTitle: 'Tech Department from Zero for Social-Bee',
        description: 'How I built Social-Bee\'s tech and product department from zero in Germany: hiring the team, setting the process, and architecting its platform on AWS.',
        lede: 'Social-Bee helps immigrants in Germany with bureaucracy, courses, and resources. It had a clear mission and no tech team. I built the department, the process, and the platform.',
        problem: [
            'Social-Bee needed its own software, but had no developers, no designers, and no process for building a product.',
            'Everything had to start from nothing: the team, the process, and the platform itself.',
        ],
        did: [
            'I hired the developers and designers, set up how the team works, and trained them.',
            'I designed the product features and the user experience together with the organization\'s stakeholders.',
            'I designed and built the core platform and its AWS infrastructure, with automated pipelines for testing and releases.',
        ],
        result: [
            'A complete technical foundation, from the core platform to automated releases and the AWS infrastructure.',
            'An in-house team of developers and designers that I hired and mentored.',
        ],
        technical: [
            'TypeScript throughout: React in the browser, Node.js with Koa and TypeORM on the server, PostgreSQL for data.',
            'Infrastructure on AWS, with automated CI/CD pipelines.',
        ],
        topics: ['Building a tech team', 'Technical leadership', 'Product architecture', 'Immigrant support'],
    },
    eko: {
        heading: 'Eko: real-time messaging made twice as fast',
        metaTitle: 'Eko: 2× Faster Real-Time Messaging at Scale',
        description: 'At Eko, a $28M+ funded employee communication platform, I refactored real-time messaging for its iOS and Android apps: twice the performance and no more lag.',
        lede: 'Eko is an employee communication platform, funded with more than $28 million, used through its iOS and Android apps. Its messaging lagged under load. I fixed that.',
        problem: [
            'Real-time messaging is the core of a communication app, and Eko\'s lagged as the platform grew.',
            'The delay was visible to the people using the iOS and Android apps.',
        ],
        did: [
            'As a backend engineer, I refactored the core messaging system.',
            'I rewrote the high-traffic APIs the mobile apps depend on.',
            'I built full-text search, so people could find past messages.',
        ],
        result: [
            'Messaging performance doubled, and the lag people noticed was gone.',
            'The apps gained full-text message search.',
        ],
        technical: [
            'Node.js and TypeScript APIs serving the iOS and Android clients, on MongoDB and Redis.',
            'Full-text search on Elasticsearch, with Docker and AWS for running it.',
        ],
        topics: ['Real-time messaging', 'API performance', 'Mobile backend', 'Full-text search'],
    },
};
