/**
 * Asks Vercel BotID whether a contact form submission came from a bot.
 *
 * BotID works by the browser solving a challenge and attaching the answer as
 * headers to `fetch` calls on the protected path (`instrumentation-client.ts`
 * protects `POST /contact`). That rules out two kinds of request:
 *
 * - A native form post, which is how the form submits without JavaScript. No
 *   script runs, so no headers are attached, and BotID would call every one
 *   of them a bot (Vercel's docs: BotID does not support native form posts).
 *   Those are told apart by the `Next-Action` header, which only React's
 *   `fetch` sends; they are judged by the honeypot and the signed fill time.
 * - Anything off Vercel. `checkBotId()` needs Vercel's request context and
 *   OIDC token, so a production build on a laptop would throw.
 *
 * If BotID itself fails, the submission is let through and the failure is
 * logged: the honeypot and the timing still stand, and losing a real message
 * silently is worse than letting a bot's through.
 */

import 'next/dist/compiled/server-only';
import { checkBotId } from 'botid/server';

/** True only when BotID positively classifies the request as a bot. */
export const isBotSubmission = async (requestHeaders: Headers, env: Partial<Record<string, string>> = process.env) => {
    if (env.VERCEL !== '1' || !requestHeaders.has('next-action')) {
        return false;
    }

    try {
        const verdict = await checkBotId();

        return verdict.isBot;
    }
    catch (error) {
        console.error('[contact] BotID check failed; letting the submission through:', error);

        return false;
    }
};
