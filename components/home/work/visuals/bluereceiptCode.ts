/**
 * The four code lines the BlueReceipt rename travels through.
 *
 * Kept as token lists rather than markup so the illustration never builds HTML
 * from strings, and so the identifier being renamed is a real element the
 * script can select and type into.
 */

export type TokenKind = 'p' | 'k' | 't' | 's';
export type LayerState = 'ok' | 'edit' | 'gen' | 'err';

export interface Token {
    text: string;
    kind?: TokenKind;
    /** The identifier being renamed, and the one the error underlines. */
    target?: boolean;
}

/** Vertical position of each layer card, in design-space px. */
export const TOPS = [14, 86, 158, 230];
const CARD_MID = 27;

export const GLYPH: Record<LayerState, string> = { ok: '\u2713', edit: '\u2022', gen: '\u21bb', err: '!' };

/** File name and what that layer is, per card. */
export const HEADS: [string, string][] = [
    ['schema.sql', 'migration'],
    ['orm/customer.ts', 'custom ORM'],
    ['sdk/types.ts', 'generated'],
    ['Settings.tsx', 'React'],
];

export const LINES: ((renamed: boolean) => Token[])[] = [
    renamed => [
        { kind: 'p', target: true, text: renamed ? 'sms_consent' : 'opt_in' },
        { text: '  ' },
        { kind: 'k', text: 'BOOLEAN' },
        { text: ' ' },
        { kind: 's', text: 'NOT NULL' },
    ],
    renamed => [
        { kind: 's', text: '@column' },
        { text: ' ' },
        { kind: 'p', target: true, text: renamed ? 'smsConsent' : 'optIn' },
        { text: ': ' },
        { kind: 't', text: 'boolean' },
    ],
    renamed => [
        { kind: 'k', text: 'type' },
        { text: ' ' },
        { kind: 't', text: 'Customer' },
        { text: ' = { ' },
        { kind: 'p', target: true, text: renamed ? 'smsConsent' : 'optIn' },
        { text: ': ' },
        { kind: 't', text: 'boolean' },
        { text: ' }' },
    ],
    renamed => [
        { kind: 'k', text: '<Toggle' },
        { text: ' on={c.' },
        { kind: 'p', target: true, text: renamed ? 'smsConsent' : 'optIn' },
        { text: '} ' },
        { kind: 'k', text: '/>' },
    ],
];

/** Centre line of a layer card, where the rail node sits. */
export const mid = (index: number) => TOPS[index] + CARD_MID;
