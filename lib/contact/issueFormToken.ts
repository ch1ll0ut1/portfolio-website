/**
 * The token the contact page renders into its form: the current time, signed.
 *
 * Empty when `CONTACT_FORM_SECRET` is unset. The form still renders, and the
 * action answers "not configured" before it would look at the token.
 */

import 'next/dist/compiled/server-only';
import { signFormToken } from './formToken';

export const issueFormToken = (now: Date = new Date()) => {
    const secret = process.env.CONTACT_FORM_SECRET?.trim();

    return secret ? signFormToken(secret, now.getTime()) : '';
};
