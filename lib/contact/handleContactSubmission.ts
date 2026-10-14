/**
 * Everything the contact form's Server Action does, in order:
 *
 * 1. The honeypot: a filled one is dropped before anything else is looked at.
 * 2. The visitor's fields, with their mistakes sent back inline. Checked
 *    before the rest so the form can be tried locally without any keys, and
 *    so BotID (billed per check) is only asked about a complete message.
 * 3. Configuration: without the env vars there is nothing to send with.
 * 4. The signed fill time, then BotID.
 * 5. The email.
 *
 * Spam (1 and 4) is dropped silently: it is told "sent", so a bot learns
 * nothing to adjust, and nothing is sent.
 *
 * Kept apart from the `'use server'` module so it can be tested with a plain
 * `FormData` and `Headers`, without a request.
 */

import 'next/dist/compiled/server-only';
import { type ContactState, type ContactValues, contactFieldNames } from '@/config/contact';
import { siteConfig } from '@/config/site';
import { isBotSubmission } from './botCheck';
import { composeContactEmail } from './composeEmail';
import { readContactConfig } from './contactConfig';
import { MIN_FILL_MS, checkFormToken, signFormToken } from './formToken';
import { sendWithResend } from './sendWithResend';
import { readContactValues, textField, validateContactValues } from './validateSubmission';

export const contactMessages = {
    notConfigured: 'The contact form is not set up right now. Please message me on LinkedIn instead.',
    expired: 'This form was open for over a day, so I could not accept it. Please send it again.',
    sendFailed: 'Sorry, your message could not be sent. Please try again in a moment, or message me on LinkedIn.',
} as const;

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

        return failed(contactMessages.notConfigured, values, token);
    }

    const { config } = configResult;
    const verdict = checkFormToken(token, config.secret, now.getTime());

    if (verdict === 'invalid' || verdict === 'too-fast') {
        return dropped(verdict === 'invalid' ? 'the form token was missing or forged' : 'it was sent too fast after loading');
    }

    if (verdict === 'expired') {
        // Dated back by the minimum fill time: the visitor has already spent
        // longer than that on the form, so resending at once must not read as a bot.
        return failed(contactMessages.expired, values, signFormToken(config.secret, now.getTime() - MIN_FILL_MS));
    }

    if (await isBotSubmission(requestHeaders)) {
        return dropped('BotID classified it as a bot');
    }

    const sent = await sendWithResend({
        apiKey: config.apiKey,
        from: siteConfig.contactSender,
        to: config.recipient,
        replyTo: values.email,
        ...composeContactEmail(values, now),
    });

    return sent ? SENT : failed(contactMessages.sendFailed, values, token);
};

const failed = (message: string, values: ContactValues, token: string): ContactState => ({
    status: 'failed',
    message,
    values,
    token,
});

/** Logged without the visitor's data: the reason is all the log needs. */
const dropped = (reason: string) => {
    console.info(`[contact] Dropped a submission silently: ${reason}.`);

    return SENT;
};
