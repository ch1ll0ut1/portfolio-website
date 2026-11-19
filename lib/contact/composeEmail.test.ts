/**
 * Tests for the email a contact form submission becomes.
 */

import { describe, expect, it } from 'vitest';
import { composeContactEmail, escapeHtml } from './composeEmail';

const RECEIVED = new Date('2026-10-14T09:30:00Z');

describe('composeContactEmail', () => {
    it('should name the site, the topic and the sender in the subject', () => {
        // Act
        const email = composeContactEmail(
            { name: 'Ada Lovelace', email: 'ada@example.com', topic: 'privacy', message: 'Hi' },
            'en',
            RECEIVED,
        );

        // Assert
        expect(email.subject).toBe('[stefanknoch.com] Privacy request: Ada Lovelace');
    });

    it('should carry every field and the time received in the plain text', () => {
        // Act
        const { text } = composeContactEmail(
            { name: 'Ada', email: 'ada@example.com', topic: 'project', message: 'Line one\nLine two' },
            'en',
            RECEIVED,
        );

        // Assert
        expect(text).toContain('Name: Ada');
        expect(text).toContain('Email: ada@example.com');
        expect(text).toContain('Topic: Project');
        expect(text).toContain('Received: 2026-10-14T09:30:00.000Z');
        expect(text).toContain('Language: en');
        expect(text).toContain('Line one\nLine two');
    });

    it('should stay English for a German visitor, and say which language they wrote from', () => {
        // Act
        const email = composeContactEmail(
            { name: 'Ada', email: 'ada@example.com', topic: 'privacy', message: 'Hallo' },
            'de',
            RECEIVED,
        );

        // Assert
        expect(email.subject).toBe('[stefanknoch.com] Privacy request: Ada');
        expect(email.text).toContain('Topic: Privacy request');
        expect(email.text).toContain('Language: de');
        expect(email.html).toContain('<th align="left">Language</th><td>de</td>');
    });

    it('should escape everything the visitor typed in the HTML part', () => {
        // Act
        const { html } = composeContactEmail(
            {
                name: '<b>Ada</b>',
                email: 'ada@example.com',
                topic: 'general',
                message: '<script>alert("x")</script> & \'quotes\'',
            },
            'en',
            RECEIVED,
        );

        // Assert
        expect(html).not.toContain('<script>');
        expect(html).not.toContain('<b>Ada</b>');
        expect(html).toContain('&lt;b&gt;Ada&lt;/b&gt;');
        expect(html).toContain('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;quotes&#39;');
    });
});

describe('escapeHtml', () => {
    it('should leave plain text alone', () => {
        expect(escapeHtml('Plain text, 100%')).toBe('Plain text, 100%');
    });
});
