/**
 * The shape of the contact copy: the `/contact` page, the form, and the words
 * for every code the form's Server Action answers with. One object per
 * language, so a missing German message is a type error.
 */

import type { ContactFailure, ContactTopic } from './form';

export interface ContactCopy {
    /**
     * What to send and when to expect an answer: the homepage's contact band
     * and the contact page both say it.
     */
    invitation: string;
    /** Each topic's label, as the select shows it. */
    topics: Record<ContactTopic, string>;
    meta: {
        /** Used as it is: it already names him, so no "| Stefan Knoch" suffix. */
        title: string;
        description: string;
    };
    breadcrumbs: {
        home: string;
        page: string;
    };
    page: {
        kicker: string;
        /** The page's h1: what the visitor came to do, in plain words. */
        heading: string;
        /** `{linkedin}` is the LinkedIn link, worded by `linkedInLink`. */
        linkedIn: string;
        linkedInLink: string;
        /** `{privacy}` is the privacy policy link, worded by `privacyLink`. */
        privacyNote: string;
        privacyLink: string;
    };
    form: {
        labels: {
            name: string;
            email: string;
            topic: string;
            message: string;
        };
        /** After the label of a field that may be left empty. */
        optional: string;
        emailHint: string;
        /** `max` is the message's length cap, formatted for the language. */
        messageHint: (max: string) => string;
        /** The honeypot's label, read only by bots. */
        honeypot: string;
        send: string;
        sending: string;
        sent: string;
        /** Said once per rejected submission; without JavaScript it is the only summary. */
        invalid: string;
        tokenFailed: string;
        /** `{linkedin}` is the LinkedIn link, worded by `noscriptLink`. */
        noscript: string;
        noscriptLink: string;
    };
    /** What each field error code says. Numbers come formatted for the language. */
    fieldErrors: {
        name: {
            required: string;
            tooLong: (max: string) => string;
        };
        email: {
            required: string;
            invalidEmail: string;
        };
        message: {
            required: string;
            tooLong: (max: string, length: string) => string;
        };
    };
    /** What each failure the visitor cannot fix says. */
    failures: Record<ContactFailure, string>;
}
