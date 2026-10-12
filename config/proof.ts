/**
 * Proof section data: who the work was for, and the four numbers behind the pitch.
 *
 * The stats are odometer reels, so a value is stored as the digits it rolls to
 * plus the digits it rolls from. Anything that is not a digit (a multiplier sign,
 * for instance) belongs in `prefix` or `suffix`, which render as plain text.
 */

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

/** Organisations the work was done for, in marquee order. */
export const proofClients: string[] = [
    'Parliament of Iceland',
    'Agoda',
    'Eko',
    'Antler',
    'Social-Bee',
    'BlueReceipt',
    'Slimwiki',
    'DirectMail',
    'Fokus Nachhilfe',
];

export const proofStats: ProofStat[] = [
    // Rolls up from 1990 rather than 0, so the year reads as a year the whole way.
    { id: 'since', label: 'Shipping software since', value: '2008', from: '1990' },
    { id: 'editors', label: 'Production rich text editors built', value: '4', from: '0' },
    { id: 'teams', label: 'Tech teams built from zero', value: '3', from: '0' },
    { id: 'messaging', label: 'Messaging performance at Eko', value: '2', from: '0', suffix: '×' },
];
