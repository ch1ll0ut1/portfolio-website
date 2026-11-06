/**
 * The facts the legal notice states about who provides the site. The only
 * place they live, and the only place with placeholders: everything written
 * as `[… — Stefan to fill]` or `[… — Stefan to decide]` is a value still
 * missing.
 *
 * A placeholder must never reach the live site, so a production build stops
 * on one: `next.config.ts` calls `assertLegalNoticeFilled`, which throws when
 * `VERCEL_ENV` is `production`. Preview and local builds show the
 * placeholders, marked, so the gaps stay visible.
 *
 * Imported by `next.config.ts`, so its imports stay relative.
 */

import { siteIdentity } from '../site/identity';
import type { LegalProvider } from './types';

export const legalProvider: LegalProvider = {
    name: siteIdentity.name,
    address: [
        '[STREET, NUMBER, DISTRICT — Stefan to fill]',
        `[POSTCODE — Stefan to fill] ${siteIdentity.city}`,
        'Thailand',
    ],
    email: '[EMAIL ADDRESS — Stefan to fill]',
    // Only a German USt-IdNr. under § 27a UStG goes here. Without one, leave it null.
    vatId: null,
    // § 18 Abs. 2 MStV allows only someone resident in Germany. Name that person,
    // or set this to null if the blog is not treated as journalistic-editorial.
    editorialResponsible: {
        name: '[RESPONSIBLE PERSON, RESIDENT IN GERMANY — Stefan to decide]',
        address: ['[THEIR ADDRESS IN GERMANY — Stefan to decide]'],
    },
};

/** Whether `value` holds a value still to be supplied: square brackets around a note to Stefan. */
export const isPlaceholder = (value: string) => /\[[^\]]*Stefan to (?:fill|decide)\]/.test(value);

/** Every placeholder left in `provider`, however deeply nested. */
export const placeholdersIn = (provider: LegalProvider = legalProvider): string[] => stringsOf(provider).filter(isPlaceholder);

/**
 * Throws when a production build would publish a placeholder. `VERCEL_ENV` is
 * set by Vercel during the build as well as at runtime; it is `preview` for
 * previews and unset locally, so only the live site's build is stopped.
 */
export const assertLegalNoticeFilled = (env: Partial<Record<string, string>> = process.env, provider: LegalProvider = legalProvider) => {
    const missing = placeholdersIn(provider);

    if (env.VERCEL_ENV === 'production' && missing.length > 0) {
        throw new Error(`The legal notice still has placeholders, fill them in config/legalNotice/provider.ts: ${missing.join('; ')}`);
    }
};

function stringsOf(value: unknown): string[] {
    if (typeof value === 'string') {
        return [value];
    }
    if (value && typeof value === 'object') {
        return Object.values(value).flatMap(stringsOf);
    }

    return [];
}
