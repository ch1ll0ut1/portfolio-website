/**
 * Tests for the Content-Security-Policy: the guarantees it has to keep, and
 * that the documented boot-script hash matches what the layout renders.
 */

import { createHash } from 'node:crypto';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BOOT_SCRIPT } from './bootScript';
import { BOOT_SCRIPT_HASH, CSP_HEADER_NAME, LOCAL_HOST_CONDITION, buildContentSecurityPolicy, keyword } from './contentSecurityPolicy';

/** Every source the Vercel Toolbar adds, as Vercel's docs list them. */
const VERCEL_TOOLBAR_SOURCES = new Set(['https://vercel.live', 'https://vercel.com', 'https://assets.vercel.com', 'wss://ws-us3.pusher.com', 'blob:']);

/** Splits a policy into its directives, keyed by name. */
const parse = (policy: string) => new Map(policy.split('; ').map((directive) => {
    const [name = '', ...sources] = directive.split(' ');

    return [name, sources];
}));

const production = parse(buildContentSecurityPolicy({ dev: false }));
const development = parse(buildContentSecurityPolicy({ dev: true }));
const local = parse(buildContentSecurityPolicy({ dev: false, local: true }));
const preview = parse(buildContentSecurityPolicy({ dev: false, preview: true }));

/** Whether any directive of a policy names a Vercel Toolbar host. */
const namesToolbar = (policy: Map<string, string[]>) => [...policy.values()].flat().some(source => source.includes('vercel.'));

/** Next's host matching for `has`/`missing`: the Host header minus its port, anchored. */
const matchesHost = (condition: { value: string }, host: string) => new RegExp(`^${condition.value}$`).test(host.split(':', 1)[0] ?? '');

/** Whether a header rule's `source` (only the `/:path*` suffix form is used) covers `path`. */
const matchesSource = (source: string, path: string) => {
    const prefix = source.replace(/\/:path\*$/, '');

    return path === prefix || path.startsWith(`${prefix}/`);
};

/** BotID's proxied challenge path, from `withBotId`. */
const BOTID_PATH = '/149e9513-01fa-4fb0-aad4-566afd725d1b/2d206a39-8ed7-437e-a3be-862e0f06eea3/a-4-a/c.js';

/**
 * The CSP a production `next.config.ts` sends for a request to `host` and
 * `path`, from every rule that matches it, in order (the last one wins).
 */
const policiesFor = async (host: string, path = '/contact') => {
    // Read fresh under a production NODE_ENV, which the config reads on load.
    vi.resetModules();

    const { default: nextConfig } = await import('../next.config');
    const rules = await nextConfig.headers?.() ?? [];

    return rules
        .filter(rule => matchesSource(rule.source, path))
        .filter(rule => (rule.has ?? []).every(condition => condition.type === 'host' && matchesHost(condition, host)))
        .filter(rule => !(rule.missing ?? []).some(condition => condition.type === 'host' && matchesHost(condition, host)))
        .flatMap(rule => rule.headers.filter(header => header.key === CSP_HEADER_NAME))
        .map(header => parse(header.value));
};

describe('buildContentSecurityPolicy', () => {
    it('should lock down everything that has no reason to load', () => {
        expect(production.get('default-src')).toEqual([keyword('self')]);
        expect(production.get('object-src')).toEqual([keyword('none')]);
        expect(production.get('base-uri')).toEqual([keyword('self')]);
        expect(production.get('form-action')).toEqual([keyword('self')]);
        expect(production.get('frame-ancestors')).toEqual([keyword('none')]);
        expect(production.has('upgrade-insecure-requests')).toBe(true);
    });

    // WebKit applies the upgrade to http://localhost too, so a local
    // production build would request its own assets over https and fail.
    it('should leave out upgrade-insecure-requests on a local host and in development', () => {
        expect(local.has('upgrade-insecure-requests')).toBe(false);
        expect(development.has('upgrade-insecure-requests')).toBe(false);
    });

    it('should otherwise send a local host the production policy', () => {
        const withoutUpgrade = new Map(production);

        withoutUpgrade.delete('upgrade-insecure-requests');

        expect(local).toEqual(withoutUpgrade);
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

    it('should leave the Vercel Toolbar out unless it is a preview', () => {
        expect(buildContentSecurityPolicy({ dev: false, preview: false })).toBe(buildContentSecurityPolicy({ dev: false }));
        expect(namesToolbar(production)).toBe(false);
        expect(namesToolbar(local)).toBe(false);
        expect(production.has('frame-src')).toBe(false);
    });

    // Vercel injects its toolbar into preview deployments; these are the
    // sources its documented CSP asks for.
    it('should allow the Vercel Toolbar on a preview', () => {
        expect(preview.get('script-src')).toContain('https://vercel.live');
        expect(preview.get('style-src')).toContain('https://vercel.live');
        expect(preview.get('img-src')).toEqual(expect.arrayContaining(['https://vercel.live', 'https://vercel.com', 'data:', 'blob:']));
        expect(preview.get('font-src')).toEqual(expect.arrayContaining(['https://vercel.live', 'https://assets.vercel.com']));
        expect(preview.get('connect-src')).toEqual(expect.arrayContaining(['https://vercel.live', 'wss://ws-us3.pusher.com']));
        expect(preview.get('frame-src')).toEqual([keyword('self'), 'https://vercel.live']);
    });

    it('should otherwise send a preview the production policy', () => {
        const withoutToolbar = new Map([...preview]
            .filter(([name]) => name !== 'frame-src')
            .map(([name, sources]) => [name, sources.filter(source => !VERCEL_TOOLBAR_SOURCES.has(source))]));

        expect(withoutToolbar).toEqual(production);
        expect(preview.get('script-src')).not.toContain(keyword('unsafe-eval'));
    });
});

describe('LOCAL_HOST_CONDITION', () => {
    it.each(['localhost', 'localhost:3000', '127.0.0.1:3334', 'preview.localhost'])('should match %s', (host) => {
        expect(matchesHost(LOCAL_HOST_CONDITION, host)).toBe(true);
    });

    it.each(['stefanknoch.com', 'www.stefanknoch.com', 'localhost.example.com', 'notlocalhost', 'portfolio.vercel.app'])(
        'should not match %s',
        (host) => {
            expect(matchesHost(LOCAL_HOST_CONDITION, host)).toBe(false);
        },
    );
});

describe('next.config.ts headers', () => {
    beforeEach(() => {
        vi.stubEnv('NODE_ENV', 'production');
        vi.stubEnv('VERCEL_ENV', undefined);
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('should send the deployed site the policy with the upgrade', async () => {
        const policies = await policiesFor('stefanknoch.com');

        expect(policies).toHaveLength(1);
        expect(policies[0]?.has('upgrade-insecure-requests')).toBe(true);
        expect(policies[0]?.get('script-src')).not.toContain(keyword('unsafe-eval'));
    });

    it.each([undefined, 'production', 'development'])('should leave the Vercel Toolbar out when VERCEL_ENV is %s', async (environment) => {
        vi.stubEnv('VERCEL_ENV', environment);

        const policies = [...await policiesFor('stefanknoch.com'), ...await policiesFor('localhost:3334')];

        expect(policies).toHaveLength(2);
        expect(policies.some(namesToolbar)).toBe(false);
    });

    it('should allow the Vercel Toolbar on a preview build', async () => {
        vi.stubEnv('VERCEL_ENV', 'preview');

        const policies = await policiesFor('portfolio-git-branch.vercel.app');

        expect(policies).toHaveLength(1);
        expect(policies[0]).toEqual(preview);
    });

    it('should send a local production build the policy without it', async () => {
        const policies = await policiesFor('localhost:3334');

        expect(policies).toHaveLength(1);
        expect(policies[0]?.has('upgrade-insecure-requests')).toBe(false);
        expect(policies[0]?.get('script-src')).not.toContain(keyword('unsafe-eval'));
    });

    // withBotId appends its own rule for the proxied challenge, after the
    // site's; Next lets the last matching header win, so the challenge may be
    // framed by this origin and nothing else.
    it('should let BotID\'s proxied path be framed by this origin only', async () => {
        const policies = await policiesFor('stefanknoch.com', BOTID_PATH);

        expect(policies).toHaveLength(2);
        expect(policies.at(-1)).toEqual(new Map([['frame-ancestors', [keyword('self')]]]));
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
