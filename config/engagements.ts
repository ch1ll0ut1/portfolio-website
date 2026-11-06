/**
 * The ways to work together: the homepage's services cards, the share card,
 * the homepage's `Offer` structured data and the English `/services` page all
 * read them from here. Their words are in `config/home/services/`.
 *
 * The App Health Check comes first: the fixed-price entry product, and the
 * one marked `featured`, which earns it the raised surface, the parked caret
 * and the traced border. The other three are named by the buyer's problem;
 * the trade term each is searched by rides along as `subtitle`.
 */

import type { Locale } from '@/lib/i18n/locale';
import { engagementsCopy } from './home/services';
import type { EngagementCopy } from './home/services/types';

/** Anchor ids on `/services` and `/de/leistungen`, shared by both. */
export type EngagementId = 'health-check' | 'rescue' | 'build' | 'tech-lead';

export interface Engagement extends EngagementCopy {
    /** Stable key, and the section anchor on the services pages. */
    id: EngagementId;
    /** The recommended engagement. Exactly one is true. */
    featured: boolean;
}

const engagementData: { id: EngagementId; featured: boolean }[] = [
    { id: 'health-check', featured: true },
    { id: 'rescue', featured: false },
    { id: 'build', featured: false },
    { id: 'tech-lead', featured: false },
];

/** The engagements, in card order, told in `locale`. */
export const engagementsFor = (locale: Locale): Engagement[] => engagementData.map(({ id, featured }) => ({
    id,
    ...engagementsCopy[locale].engagements[id],
    featured,
}));

/** The engagements in English: `/services`, the share card and the structured data read these. */
export const engagements = engagementsFor('en');

/** The English path of an engagement's section on the services page. */
export const engagementPath = (id: EngagementId) => `/services#${id}`;
