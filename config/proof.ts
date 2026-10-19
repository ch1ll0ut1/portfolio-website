/**
 * Proof section data: who the work was for, and the four numbers behind the pitch.
 *
 * The stats are odometer reels, so a value is stored as the digits it rolls to
 * plus the digits it rolls from. Anything that is not a digit (a multiplier sign,
 * for instance) belongs in `prefix` or `suffix`, which render as plain text.
 */

import { siteConfig } from './site';

export interface ProofStat {
    /** Stable key, also used as the React key. */
    id: string;
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

/** Organizations the work was done for, in marquee order. */
export const proofClients: string[] = [
    'Parliament of Iceland',
    'Agoda',
    'Eko',
    'Social-Bee',
    'BlueReceipt',
    'Slimwiki',
    'DirectMail',
    'Fokus-Nachhilfe',
];

export const proofStats: ProofStat[] = [
    // Rolls up from 1990 rather than 0, so the year reads as a year the whole way.
    { id: 'since', label: 'Shipping software since', value: String(siteConfig.sinceYear), from: '1990' },
    { id: 'teams', label: 'Tech teams built from zero', value: '3', from: '0' },
    // A distributed team of twelve developers at Break Media Solutions.
    { id: 'team-size', label: 'Developers in the largest team I led', value: '12', from: '00' },
    { id: 'messaging', label: 'Messaging performance at Eko', value: '2', from: '0', suffix: '×' },
];
