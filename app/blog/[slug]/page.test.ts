/**
 * Tests for the article route's server entry points: the metadata it gives a
 * post, and the 404 for a slug it does not know. Which slugs it builds is in
 * staticParams.test.ts, which needs a production environment of its own.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { blogPosts } from '@/config/blog';
import { absoluteUrl, siteConfig } from '@/config/site';
import { itemAt } from '@/test/itemAt';

// Hoisted with the mock below, which closes over it.
const { NOT_FOUND } = vi.hoisted(() => ({ NOT_FOUND: new Error('NEXT_NOT_FOUND') }));

vi.mock('next/navigation', () => ({
    notFound: vi.fn(() => {
        throw NOT_FOUND;
    }),
}));

const params = (slug: string) => Promise.resolve({ slug });

const loadRoute = () => import('./page');

describe('/blog/[slug]', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('generateMetadata', () => {
        it('should give a post its title, excerpt, canonical path and article card', async () => {
            const { generateMetadata } = await loadRoute();
            const post = itemAt(blogPosts, 0);

            const metadata = await generateMetadata({ params: params(post.slug) });

            expect(metadata.title).toBe(post.title);
            expect(metadata.description).toBe(post.excerpt);
            expect(metadata.alternates?.canonical).toBe(`/blog/${post.slug}`);
            expect(metadata.openGraph).toMatchObject({
                title: post.title,
                description: post.excerpt,
                url: absoluteUrl(`/blog/${post.slug}`),
                type: 'article',
                publishedTime: post.date,
                authors: [siteConfig.name],
                tags: post.tags,
            });
            expect(metadata.twitter).toMatchObject({ card: 'summary_large_image', title: post.title });
            expect(metadata.robots).toBeUndefined();
        });

        it('should keep an unknown slug out of the index', async () => {
            const { generateMetadata } = await loadRoute();

            const metadata = await generateMetadata({ params: params('this-article-does-not-exist') });

            expect(metadata.title).toBe('Post not found');
            expect(metadata.robots).toMatchObject({ index: false });
        });
    });

    describe('page', () => {
        it('should answer an unknown slug with notFound()', async () => {
            const { default: BlogPost } = await loadRoute();
            const { notFound } = await import('next/navigation');

            await expect(BlogPost({ params: params('this-article-does-not-exist') })).rejects.toBe(NOT_FOUND);
            expect(notFound).toHaveBeenCalledOnce();
        });

        it('should render a known post without calling notFound()', async () => {
            const { default: BlogPost } = await loadRoute();
            const { notFound } = await import('next/navigation');

            await expect(BlogPost({ params: params(itemAt(blogPosts, 0).slug) })).resolves.toBeTruthy();
            expect(notFound).not.toHaveBeenCalled();
        });
    });
});
