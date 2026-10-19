/**
 * Runs in the browser before the app hydrates (Next's client instrumentation).
 *
 * Starts Vercel BotID, which wraps `fetch` so that requests to the protected
 * paths below carry the answer to its invisible challenge. Nothing is loaded
 * until such a request is made: the challenge script is fetched, from this
 * origin through the rewrite `withBotId` adds in next.config.ts, when the
 * contact form asks for its token on mount (a Server Action, so also a POST
 * to `/contact`).
 *
 * The contact form's Server Action posts to the page it lives on, so the
 * protected path is the page's. `lib/contact/botCheck.ts` reads the verdict.
 */

import { initBotId } from 'botid/client/core';

initBotId({
    protect: [{ path: '/contact', method: 'POST' }],
});
