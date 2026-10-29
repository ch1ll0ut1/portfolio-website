/**
 * The shapes of a case study page's copy: the long form of each case
 * (`CaseStudyDetail`) and the words of the page around it (`WorkCopy`).
 * The facts the page shows — years, tags, the outbound link, the metric — come
 * from `config/caseStudies.ts`.
 */

import type { CaseVisualId } from '../caseStudies';

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

/** The words of the `/work/<slug>` pages in one language. */
export interface WorkCopy {
    /** Each case told in full. */
    details: Record<CaseVisualId, CaseStudyDetail>;
    breadcrumbs: {
        label: string;
        home: string;
        work: string;
    };
    kicker: string;
    facts: {
        client: string;
        role: string;
        years: string;
        team: string;
    };
    story: {
        problem: string;
        did: string;
        result: string;
        stack: string;
    };
    /** The closing call to action and the list of the other cases. */
    next: {
        title: string;
        body: string;
        services: string;
        contact: string;
        others: string;
    };
    card: {
        alt: (name: string) => string;
        /** The card's kicker, "case study". */
        kicker: string;
        /** The first part of its meta line, "work · 2023–2025 · Lead architect". */
        metaKicker: string;
    };
}
