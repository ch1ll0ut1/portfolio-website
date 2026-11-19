/**
 * Tests for the redirects and flags in `next.config.ts`. The security headers are
 * covered beside the policy, in lib/contentSecurityPolicy.test.ts.
 */

import { describe, expect, it } from 'vitest';
import { siteConfig } from './config/site';
import nextConfig from './next.config';

/** The redirect rules whose host condition matches `host`. */
const redirectsFor = async (host: string) => {
    const rules = await nextConfig.redirects?.() ?? [];

    return rules.filter(rule => (rule.has ?? []).some(
        condition => condition.type === 'host' && new RegExp(`^${condition.value}$`).test(host),
    ));
};

describe('next.config.ts redirects', () => {
    it('should send the Vercel project domain permanently to the canonical origin, path kept', async () => {
        const rules = await redirectsFor('stefan-knoch-portfolio.vercel.app');

        expect(rules).toHaveLength(1);
        expect(rules[0]).toMatchObject({
            source: '/:path*',
            destination: `${siteConfig.url}/:path*`,
            permanent: true,
        });
    });

    it.each([
        'stefanknoch.com',
        'localhost',
        'stefan-knoch-portfolio-git-main.vercel.app',
        'stefan-knoch-portfolio-k3x9q2abc-stefan-knochs-projects.vercel.app',
        'stefan-knoch-portfolioxvercelxapp',
    ])(
        'should leave %s alone',
        async (host) => {
            expect(await redirectsFor(host)).toHaveLength(0);
        },
    );
});

describe('next.config.ts rewrites', () => {
    it('should keep serving the English share cards at their old URLs', async () => {
        const rewrites = await nextConfig.rewrites?.();

        expect(rewrites).toMatchObject({
            afterFiles: expect.arrayContaining([
                { source: '/work/:slug/opengraph-image', destination: '/work/:slug/opengraph-image-j99tbg' },
            ]),
        });
    });

    // Fallback: after every page and dynamic route, so real German pages are never shadowed.
    it('should send every German path no page claims to the German 404, after all routes', async () => {
        const rewrites = await nextConfig.rewrites?.();

        expect(rewrites).toMatchObject({
            fallback: [{ source: '/de/:path+', destination: '/de/nicht-gefunden' }],
        });
    });
});

describe('next.config.ts experimental flags', () => {
    // Without it app/global-not-found.tsx is ignored and an unknown URL gets Next's bare 404.
    it('should turn on the global 404', () => {
        expect(nextConfig.experimental?.globalNotFound).toBe(true);
    });
});
