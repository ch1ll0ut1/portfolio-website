/**
 * Everything the contact form's Server Action does, in order:
 *
 * 1. The honeypot: a filled one is dropped before anything else is looked at.
 * 2. The visitor's fields, with their mistakes sent back inline. Checked
 *    before the rest so the form can be tried locally without any keys, and
 *    so BotID (billed per check) is only asked about a complete message.
 * 3. Configuration: without the env vars there is nothing to send with.
 * 4. The signed fill time.
 * 5. On Vercel only: a native post (no JavaScript, so no BotID) is dropped,
 *    then the Firewall rate limit, then BotID. Cheapest first, so the paid
 *    BotID check only sees what got past the rest.
 * 6. The email.
 *
 * Spam (1, 4, the native post and a BotID "bot") is dropped silently: it is
 * told "sent", so a bot learns nothing to adjust, and nothing is sent. A rate
 * limit or a failed BotID check is told so, with LinkedIn as the way round:
 * those can happen to a real person, who must not think a message was sent.
 *
 * The answers are codes (`ContactState`), never sentences: the form words
 * them in the visitor's language. The server's own log lines stay English.
 *
 * Kept apart from the `'use server'` module so it can be tested with a plain
 * `FormData` and `Headers`, without a request.
 */

import 'next/dist/compiled/server-only';
import { type ContactFailure, type ContactState, type ContactValues, contactFieldNames } from '@/config/contact';
import { siteConfig } from '@/config/site';
import { isJavaScriptSubmission, verifySubmitter } from './botCheck';
import { composeContactEmail } from './composeEmail';
import { readContactConfig, runsOnVercel } from './contactConfig';
import { MIN_FILL_MS, checkFormToken, signFormToken } from './formToken';
import { isRateLimited } from './rateLimit';
import { sendWithResend } from './sendWithResend';
import { readContactLocale, readContactValues, textField, validateContactValues } from './validateSubmission';

const SENT: ContactState = { status: 'sent' };

export const handleContactSubmission = async (
    formData: FormData,
    requestHeaders: Headers,
    now: Date = new Date(),
): Promise<ContactState> => {
    if (textField(formData, contactFieldNames.honeypot) !== '') {
        return dropped('the honeypot field was filled');
    }

    const values = readContactValues(formData);
    const token = textField(formData, contactFieldNames.token);
    const errors = validateContactValues(values);

    if (Object.keys(errors).length > 0) {
        return { status: 'invalid', errors, values, token };
    }

    const configResult = readContactConfig();

    if ('missing' in configResult) {
        console.warn(`[contact] The contact form is not configured: set ${configResult.missing.join(', ')}. Nothing was sent.`);

        return failed('notConfigured', values, token);
    }

    const { config } = configResult;
    const verdict = checkFormToken(token, config.secret, now.getTime());

    if (verdict === 'invalid' || verdict === 'too-fast') {
        return dropped(verdict === 'invalid' ? 'the form token was missing or forged' : 'it was sent too fast after loading');
    }

    if (verdict === 'expired') {
        // Dated back by the minimum fill time: the visitor has already spent
        // longer than that on the form, so resending at once must not read as a bot.
        return failed('expired', values, signFormToken(config.secret, now.getTime() - MIN_FILL_MS));
    }

    if (runsOnVercel() && !isJavaScriptSubmission(requestHeaders)) {
        return dropped('it was posted without JavaScript, so BotID could not check it');
    }

    if (await isRateLimited(requestHeaders)) {
        // Logged like a drop, without the visitor's data, so limit hits show in the logs.
        console.info('[contact] Refused a submission: the Firewall rate limit was hit.');

        return failed('rateLimited', values, token);
    }

    const submitter = await verifySubmitter();

    if (submitter === 'bot') {
        return dropped('BotID classified it as a bot');
    }

    if (submitter === 'unavailable') {
        return failed('botCheckFailed', values, token);
    }

    const sent = await sendWithResend({
        apiKey: config.apiKey,
        from: siteConfig.contactSender,
        to: config.recipient,
        replyTo: values.email,
        ...composeContactEmail(values, readContactLocale(formData), now),
    });

    return sent ? SENT : failed('sendFailed', values, token);
};

const failed = (reason: ContactFailure, values: ContactValues, token: string): ContactState => ({
    status: 'failed',
    reason,
    values,
    token,
});

/** Logged without the visitor's data: the reason is all the log needs. */
const dropped = (reason: string) => {
    console.info(`[contact] Dropped a submission silently: ${reason}.`);

    return SENT;
};
