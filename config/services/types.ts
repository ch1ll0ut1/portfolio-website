/**
 * The shape of the services page's copy. `/services` and `/de/leistungen`
 * render the same components from one object of this type each, so the two
 * languages cannot drift apart in structure, only in words.
 */

import type { EngagementId } from '../engagements';
import type { CaseVisualId } from '../caseStudies';

export type ServicesLanguage = 'en' | 'de';

/** One engagement, told in full on the services page. */
export interface ServiceOfferCopy {
    id: EngagementId;
    name: string;
    /** The trade term a search uses for it. */
    subtitle: string;
    /** The problem in the buyer's own words. */
    problem: string;
    forWho: string;
    youGet: string[];
    /** The steps in order: the free call, the first week, then the weekly rhythm. */
    howItRuns: string[];
    /** The typical size: the first step and the usual total. */
    range: string;
    /** Work from the CV that shows this has been done before. */
    proof: string[];
}

export interface ChooserRow {
    situation: string;
    offerId: EngagementId;
}

export interface ProcessStepCopy {
    title: string;
    description: string;
}

export interface TimeZoneCopy {
    region: string;
    detail: string;
}

export interface OutcomeCopy {
    /** The case study it summarizes; its title is the project's name. */
    caseId: CaseVisualId;
    client: string;
    outcome: string;
}

export interface FaqCopy {
    question: string;
    answer: string;
}

export interface ServicesPageCopy {
    lang: ServicesLanguage;
    /** This page's path, which is also its canonical URL. */
    path: string;
    meta: {
        title: string;
        description: string;
        /** `og:locale`, such as `de_DE`. */
        locale: string;
        /** The share card's mono label. */
        shareKicker: string;
        /** The phrase of `hero.title` the share card selects. */
        shareHighlight: string;
    };
    breadcrumbs: {
        home: string;
        page: string;
    };
    /** The visible link to the same page in the other language. */
    otherLanguage: {
        label: string;
        lang: ServicesLanguage;
        href: string;
    };
    hero: {
        kicker: string;
        title: string;
        lede: string;
        callLabel: string;
        writeLabel: string;
    };
    chooser: {
        title: string;
        rows: ChooserRow[];
    };
    labels: {
        forWho: string;
        youGet: string;
        howItRuns: string;
        typical: string;
        proof: string;
        offerCta: string;
        /** Says the ranges are a guide and the billing hourly. */
        billing: string;
    };
    offers: ServiceOfferCopy[];
    process: {
        title: string;
        lede: string;
        steps: ProcessStepCopy[];
    };
    timeZones: {
        title: string;
        lede: string;
        zones: TimeZoneCopy[];
        languages: string;
        privacy: string;
    };
    outcomes: {
        title: string;
        lede: string;
        /** Each outcome's link to its case study page; the project's name follows, visually hidden. */
        linkLabel: string;
        items: OutcomeCopy[];
    };
    fit: {
        title: string;
        goodTitle: string;
        good: string[];
        notTitle: string;
        not: string[];
    };
    faq: {
        title: string;
        items: FaqCopy[];
    };
    cta: {
        title: string;
        lede: string;
    };
}
