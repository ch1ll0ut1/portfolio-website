/**
 * Tests for which German article pages the build generates.
 *
 * In its own file for the reason given in the English twin's
 * (app/(en)/blog/[slug]/staticParams.test.ts): the route loads under
 * NODE_ENV=production.
 */

import fs from 'fs';
import path from 'path';
import { afterAll, describe, expect, it, vi } from 'vitest';
import { blogPosts } from '@/config/blog';
import { generateStaticParams } from './page';

vi.hoisted(() => {
    vi.stubEnv('NODE_ENV', 'production');
});

describe('/de/blog/[slug] generateStaticParams', () => {
    afterAll(() => {
        vi.unstubAllEnvs();
    });

    it('should build a German page for every published post', async () => {
        const slugs = (await generateStaticParams()).map(param => param.slug);

        expect(slugs.length).toBeGreaterThan(0);
        expect(slugs).toEqual(blogPosts.map(post => post.slug));
    });

    // The sitemap, the English page's hreflang and the boot script's redirect
    // all point at the German twin: without its markdown each lands on a 404.
    it('should only build slugs that have German markdown', async () => {
        for (const { slug } of await generateStaticParams()) {
            expect(fs.existsSync(path.join(process.cwd(), 'content', 'blog', 'de', `${slug}.md`)), slug).toBe(true);
        }
    });
});
