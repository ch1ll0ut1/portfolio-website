/**
 * Tests for the Content-Security-Policy: the guarantees it has to keep, and
 * that the documented boot-script hash matches what the layout renders.
 */

import { createHash } from 'node:crypto';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { BOOT_SCRIPT } from './bootScript';
import { BOOT_SCRIPT_HASH, buildContentSecurityPolicy, keyword } from './contentSecurityPolicy';

/** Splits a policy into its directives, keyed by name. */
const parse = (policy: string) => new Map(policy.split('; ').map((directive) => {
    const [name = '', ...sources] = directive.split(' ');

    return [name, sources];
}));

const production = parse(buildContentSecurityPolicy({ dev: false }));
const development = parse(buildContentSecurityPolicy({ dev: true }));

describe('buildContentSecurityPolicy', () => {
    it('should lock down everything that has no reason to load', () => {
        expect(production.get('default-src')).toEqual([keyword('self')]);
        expect(production.get('object-src')).toEqual([keyword('none')]);
        expect(production.get('base-uri')).toEqual([keyword('self')]);
        expect(production.get('form-action')).toEqual([keyword('self')]);
        expect(production.get('frame-ancestors')).toEqual([keyword('none')]);
        expect(production.has('upgrade-insecure-requests')).toBe(true);
    });

    it('should never allow eval in production', () => {
        expect(production.get('script-src')).not.toContain(keyword('unsafe-eval'));
    });

    it('should allow eval in development, where React needs it', () => {
        expect(development.get('script-src')).toContain(keyword('unsafe-eval'));
    });

    // A hash or nonce makes browsers ignore 'unsafe-inline', which would block
    // the inline payload scripts every prerendered page hydrates from.
    it('should not mix hashes or nonces with the inline allowance', () => {
        const scripts = production.get('script-src') ?? [];

        expect(scripts).toContain(keyword('unsafe-inline'));
        expect(scripts.some(source => /^'(sha\d+|nonce)-/.test(source))).toBe(false);
    });

    it('should allow Google Analytics to load and collect once consent is given', () => {
        expect(production.get('script-src')).toContain('https://*.googletagmanager.com');
        expect(production.get('connect-src')).toEqual(expect.arrayContaining([
            keyword('self'),
            'https://*.google-analytics.com',
            'https://*.analytics.google.com',
            'https://*.googletagmanager.com',
            'https://www.google.com',
        ]));
        expect(production.get('img-src')).toContain('https://*.google-analytics.com');
    });

    it('should name no other third-party script host in production', () => {
        const hosts = (production.get('script-src') ?? []).filter(source => source.startsWith('https://'));

        expect(hosts).toEqual(['https://*.googletagmanager.com']);
    });
});

describe('BOOT_SCRIPT_HASH', () => {
    // A browser hashes the element's text as served, so this goes through the
    // same server render the layout's <script> does, escaping included.
    it('should match the boot script as the server renders it', () => {
        const markup = renderToStaticMarkup(createElement('script', { dangerouslySetInnerHTML: { __html: BOOT_SCRIPT } }));
        const served = /^<script>([\s\S]*)<\/script>$/.exec(markup)?.[1] ?? '';
        const digest = createHash('sha256').update(served, 'utf8').digest('base64');

        expect(served).not.toBe('');
        expect(BOOT_SCRIPT_HASH).toBe(keyword(`sha256-${digest}`));
    });

    it('should change when the boot script changes', () => {
        const edited = createHash('sha256').update(`${BOOT_SCRIPT} `, 'utf8').digest('base64');

        expect(BOOT_SCRIPT_HASH).not.toBe(keyword(`sha256-${edited}`));
    });
});
