/**
 * The shape of the engagements' words: the four cards of the homepage's
 * services section, its heading and its closing note. The cards' names,
 * subtitles and short names are also what the share card and the `Offer`
 * structured data say.
 */

import type { EngagementId } from '../../engagements';

/** One engagement, as its card tells it. */
export interface EngagementCopy {
    /** The card's heading: the product's name or the buyer's problem. */
    name: string;
    /** The trade term a search uses for it, shown small under the name. */
    subtitle: string;
    /** A two- or three-word name, for the share card and structured data. */
    short: string;
    /** Who the engagement is for. */
    who: string;
    /** What the engagement covers, in plain words. */
    bullets: string[];
    /**
     * The typical size of the engagement: a range or a minimum. Built from
     * the `config/pricing.ts` helpers of the language's currency, never
     * converted by hand.
     */
    range: string;
}

/** A run of the closing paragraph, either plain or part of the selected phrase. */
export interface EngagementNoteSegment {
    text: string;
    /** Rendered as an editor text selection once the paragraph finishes writing. */
    selected: boolean;
}

export interface EngagementsCopy {
    heading: {
        title: string;
        lede: string;
    };
    engagements: Record<EngagementId, EngagementCopy>;
    /** The closing paragraph that types itself under the cards. */
    note: EngagementNoteSegment[];
    /** The label that precedes every card's range line. */
    rangeLabel: string;
    /** The card's link to its section on the services page. */
    linkLabel: string;
    /** Appended, for screen readers only, to the featured card's name. */
    featured: string;
}
