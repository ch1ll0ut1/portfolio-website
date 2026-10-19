/**
 * Tests for the article route's server entry points: the metadata it gives a
 * post, and the 404 for a slug it does not know. Which slugs it builds is in
 * staticParams.test.ts, which needs a production environment of its own.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/config/blog';
import { absoluteUrl, siteConfig } from '@/config/site';
import { itemAt } from '@/test/itemAt';
// Imported once at module scope rather than inside each test: loading the
// route pulls in the whole article graph, and a cold load inside a test body
// raced the 5 s test timeout whenever the machine was busy.
import BlogPost, { generateMetadata } from './page';

// Hoisted with the mock below, which closes over it.
const { NOT_FOUND } = vi.hoisted(() => ({ NOT_FOUND: new Error('NEXT_NOT_FOUND') }));

vi.mock('next/navigation', () => ({
    notFound: vi.fn(() => {
        throw NOT_FOUND;
    }),
}));

const params = (slug: string) => Promise.resolve({ slug });

describe('/blog/[slug]', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('generateMetadata', () => {
        it('should give a post its title, excerpt, canonical path and article card', async () => {
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
                siteName: siteConfig.name,
                locale: 'en_US',
                authors: [siteConfig.name],
                tags: post.tags,
            });
            expect(metadata.twitter).toMatchObject({ card: 'summary_large_image', title: post.title });
            expect(metadata.robots).toBeUndefined();
            expect(metadata).not.toHaveProperty('keywords');
        });

        // Next's own `noindex` on the 404 keeps it out of the index; a value
        // here would only be a second robots tag.
        it('should leave the robots tag of an unknown slug to Next', async () => {
            const metadata = await generateMetadata({ params: params('this-article-does-not-exist') });

            expect(metadata.title).toBe('Post not found');
            expect(metadata.robots).toBeNull();
        });
    });

    describe('page', () => {
        it('should answer an unknown slug with notFound()', async () => {
            await expect(BlogPost({ params: params('this-article-does-not-exist') })).rejects.toBe(NOT_FOUND);
            expect(notFound).toHaveBeenCalledOnce();
        });

        it('should render a known post without calling notFound()', async () => {
            await expect(BlogPost({ params: params(itemAt(blogPosts, 0).slug) })).resolves.toBeTruthy();
            expect(notFound).not.toHaveBeenCalled();
        });
    });
});
