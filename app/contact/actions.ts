'use server';

import { headers } from 'next/headers';
import type { ContactState } from '@/config/contact';
import { handleContactSubmission } from '@/lib/contact/handleContactSubmission';
import { issueFormToken } from '@/lib/contact/issueFormToken';

/**
 * The contact form's Server Action, shaped for `useActionState`.
 *
 * A Server Action rather than a route handler: React posts it with `fetch` to
 * the page's own path, `/contact`, which is the path BotID protects, and it
 * needs nothing new in the CSP (`connect-src 'self'`). The form only submits
 * with JavaScript; see `lib/contact/botCheck.ts`.
 */
export async function sendContactMessage(_previous: ContactState, formData: FormData): Promise<ContactState> {
    return handleContactSubmission(formData, await headers());
}

/**
 * A freshly signed form token, which the form asks for when it mounts.
 *
 * Asked for by the browser rather than rendered into the page, so `/contact`
 * can be prerendered like every other page, and so the fill time starts when
 * the visitor actually has the form, however long the HTML was cached.
 */
export async function issueContactToken(): Promise<string> {
    return issueFormToken();
}
