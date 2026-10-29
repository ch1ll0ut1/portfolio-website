/**
 * Tests for the contact copy: the German dictionary is wired, complete, and
 * written to the style guide's rules.
 */

import { describe, expect, it } from 'vitest';
import { contactCopy } from '.';
import { contactDe } from './de';

/** Every leaf as `path → text`; functions are called with sample numbers. */
const leaves = (value: unknown, path = ''): [string, string][] => {
    if (typeof value === 'string') {
        return [[path, value]];
    }

    if (typeof value === 'function') {
        return [[path, String(value('1.000', '1.001'))]];
    }

    if (typeof value === 'object' && value !== null) {
        return Object.entries(value).flatMap(([key, child]) => leaves(child, path ? `${path}.${key}` : key));
    }

    return [];
};

const keysOf = (value: unknown) => leaves(value).map(([path]) => path).sort();

describe('contactCopy', () => {
    it('should give German pages the German copy', () => {
        expect(contactCopy.de).toBe(contactDe);
        expect(contactCopy.de).not.toBe(contactCopy.en);
    });

    it('should have the same keys in German as in English', () => {
        expect(keysOf(contactCopy.de)).toEqual(keysOf(contactCopy.en));
    });

    it.each(leaves(contactDe))('should fill %s with German text', (_path, text) => {
        expect(text.trim()).not.toBe('');
        expect(text).not.toContain('$');
        expect(text).not.toMatch(/\b(du|dich|dir|dein\w*)\b/i);
    });

    it('should keep the slots the page fills', () => {
        expect(contactDe.page.linkedIn).toContain('{linkedin}');
        expect(contactDe.page.privacyNote).toContain('{privacy}');
        expect(contactDe.form.noscript).toContain('{linkedin}');
    });

    it('should keep the page title and description to search result lengths', () => {
        expect(contactDe.meta.title.length).toBeLessThanOrEqual(60);
        expect(contactDe.meta.description.length).toBeLessThanOrEqual(155);
    });

    it('should promise a reply within one working day', () => {
        expect(contactDe.invitation).toContain('innerhalb eines Werktags');
    });

    it.each(['notConfigured', 'rateLimited', 'botCheckFailed', 'sendFailed'] as const)(
        'should point a visitor stuck on %s to LinkedIn, as the English does',
        (reason) => {
            expect(contactCopy.en.failures[reason]).toContain('LinkedIn');
            expect(contactDe.failures[reason]).toContain('LinkedIn');
        },
    );
});
