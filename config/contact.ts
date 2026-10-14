/**
 * The contact form's shape, shared by the form in the browser and the Server
 * Action that receives it: field names, topics, length caps and the states the
 * action answers with. Pure data, so the client can import it; everything that
 * touches secrets or the network lives in `lib/contact/`.
 */

export const contactTopics = [
    { value: 'general', label: 'General' },
    { value: 'project', label: 'Project' },
    { value: 'privacy', label: 'Privacy request' },
] as const;

export type ContactTopic = typeof contactTopics[number]['value'];

export const DEFAULT_CONTACT_TOPIC: ContactTopic = 'general';

export const isContactTopic = (value: unknown): value is ContactTopic =>
    contactTopics.some(topic => topic.value === value);

/** A topic's label, as the select shows it and the email's subject names it. */
export const contactTopicLabel = (topic: ContactTopic) =>
    contactTopics.find(entry => entry.value === topic)?.label ?? topic;

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
} as const;

/** The fields a visitor fills in and can get wrong. */
export type ContactField = 'name' | 'email' | 'message';

export interface ContactValues {
    name: string;
    email: string;
    topic: ContactTopic;
    message: string;
}

export type ContactFieldErrors = Partial<Record<ContactField, string>>;

export type ContactState
    /** Nothing submitted yet. */
    = | { status: 'idle' }
    /** Accepted. Also what a submission dropped as spam sees. */
      | { status: 'sent' }
    /** The visitor has something to fix; their input comes back with it. */
      | { status: 'invalid'; errors: ContactFieldErrors; values: ContactValues; token: string }
    /** Nothing the visitor can fix: unconfigured, expired, or the send failed. */
      | { status: 'failed'; message: string; values: ContactValues; token: string };

export const INITIAL_CONTACT_STATE: ContactState = { status: 'idle' };
