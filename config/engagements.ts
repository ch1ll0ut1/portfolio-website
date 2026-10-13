/**
 * The three engagement models offered on the homepage's services section.
 *
 * Copy is the design's, verbatim. One engagement is marked `featured`, which is
 * what earns it the raised surface, the parked caret and the traced border.
 */

export interface Engagement {
    /** Stable key for list rendering and tests. */
    id: string;
    /** Engagement name, used as the card's heading. */
    name: string;
    /** Who the engagement is for. */
    who: string;
    /** What the engagement covers. */
    bullets: string[];
    /** Commercial shape — cadence, length or scope. */
    format: string;
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
        id: 'fractional-cto',
        name: 'Fractional CTO',
        who: 'For teams without a CTO, or between two of them.',
        bullets: [
            'Technology roadmap and architecture decisions',
            'Hiring plan, interviews, and team setup',
            'Delivery process that ships every week',
            'Build-vs-buy, infrastructure cost, and compliance calls (GDPR, HIPAA)',
        ],
        format: '1–3 days a week, monthly retainer',
        featured: false,
    },
    {
        id: 'founding-engineer',
        name: 'Founding engineer',
        who: 'For founders who need the product built properly from the first commit.',
        bullets: [
            'Architecture, backend, frontend, and cloud, end to end',
            'Next.js, React, Node.js, PostgreSQL, and AWS or Vercel',
            'Tests, CI/CD, and monitoring from day one',
            'Shipped to production in weekly increments',
        ],
        format: 'Contract, three months or longer',
        featured: true,
    },
    {
        id: 'architecture-review',
        name: 'Architecture review',
        who: 'For codebases that have stopped moving, including AI-generated ones.',
        bullets: [
            'Read-through of code, data model, and infrastructure',
            'Written report of risks, ranked by cost',
            'Fix plan your team can run without me',
            'Optional hands-on rescue of the critical path',
        ],
        format: 'Fixed scope, about two weeks',
        featured: false,
    },
];

export const engagementsHeading = {
    title: 'Three ways to work together',
    lede: 'Pick the shape that fits where your product is. I either do the work myself or build and lead the team that does it, setting high technical standards and mentoring with patience.',
};

export const engagementNote: EngagementNoteSegment[] = [
    {
        text: 'Every engagement runs on an AI-augmented workflow I use daily: Claude Code with custom skills, agent pipelines, and project knowledge bases. You get',
        selected: false,
    },
    {
        text: 'senior judgment on every decision',
        selected: true,
    },
    {
        text: 'and more of it per week.',
        selected: false,
    },
];

/** The label that precedes every card's format line. */
export const formatLabel = 'Format';
