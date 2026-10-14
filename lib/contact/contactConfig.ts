/**
 * The contact form's server configuration, read from the environment.
 *
 * All three variables are set in the Vercel project, never in the repo:
 *
 * - `RESEND_API_KEY`: a sending-only Resend key for the site's domain.
 * - `CONTACT_TO_EMAIL`: the inbox messages are delivered to.
 * - `CONTACT_FORM_SECRET`: any long random string; signs the form's timestamp.
 *
 * Without them the form still renders and the build still passes; a
 * submission is answered with "not configured" and the server logs which
 * variables are missing.
 */

import 'next/dist/compiled/server-only';

export interface ContactConfig {
    apiKey: string;
    recipient: string;
    secret: string;
}

type Env = Partial<Record<string, string>>;

const VARIABLES = {
    apiKey: 'RESEND_API_KEY',
    recipient: 'CONTACT_TO_EMAIL',
    secret: 'CONTACT_FORM_SECRET',
} as const;

/** The configuration, or the names of the variables that are missing. */
export const readContactConfig = (env: Env = process.env): { config: ContactConfig } | { missing: string[] } => {
    const apiKey = env[VARIABLES.apiKey]?.trim() ?? '';
    const recipient = env[VARIABLES.recipient]?.trim() ?? '';
    const secret = env[VARIABLES.secret]?.trim() ?? '';

    if (apiKey && recipient && secret) {
        return { config: { apiKey, recipient, secret } };
    }

    const values: [string, string][] = [
        [VARIABLES.apiKey, apiKey],
        [VARIABLES.recipient, recipient],
        [VARIABLES.secret, secret],
    ];

    return { missing: values.filter(([, value]) => !value).map(([name]) => name) };
};
