/**
 * The three ways to work together: the homepage's services cards, the share
 * card, the homepage's `Offer` structured data and the English `/services`
 * page all read them from here.
 *
 * Each one is named by the buyer's problem; the trade term it is searched by
 * rides along as `subtitle`. One engagement is marked `featured`, which is what
 * earns it the raised surface, the parked caret and the traced border.
 */

import {
    FIRST_VERSION_RANGE_USD,
    RESCUE_RANGE_USD,
    TECH_LEAD_MIN_HOURS_PER_MONTH,
    usdRangeEn,
} from './pricing';

/** Anchor ids on `/services` and `/de/leistungen`, shared by both. */
export type EngagementId = 'rescue' | 'build' | 'tech-lead';

export interface Engagement {
    /** Stable key, and the section anchor on the services pages. */
    id: EngagementId;
    /** The buyer's problem, used as the card's heading. */
    name: string;
    /** The trade term a search uses for it, shown small under the name. */
    subtitle: string;
    /** A two- or three-word name, for the share card and structured data. */
    short: string;
    /** Who the engagement is for. */
    who: string;
    /** What the engagement covers, in plain words. */
    bullets: string[];
    /** The typical size of the engagement: a range or a minimum. */
    range: string;
    /** The recommended engagement. Exactly one is true. */
    featured: boolean;
}

/** A run of the closing paragraph, either plain or part of the selected phrase. */
export interface EngagementNoteSegment {
    text: string;
    /** Rendered as an editor text selection once the paragraph finishes writing. */
    selected: boolean;
}

export const engagements: Engagement[] = [
    {
        id: 'rescue',
        name: 'Fix or take over your app',
        subtitle: 'Code audit, security review & rescue',
        short: 'App rescue',
        who: 'For apps that are broken, stuck, or left behind by the last developer, including ones built with AI tools.',
        bullets: [
            'A plain-English health and security check, in about a week',
            'A fix plan ranked by cost, so you decide what is worth fixing',
            'Code, accounts, and access moved into your name',
            'Fixes shipped every week, starting with the riskiest',
        ],
        range: `Most rescues ${usdRangeEn(RESCUE_RANGE_USD)}`,
        featured: false,
    },
    {
        id: 'build',
        name: 'Build your app or MVP properly',
        subtitle: 'Full-stack MVP development · founding engineer',
        short: 'MVP builds',
        who: 'For founders with an idea, or a prototype that now has to become a real product.',
        bullets: [
            'A product plan in about a week: what to build first, and what it costs',
            'A working version you can click through every week',
            'Built on accounts you own, from the first day',
            'AI features where they actually help your users',
        ],
        range: `Most first versions ${usdRangeEn(FIRST_VERSION_RANGE_USD)}`,
        featured: true,
    },
    {
        id: 'tech-lead',
        name: 'A senior tech lead on your side',
        subtitle: 'Fractional CTO · part-time tech lead',
        short: 'Fractional CTO',
        who: 'For businesses with developers but no senior technical lead, or nobody technical in-house at all.',
        bullets: [
            'Reviews of your developers’ code and plans',
            'Help hiring developers you can trust',
            'A roadmap and budget in plain English',
            'A weekly call, and someone on your side in vendor meetings',
        ],
        range: `From about ${TECH_LEAD_MIN_HOURS_PER_MONTH} hours a month, cancel any time`,
        featured: false,
    },
];

export const engagementsHeading = {
    title: 'How I can help',
    lede: 'Pick the one that matches where you are. Every engagement starts with a free call and a written plan.',
};

export const engagementNote: EngagementNoteSegment[] = [
    {
        text: 'I use modern AI tools inside a reviewed process:',
        selected: false,
    },
    {
        text: 'senior quality, faster.',
        selected: true,
    },
    {
        text: 'Every line is checked by me.',
        selected: false,
    },
];

/** The label that precedes every card's range line. */
export const rangeLabel = 'Typical';

/** The card's link to its section on `/services`. */
export const engagementLink = {
    label: 'How it works and what it costs',
    href: (id: EngagementId) => `/services#${id}`,
};
