/**
 * Sends one email through Resend's REST API.
 *
 * A plain `fetch` rather than the `resend` SDK: the form needs exactly one
 * endpoint, and the SDK brings two runtime dependencies and an optional React
 * Email peer for it. The request body is the documented `POST /emails` shape
 * (snake_case `reply_to`, as the SDK itself sends it).
 *
 * Never throws and never hands Resend's error to the caller: a failure is
 * logged here, server-side, and reported as `false`.
 */

import 'next/dist/compiled/server-only';
import type { ContactEmail } from './composeEmail';

const RESEND_EMAILS_URL = 'https://api.resend.com/emails';
/** A serverless function should not hang on a slow upstream; the visitor gets an error to retry. */
const TIMEOUT_MS = 10_000;

export interface OutgoingEmail extends ContactEmail {
    apiKey: string;
    from: string;
    to: string;
    replyTo: string;
}

export const sendWithResend = async ({ apiKey, from, to, replyTo, subject, text, html }: OutgoingEmail) => {
    try {
        const response = await fetch(RESEND_EMAILS_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ from, to: [to], reply_to: replyTo, subject, text, html }),
            signal: AbortSignal.timeout(TIMEOUT_MS),
            cache: 'no-store',
        });

        if (response.ok) {
            return true;
        }

        // Resend's error body names the problem (bad key, unverified domain,
        // rate limit). It holds no visitor data, so it is safe to log.
        console.error(`[contact] Resend refused the email: ${response.status} ${await readBody(response)}`);

        return false;
    }
    catch (error) {
        console.error('[contact] Could not reach Resend:', error);

        return false;
    }
};

const readBody = async (response: Response) => {
    try {
        return (await response.text()).slice(0, 500);
    }
    catch {
        return '(no body)';
    }
};
