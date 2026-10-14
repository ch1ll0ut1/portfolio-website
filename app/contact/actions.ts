'use server';

import { headers } from 'next/headers';
import type { ContactState } from '@/config/contact';
import { handleContactSubmission } from '@/lib/contact/handleContactSubmission';

/**
 * The contact form's Server Action, shaped for `useActionState`.
 *
 * A Server Action rather than a route handler: the form posts to its own page,
 * so it works without JavaScript (React renders the result into the page on
 * the server) and needs nothing new in the CSP (`form-action 'self'`,
 * `connect-src 'self'`). With JavaScript, React posts it with `fetch` to
 * `/contact`, which is the path BotID protects.
 */
export async function sendContactMessage(_previous: ContactState, formData: FormData): Promise<ContactState> {
    return handleContactSubmission(formData, await headers());
}
