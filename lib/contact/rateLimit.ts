/**
 * Caps how many messages one address can send, through a Vercel Firewall
 * rate-limit rule defined in the dashboard (see README, "Contact form rate
 * limit") and applied here with `@vercel/firewall`.
 *
 * From code rather than as a plain WAF rule on `POST /contact`: a WAF rule
 * answers the Server Action's `fetch` with a bare 429, which React surfaces as
 * a thrown error instead of a message the visitor can read. Asked from code,
 * a limited visitor gets the form's own "too many messages" error.
 *
 * The rule counts per client IP, which is `x-real-ip` as Vercel's edge sets
 * it (a client cannot supply its own). Every outcome but "limited" lets the
 * submission on to BotID:
 *
 * - Off Vercel there is no Firewall to ask (and a local `next start` would
 *   send the check to `https://localhost`), so it is skipped.
 * - No rule with this ID yet: the package answers `error: 'not-found'` and
 *   warns. The form keeps working until the owner creates the rule.
 * - The check itself fails (timeout, unexpected answer): logged, and let
 *   through. BotID still runs after it and fails closed, so an outage here
 *   costs the flood cap for a while, not the form.
 */

import 'next/dist/compiled/server-only';
import { checkRateLimit } from '@vercel/firewall';
import { runsOnVercel } from './contactConfig';

/** The rule's ID, as set in the Firewall rule's `@vercel/firewall` condition. */
export const CONTACT_RATE_LIMIT_ID = 'contact-form';

/** The visitor is waiting on this; a slow Firewall must not hold the form up. */
const TIMEOUT_MS = 3_000;

type Env = Partial<Record<string, string>>;

/** True only when the Firewall says this address is over its limit. */
export const isRateLimited = async (requestHeaders: Headers, env: Env = process.env) => {
    if (!runsOnVercel(env)) {
        return false;
    }

    try {
        const { rateLimited, error } = await checkRateLimit(CONTACT_RATE_LIMIT_ID, {
            headers: requestHeaders,
            timeout: TIMEOUT_MS,
        });

        if (error === 'not-found') {
            console.warn(`[contact] No Firewall rate-limit rule "${CONTACT_RATE_LIMIT_ID}" yet; the form is not rate limited.`);
        }

        return rateLimited;
    }
    catch (error) {
        console.error('[contact] Rate-limit check failed; letting the submission on to BotID:', error);

        return false;
    }
};
