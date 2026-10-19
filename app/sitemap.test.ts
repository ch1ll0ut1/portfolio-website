import { afterEach, describe, it, expect, vi } from 'vitest';
import { blogPosts, type BlogPost } from '@/config/blog';
import { siteConfig } from '@/config/site';
import sitemap from './sitemap';
import robots from './robots';

describe('sitemap', () => {
    it('should list the static pages and every post on the canonical origin', () => {
        // Act
        const urls = sitemap().map(entry => entry.url);

        // Assert
        // The bare origin, as the homepage's canonical link writes it.
        expect(urls).toContain(siteConfig.url);
        expect(urls).toContain(`${siteConfig.url}/blog`);
        expect(urls).toContain(`${siteConfig.url}/privacy`);
        expect(urls).toContain(`${siteConfig.url}/contact`);
        blogPosts.forEach((post) => {
            expect(urls).toContain(`${siteConfig.url}/blog/${post.slug}`);
        });
    });

    it('should date each post by its last update, or its publication without one', () => {
        // Act
        const entries = sitemap();

        // Assert
        blogPosts.forEach((post) => {
            const entry = entries.find(item => item.url.endsWith(`/blog/${post.slug}`));
            expect(entry?.lastModified).toEqual(new Date(post.updated ?? post.date));
        });
    });

    it('should give the static pages a fixed date rather than the build time', () => {
        // Act
        const first = sitemap();
        const second = sitemap();
        const home = first.find(entry => entry.url === siteConfig.url);

        // Assert
        expect(home?.lastModified).toEqual(new Date(siteConfig.staticPagesUpdated));
        expect(first).toEqual(second);
    });
});

describe('sitemap contact page', () => {
    it('should list the contact page without its topic query', () => {
        // Act
        const contact = sitemap().filter(entry => new URL(entry.url).pathname === '/contact');

        // Assert
        expect(contact).toHaveLength(1);
        expect(contact[0]?.url).toBe(`${siteConfig.url}/contact`);
        expect(contact[0]?.lastModified).toEqual(new Date(siteConfig.staticPagesUpdated));
    });
});

describe('sitemap URLs and dates', () => {
    it('should leave out changeFrequency and priority, which Google ignores', () => {
        // Act
        const entries = sitemap();

        // Assert
        entries.forEach((entry) => {
            expect(entry).not.toHaveProperty('changeFrequency');
            expect(entry).not.toHaveProperty('priority');
        });
    });

    it('should give every entry an absolute https URL on the canonical origin', () => {
        // Act
        const entries = sitemap();

        // Assert
        entries.forEach((entry) => {
            const url = new URL(entry.url);

            expect(url.protocol).toBe('https:');
            expect(url.origin).toBe(new URL(siteConfig.url).origin);
        });
    });

    it('should give every entry a real calendar date, not an invalid or build-time one', () => {
        // Arrange
        const now = Date.now();

        // Act
        const entries = sitemap();

        // Assert
        entries.forEach((entry) => {
            const time = entry.lastModified instanceof Date ? entry.lastModified.getTime() : Number.NaN;

            expect(Number.isNaN(time), entry.url).toBe(false);
            expect(time, entry.url).toBeLessThan(now);
        });
    });

    it('should date the blog index by its most recent post change', () => {
        // Arrange
        const newest = Math.max(...blogPosts.map(post => new Date(post.updated ?? post.date).getTime()));

        // Act
        const index = sitemap().find(entry => entry.url === `${siteConfig.url}/blog`);

        // Assert
        expect(index?.lastModified).toEqual(new Date(newest));
    });
});

describe('sitemap with drafts', () => {
    const post = (slug: string, date: string, published: boolean, updated?: string): BlogPost => ({
        id: slug,
        title: slug,
        excerpt: '',
        date,
        readTime: '1 min read',
        tags: [],
        slug,
        published,
        updated,
    });

    afterEach(() => {
        vi.doUnmock('@/config/blog');
        vi.resetModules();
    });

    it('should list published posts and leave drafts out, even when the config serves drafts', async () => {
        // Arrange: the dev config, which keeps drafts in, newest first.
        vi.resetModules();
        vi.doMock('@/config/blog', async importOriginal => ({
            ...await importOriginal<typeof import('@/config/blog')>(),
            blogPosts: [
                post('draft-newest', '2030-01-02', false),
                post('published-post', '2030-01-01', true),
            ],
        }));
        const { default: freshSitemap } = await import('./sitemap');

        // Act
        const entries = freshSitemap();
        const urls = entries.map(entry => entry.url);
        const index = entries.find(entry => entry.url === `${siteConfig.url}/blog`);

        // Assert
        expect(urls).toContain(`${siteConfig.url}/blog/published-post`);
        expect(urls).not.toContain(`${siteConfig.url}/blog/draft-newest`);
        // A draft does not move the index's date either.
        expect(index?.lastModified).toEqual(new Date('2030-01-01'));
    });

    it('should date the index by an older post updated after the newest was published', async () => {
        // Arrange
        vi.resetModules();
        vi.doMock('@/config/blog', async importOriginal => ({
            ...await importOriginal<typeof import('@/config/blog')>(),
            blogPosts: [
                post('newest', '2030-01-02', true),
                post('revised', '2030-01-01', true, '2030-03-01'),
            ],
        }));
        const { default: freshSitemap } = await import('./sitemap');

        // Act
        const entries = freshSitemap();
        const index = entries.find(entry => entry.url === `${siteConfig.url}/blog`);
        const revised = entries.find(entry => entry.url === `${siteConfig.url}/blog/revised`);

        // Assert
        expect(index?.lastModified).toEqual(new Date('2030-03-01'));
        expect(revised?.lastModified).toEqual(new Date('2030-03-01'));
    });
});

describe('robots', () => {
    it('should allow everything and point at the sitemap on the canonical origin', () => {
        // Act
        const result = robots();

        // Assert
        expect(result.rules).toEqual({ userAgent: '*', allow: '/' });
        expect(result.sitemap).toBe(`${siteConfig.url}/sitemap.xml`);
    });
});
