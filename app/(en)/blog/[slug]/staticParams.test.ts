/**
 * Tests for which article pages the build generates.
 *
 * In its own file because it loads the route under NODE_ENV=production, and
 * React picks its production or development JSX runtime once per process:
 * rendering anything afterwards in the same file would get the wrong one.
 */

import fs from 'fs';
import path from 'path';
import { afterAll, describe, expect, it, vi } from 'vitest';
import { blogPosts } from '@/config/blog';
import { generateStaticParams } from './page';

// Hoisted above the imports, so the blog config and the route load under the
// production environment from the start. Loading them at module scope also
// keeps the route's cold import out of the 5 s test timeout, which it overran
// on a busy machine when each test imported it in its body.
vi.hoisted(() => {
    vi.stubEnv('NODE_ENV', 'production');
});

describe('/blog/[slug] generateStaticParams', () => {
    afterAll(() => {
        vi.unstubAllEnvs();
    });

    it('should build exactly the published posts', async () => {
        const slugs = (await generateStaticParams()).map(param => param.slug);

        expect(slugs.length).toBeGreaterThan(0);
        expect(blogPosts.every(post => post.published)).toBe(true);
        expect(slugs).toEqual(blogPosts.map(post => post.slug));
    });

    it('should only build slugs that have a markdown file', async () => {
        for (const { slug } of await generateStaticParams()) {
            expect(fs.existsSync(path.join(process.cwd(), 'content', 'blog', `${slug}.md`)), slug).toBe(true);
        }
    });
});
