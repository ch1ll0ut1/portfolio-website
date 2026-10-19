/**
 * The email a contact form submission becomes.
 *
 * Plain text first, with a small HTML part of the same content. Every value
 * the visitor typed is escaped in the HTML, and the name is a single line
 * (see `readContactValues`), so it cannot break the subject.
 */

import { type ContactValues, contactTopicLabel } from '@/config/contact';
import { siteConfig } from '@/config/site';

export interface ContactEmail {
    subject: string;
    text: string;
    html: string;
}

const SITE_HOST = new URL(siteConfig.url).host;

export const composeContactEmail = (values: ContactValues, receivedAt: Date): ContactEmail => {
    const topic = contactTopicLabel(values.topic);
    const timestamp = receivedAt.toISOString();
    const rows: [string, string][] = [
        ['Name', values.name],
        ['Email', values.email],
        ['Topic', topic],
        ['Received', timestamp],
    ];

    const text = [
        ...rows.map(([label, value]) => `${label}: ${value}`),
        '',
        values.message,
        '',
        `Sent from the contact form on ${SITE_HOST}. Reply to answer ${values.name}.`,
    ].join('\n');

    const html = [
        '<table cellpadding="4" style="border-collapse:collapse">',
        ...rows.map(([label, value]) => `<tr><th align="left">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`),
        '</table>',
        `<p style="white-space:pre-wrap">${escapeHtml(values.message)}</p>`,
        `<p style="color:#666">Sent from the contact form on ${escapeHtml(SITE_HOST)}.</p>`,
    ].join('\n');

    return {
        subject: `[${SITE_HOST}] ${topic}: ${values.name}`,
        text,
        html,
    };
};

const HTML_ENTITIES: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
};

/** Escapes text for HTML element content and quoted attribute values. */
export const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => HTML_ENTITIES[char] ?? char);
