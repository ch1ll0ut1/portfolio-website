/**
 * Asks Vercel BotID whether a contact form submission came from a person.
 *
 * BotID works by the browser solving a challenge and attaching the answer as
 * headers to `fetch` calls on the protected path (`instrumentation-client.ts`
 * protects `POST /contact`). The form therefore only submits with JavaScript:
 * a native form post carries no answer, and on Vercel every submission must
 * have been through BotID.
 *
 * - `isJavaScriptSubmission` is the cheap first gate. React's `fetch` for a
 *   Server Action sends `Next-Action`; a native post does not. It is not a
 *   security boundary (anyone can add the header), only a way to drop the
 *   obvious case without paying for a check. A forged header still has to
 *   pass BotID, which calls a request without the challenge's answer a bot.
 * - `verifySubmitter` asks BotID itself. Off Vercel it answers `'human'`
 *   unasked: `checkBotId()` needs Vercel's request context and OIDC token, so
 *   a production build on a laptop would throw.
 *
 * If BotID itself fails, the answer is `'unavailable'` and the submission is
 * refused with a visible error. Failing open would turn any BotID outage, or
 * any request that makes it throw, back into the bypass this check closes;
 * failing silently would lose a real person's message without telling them.
 */

import 'next/dist/compiled/server-only';
import { checkBotId } from 'botid/server';
import { runsOnVercel } from './contactConfig';

export type SubmitterVerdict = 'human' | 'bot' | 'unavailable';

type Env = Partial<Record<string, string>>;

/** True when the request is the form's own `fetch`, not a native post. */
export const isJavaScriptSubmission = (requestHeaders: Headers) => requestHeaders.has('next-action');

/** BotID's verdict on the current request, or `'human'` off Vercel. */
export const verifySubmitter = async (env: Env = process.env): Promise<SubmitterVerdict> => {
    if (!runsOnVercel(env)) {
        return 'human';
    }

    try {
        const verdict = await checkBotId();

        // A verified bot (a search crawler, a known AI agent) is not a bad
        // one, but it has no business writing to me through this form either.
        return verdict.isBot || verdict.isVerifiedBot ? 'bot' : 'human';
    }
    catch (error) {
        console.error('[contact] BotID check failed; refusing the submission:', error);

        return 'unavailable';
    }
};
