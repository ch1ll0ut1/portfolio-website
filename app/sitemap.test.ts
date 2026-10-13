import { describe, it, expect } from 'vitest';
import { blogPosts } from '@/config/blog';
import { siteConfig } from '@/config/site';
import sitemap from './sitemap';
import robots from './robots';

describe('sitemap', () => {
    it('should list the static pages and every post on the canonical origin', () => {
        // Act
        const urls = sitemap().map(entry => entry.url);

        // Assert
        expect(urls).toContain(`${siteConfig.url}/`);
        expect(urls).toContain(`${siteConfig.url}/blog`);
        expect(urls).toContain(`${siteConfig.url}/privacy`);
        blogPosts.forEach((post) => {
            expect(urls).toContain(`${siteConfig.url}/blog/${post.slug}`);
        });
    });

    it('should date each post by its publication date', () => {
        // Act
        const entries = sitemap();

        // Assert
        blogPosts.forEach((post) => {
            const entry = entries.find(item => item.url.endsWith(`/blog/${post.slug}`));
            expect(entry?.lastModified).toEqual(new Date(post.date));
        });
    });

    it('should give the static pages a fixed date rather than the build time', () => {
        // Act
        const first = sitemap();
        const second = sitemap();
        const home = first.find(entry => entry.url === `${siteConfig.url}/`);

        // Assert
        expect(home?.lastModified).toEqual(new Date(siteConfig.staticPagesUpdated));
        expect(first).toEqual(second);
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
