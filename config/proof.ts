/**
 * Proof section data: the four numbers behind the pitch. Who the work was for
 * and what each number counts are words, in `config/home/proof/`.
 *
 * The stats are odometer reels, so a value is stored as the digits it rolls to
 * plus the digits it rolls from. Anything that is not a digit (a multiplier sign,
 * for instance) belongs in `prefix` or `suffix`, which render as plain text.
 */

import type { Locale } from '@/lib/i18n/locale';
import { proofCopy } from './home/proof';
import type { ProofStatId } from './home/proof/types';
import { siteConfig } from './site';

export interface ProofStat {
    /** Stable key, also used as the React key. */
    id: ProofStatId;
    /** What the number counts. */
    label: string;
    /** Final value. Digits only. */
    value: string;
    /** Value the reels start from. Padded or trimmed to `value`'s length. */
    from: string;
    /** Rendered before the number, in caret orange. */
    prefix?: string;
    /** Rendered after the number, in caret orange. */
    suffix?: string;
}

const stats: Omit<ProofStat, 'label'>[] = [
    // Rolls up from 1990 rather than 0, so the year reads as a year the whole way.
    { id: 'since', value: String(siteConfig.sinceYear), from: '1990' },
    { id: 'teams', value: '3', from: '0' },
    // A distributed team of twelve developers at Break Media Solutions.
    { id: 'team-size', value: '12', from: '00' },
    { id: 'messaging', value: '2', from: '0', suffix: '×' },
];

/** The stats with what each counts, in `locale`. */
export const proofStatsFor = (locale: Locale): ProofStat[] => stats.map(stat => ({
    ...stat,
    label: proofCopy[locale].stats[stat.id],
}));
