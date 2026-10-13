/**
 * Tests for which article pages the build generates.
 *
 * In its own file because it loads the route under NODE_ENV=production, and
 * React picks its production or development JSX runtime once per process:
 * rendering anything afterwards in the same file would get the wrong one.
 */

import fs from 'fs';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

describe('/blog/[slug] generateStaticParams', () => {
    beforeAll(() => {
        vi.stubEnv('NODE_ENV', 'production');
        vi.resetModules();
    });

    afterAll(() => {
        vi.unstubAllEnvs();
    });

    it('should build exactly the published posts', async () => {
        const [{ generateStaticParams }, { blogPosts }] = await Promise.all([import('./page'), import('@/config/blog')]);

        const slugs = (await generateStaticParams()).map(param => param.slug);

        expect(slugs.length).toBeGreaterThan(0);
        expect(blogPosts.every(post => post.published)).toBe(true);
        expect(slugs).toEqual(blogPosts.map(post => post.slug));
    });

    it('should only build slugs that have a markdown file', async () => {
        const { generateStaticParams } = await import('./page');

        for (const { slug } of await generateStaticParams()) {
            expect(fs.existsSync(path.join(process.cwd(), 'content', 'blog', `${slug}.md`)), slug).toBe(true);
        }
    });
});
