import { describe, it, expect } from 'vitest';
import { type BlogPost } from '@/config/blog';
import { links } from '@/config/links';
import { siteConfig } from '@/config/site';
import {
    PERSON_ID,
    WEBSITE_ID,
    authorRef,
    blogPostBreadcrumbs,
    blogPostingSchema,
    blogSchema,
    breadcrumbSchema,
    jsonLdGraph,
    personSchema,
    profilePageSchema,
    serializeJsonLd,
    websiteSchema,
} from './structuredData';

const post: BlogPost = {
    id: 'x',
    title: 'A post',
    excerpt: 'What it says.',
    date: '2026-01-02',
    readTime: '3 min read',
    tags: ['One', 'Two'],
    slug: 'a-post',
    published: true,
};

describe('structuredData', () => {
    describe('serializeJsonLd', () => {
        it('should escape every opening angle bracket', () => {
            // Act
            const text = serializeJsonLd({ value: '<b></script>' });

            // Assert
            expect(text).not.toContain('<');
            expect(JSON.parse(text)).toEqual({ value: '<b></script>' });
        });
    });

    describe('jsonLdGraph', () => {
        it('should gather the nodes under one context, in order', () => {
            // Act
            const graph = jsonLdGraph({ '@type': 'A' }, { '@type': 'B' });

            // Assert
            expect(graph).toEqual({
                '@context': 'https://schema.org',
                '@graph': [{ '@type': 'A' }, { '@type': 'B' }],
            });
        });
    });

    describe('personSchema', () => {
        it('should describe the site owner with image, profiles and languages', () => {
            // Act
            const schema = personSchema();

            // Assert
            expect(schema).toMatchObject({
                '@type': 'Person',
                '@id': `${siteConfig.url}/#person`,
                'name': siteConfig.name,
                'jobTitle': 'Software architect & tech lead',
                'knowsLanguage': ['en', 'de'],
                'sameAs': expect.arrayContaining([links.social.linkedin, links.social.github]),
            });
            expect(schema.image).toEqual(expect.stringContaining(siteConfig.url));
        });

        it('should not publish an email address', () => {
            // Act
            const schema = personSchema();

            // Assert
            expect(schema).not.toHaveProperty('email');
        });

        it('should list offers only when given some', () => {
            // Arrange
            const offer = { '@type': 'Offer', 'name': 'An offer' };

            // Act
            const without = personSchema();
            const withOffers = personSchema({ offers: [offer] });

            // Assert
            expect(without).not.toHaveProperty('makesOffer');
            expect(withOffers.makesOffer).toEqual([offer]);
        });
    });

    describe('authorRef', () => {
        it('should point at the Person node and carry enough to stand alone', () => {
            // Act
            const ref = authorRef();

            // Assert
            expect(ref).toEqual({
                '@type': 'Person',
                '@id': PERSON_ID,
                'name': siteConfig.name,
                'url': siteConfig.url,
                'jobTitle': siteConfig.jobTitle,
                'sameAs': [links.social.linkedin, links.social.github],
            });
        });
    });

    describe('websiteSchema and profilePageSchema', () => {
        it('should describe the site as published by the person', () => {
            // Act
            const schema = websiteSchema();

            // Assert
            expect(schema).toMatchObject({
                '@type': 'WebSite',
                '@id': `${siteConfig.url}/#website`,
                'alternateName': 'stefanknoch.com',
                'url': siteConfig.url,
                'inLanguage': 'en',
                'publisher': { '@id': PERSON_ID },
            });
        });

        it('should make the person the main entity of the homepage', () => {
            // Act
            const schema = profilePageSchema();

            // Assert
            expect(schema).toMatchObject({
                '@type': 'ProfilePage',
                'url': siteConfig.url,
                'isPartOf': { '@id': WEBSITE_ID },
                'mainEntity': { '@id': PERSON_ID },
            });
        });

        it('should resolve every @id the homepage graph references', () => {
            // Arrange
            const nodes = [websiteSchema(), profilePageSchema(), personSchema()];
            const graph = jsonLdGraph(...nodes);
            const ids = new Set(nodes.map(node => node['@id']));

            // Act
            const references = JSON.stringify(graph).match(/"@id":"[^"]+"/g) ?? [];

            // Assert
            references.forEach((reference) => {
                expect(ids).toContain(JSON.parse(`{${reference}}`)['@id']);
            });
        });
    });

    describe('breadcrumbSchema', () => {
        it('should number the steps from one and resolve their paths', () => {
            // Act
            const schema = breadcrumbSchema([
                { name: 'Home', path: '/' },
                { name: 'Writing', path: '/blog' },
            ]);

            // Assert
            expect(schema).toEqual({
                '@type': 'BreadcrumbList',
                'itemListElement': [
                    { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': siteConfig.url },
                    { '@type': 'ListItem', 'position': 2, 'name': 'Writing', 'item': `${siteConfig.url}/blog` },
                ],
            });
        });

        it('should trail a post from home through the blog', () => {
            // Act
            const items = blogPostBreadcrumbs(post);

            // Assert
            expect(items).toEqual([
                { name: 'Home', path: '/' },
                { name: 'Writing', path: '/blog' },
                { name: 'A post', path: '/blog/a-post' },
            ]);
        });
    });

    describe('blogPostingSchema', () => {
        it('should name the person as publisher instead of an organization logo', () => {
            // Act
            const schema = blogPostingSchema(post);

            // Assert
            expect(schema.publisher).toMatchObject({ '@type': 'Person', '@id': PERSON_ID, 'name': siteConfig.name });
            expect(schema.author).toMatchObject({ '@id': PERSON_ID });
            expect(JSON.stringify(schema)).not.toContain('logo');
        });

        it('should point its image and URL at the post', () => {
            // Act
            const schema = blogPostingSchema(post);

            // Assert
            expect(schema.url).toBe(`${siteConfig.url}/blog/a-post`);
            expect(schema.image).toBe(`${siteConfig.url}/blog/a-post/opengraph-image`);
        });

        it('should date the post in Bangkok time', () => {
            // Act
            const schema = blogPostingSchema(post);

            // Assert
            expect(schema.datePublished).toBe('2026-01-02T00:00:00+07:00');
            expect(schema.dateModified).toBe('2026-01-02T00:00:00+07:00');
        });
    });

    describe('blogSchema', () => {
        it('should list one posting per post', () => {
            // Act
            const schema = blogSchema([post, { ...post, id: 'y', slug: 'b-post' }]);

            // Assert
            expect(schema.blogPost).toHaveLength(2);
        });
    });
});
