/**
 * The contact form's shape, shared by the form in the browser and the Server
 * Action that receives it: field names, topics, length caps and the states the
 * action answers with. Pure data, so the client can import it; everything that
 * touches secrets or the network lives in `lib/contact/`.
 *
 * The action answers in codes, never in words: the form turns them into the
 * visitor's language through `contactCopy` (./index.ts).
 */

export const contactTopics = ['general', 'project', 'privacy'] as const;

export type ContactTopic = typeof contactTopics[number];

export const DEFAULT_CONTACT_TOPIC: ContactTopic = 'general';

export const isContactTopic = (value: unknown): value is ContactTopic =>
    contactTopics.some(topic => topic === value);

/** Longest accepted value per field, in characters. 254 is the longest valid email address. */
export const contactLimits = {
    name: 100,
    email: 254,
    message: 5000,
} as const;

/** The `name` of every input the form posts. */
export const contactFieldNames = {
    name: 'name',
    email: 'email',
    topic: 'topic',
    message: 'message',
    /** The honeypot: hidden from people, irresistible to form-filling bots. */
    honeypot: 'website',
    /** The signed time the form was rendered, for the minimum fill time. */
    token: 'form-token',
    /** The language of the page the form was sent from, for the email. */
    locale: 'locale',
} as const;

/** The fields a visitor fills in and can get wrong. */
export type ContactField = 'name' | 'email' | 'message';

export interface ContactValues {
    name: string;
    email: string;
    topic: ContactTopic;
    message: string;
}

/**
 * What is wrong with each field, as codes. An email address that is too long
 * is `invalidEmail` too: no real address is that long.
 */
export interface ContactFieldErrors {
    name?: { kind: 'required' } | { kind: 'tooLong'; max: number };
    email?: { kind: 'required' } | { kind: 'invalidEmail' };
    message?: { kind: 'required' } | { kind: 'tooLong'; max: number; length: number };
}

/** Why a submission the visitor cannot fix was refused. */
export type ContactFailure
    /** The env vars are missing. */
    = | 'notConfigured'
    /** The form was open longer than the token lives. */
      | 'expired'
    /** The Firewall rate limit was hit. */
      | 'rateLimited'
    /** BotID could not give an answer. */
      | 'botCheckFailed'
    /** Resend did not accept the email. */
      | 'sendFailed';

export type ContactState
    /** Nothing submitted yet. */
    = | { status: 'idle' }
    /** Accepted. Also what a submission dropped as spam sees. */
      | { status: 'sent' }
    /** The visitor has something to fix; their input comes back with it. */
      | { status: 'invalid'; errors: ContactFieldErrors; values: ContactValues; token: string }
    /** Nothing the visitor can fix: unconfigured, expired, limited, or the send failed. */
      | { status: 'failed'; reason: ContactFailure; values: ContactValues; token: string };

export const INITIAL_CONTACT_STATE: ContactState = { status: 'idle' };
