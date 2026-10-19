/**
 * The contact form's signed timestamp: the time the form was handed its token
 * (when it mounted), signed with `CONTACT_FORM_SECRET` so a bot cannot simply
 * claim it waited.
 *
 * A person needs a few seconds to type a name, an address and a message; a
 * script that posts the form the moment it loads does not take them. Signing
 * means the only way to get a valid old timestamp is to fetch a token and
 * actually wait, which is the cost the check is there to impose.
 *
 * It is a cheap first filter, not the defence: a patient script can fetch a
 * token and wait. BotID and the rate limit are what stop one. Checked before
 * them, it drops the crudest scripts without paying for a BotID check.
 */

import 'next/dist/compiled/server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';

/** Faster than this from token to submit is a script, not a person. */
export const MIN_FILL_MS = 3_000;
/**
 * Older than this, the token is stale; the visitor gets a fresh one and
 * resends. The form fetches a token when it mounts, so this bounds how long a
 * fetched token can be reused, not how long a tab may stay open: a tab left
 * longer gets the "please send it again" answer with a fresh token.
 */
export const MAX_TOKEN_AGE_MS = 2 * 60 * 60 * 1_000;

export type TokenVerdict = 'ok' | 'too-fast' | 'expired' | 'invalid';

/** A token for a form handed it at `now`: `<ms since epoch>.<base64url HMAC>`. */
export const signFormToken = (secret: string, now: number) => `${now}.${sign(secret, String(now))}`;

/** Checks a submitted token's signature, then how long the form was open. */
export const checkFormToken = (token: string, secret: string, now: number): TokenVerdict => {
    const match = /^(\d{1,16})\.([\w-]+)$/.exec(token);

    if (!match?.[1] || !match[2]) {
        return 'invalid';
    }

    const [, issuedText, signature] = match;
    const expected = Buffer.from(sign(secret, issuedText));
    const given = Buffer.from(signature);

    if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
        return 'invalid';
    }

    const age = now - Number(issuedText);

    // A token from the future was not issued by this server's clock.
    if (age < 0) {
        return 'invalid';
    }

    if (age < MIN_FILL_MS) {
        return 'too-fast';
    }

    return age > MAX_TOKEN_AGE_MS ? 'expired' : 'ok';
};

const sign = (secret: string, payload: string) =>
    createHmac('sha256', secret).update(`contact-form:${payload}`).digest('base64url');
