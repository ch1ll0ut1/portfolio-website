/**
 * Tests for the redirects in `next.config.ts`. The security headers are
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

    it.each(['stefanknoch.com', 'localhost', 'stefan-knoch-portfolio-git-main.vercel.app', 'stefan-knoch-portfolioxvercelxapp'])(
        'should leave %s alone',
        async (host) => {
            expect(await redirectsFor(host)).toHaveLength(0);
        },
    );
});
