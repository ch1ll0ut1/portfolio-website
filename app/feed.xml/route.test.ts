/**
 * Tests for the RSS feed: a well-formed RSS 2.0 document listing every
 * published post with absolute links and RFC 822 dates.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { blogPosts, type BlogPost } from '@/config/blog';
import { siteConfig } from '@/config/site';
import { feedAlternateTypes, rssFeed } from '@/lib/feed';
import { GET } from './route';

const post = (slug: string, published: boolean, extra: Partial<BlogPost> = {}): BlogPost => ({
    id: slug,
    title: slug,
    excerpt: 'An excerpt.',
    date: '2030-01-01',
    tags: ['AI'],
    slug,
    published,
    ...extra,
});

/** The text of every `<tag>` in `xml`, in order. */
const all = (xml: string, tag: string) => [...xml.matchAll(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, 'g'))].map(match => match[1]);

describe('/feed.xml', () => {
    afterEach(() => {
        vi.doUnmock('@/config/blog');
        vi.resetModules();
    });

    it('should answer with an RSS document', async () => {
        // Act
        const response = GET();
        const xml = await response.text();

        // Assert
        expect(response.headers.get('Content-Type')).toBe('application/rss+xml; charset=utf-8');
        expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"')).toBe(true);
        expect(xml.trimEnd().endsWith('</rss>')).toBe(true);
        expect(all(xml, 'title')[0]).toBe(`${siteConfig.name} — Writing`);
        expect(xml).toContain(`<atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml"/>`);
    });

    it('should list every published post with an absolute link, guid and description', async () => {
        // Act
        const xml = await GET().text();

        // Assert
        const published = blogPosts.filter(entry => entry.published);
        expect(all(xml, 'guid')).toEqual(published.map(entry => `${siteConfig.url}/blog/${entry.slug}`));
        expect(all(xml, 'link').slice(1)).toEqual(published.map(entry => `${siteConfig.url}/blog/${entry.slug}`));
        expect(all(xml, 'description')).toHaveLength(published.length + 1);
    });

    it('should leave drafts out even when the config serves them', async () => {
        // Arrange
        vi.resetModules();
        vi.doMock('@/config/blog', async importOriginal => ({
            ...await importOriginal<typeof import('@/config/blog')>(),
            blogPosts: [post('a-draft', false), post('a-post', true)],
        }));
        const { GET: freshGet } = await import('./route');

        // Act
        const xml = await freshGet().text();

        // Assert
        expect(xml).toContain('/blog/a-post</guid>');
        expect(xml).not.toContain('a-draft');
    });
});

describe('rssFeed', () => {
    it('should date items in RFC 822, at midnight in Bangkok', () => {
        // Act
        const xml = rssFeed([post('a-post', true, { date: '2025-08-14' })]);

        // Assert
        expect(all(xml, 'pubDate')).toEqual(['Wed, 13 Aug 2025 17:00:00 GMT']);
    });

    it('should date the channel by its most recent change, updates included', () => {
        // Act
        const xml = rssFeed([
            post('newest', true, { date: '2030-02-01' }),
            post('revised', true, { date: '2030-01-01', updated: '2030-03-01' }),
        ]);

        // Assert
        expect(all(xml, 'lastBuildDate')).toEqual(['Thu, 28 Feb 2030 17:00:00 GMT']);
    });

    it('should list each tag as a category and escape markup in text', () => {
        // Act
        const xml = rssFeed([post('a-post', true, { title: 'Q&A: <tags> "quoted"', tags: ['Node.js', 'R&D'] })]);

        // Assert
        expect(all(xml, 'title')[1]).toBe('Q&amp;A: &lt;tags&gt; &quot;quoted&quot;');
        expect(all(xml, 'category')).toEqual(['Node.js', 'R&amp;D']);
    });
});

describe('feedAlternateTypes', () => {
    it('should announce the feed as RSS under its title', () => {
        expect(feedAlternateTypes).toEqual({
            'application/rss+xml': [{ url: '/feed.xml', title: `${siteConfig.name} — Writing` }],
        });
    });
});
