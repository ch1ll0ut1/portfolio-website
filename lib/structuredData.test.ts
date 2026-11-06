import { describe, it, expect } from 'vitest';
import { type BlogPost } from '@/config/blog';
import { links } from '@/config/links';
import { siteConfig, siteCopy } from '@/config/site';
import {
    PERSON_ID,
    authorRef,
    blogPostBreadcrumbs,
    blogPostingSchema,
    blogSchema,
    breadcrumbSchema,
    jsonLdGraph,
    personSchema,
    profilePageSchema,
    serializeJsonLd,
    websiteId,
    websiteSchema,
} from './structuredData';

const post: BlogPost = {
    id: 'x',
    title: 'A post',
    excerpt: 'What it says.',
    date: '2026-01-02',
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
                'jobTitle': 'Freelance software architect & fractional CTO',
                'knowsLanguage': ['en', 'de'],
                'sameAs': expect.arrayContaining([links.social.linkedin, links.social.github]),
            });
            expect(schema.image).toEqual({
                '@type': 'ImageObject',
                'url': `${siteConfig.url}/stefan-knoch.jpg`,
                'width': 800,
                'height': 800,
            });
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

    describe('German pages', () => {
        it('should give the author his German job title', () => {
            // Act
            const ref = authorRef('de');

            // Assert
            expect(ref).toMatchObject({ '@id': PERSON_ID, 'jobTitle': siteCopy.de.jobTitle });
        });

        it('should describe the person in German on the German homepage', () => {
            // Act
            const schema = personSchema({ locale: 'de' });

            // Assert
            expect(schema).toMatchObject({
                '@id': PERSON_ID,
                'jobTitle': siteCopy.de.jobTitle,
                'description': siteCopy.de.description,
            });
        });

        it('should make the German homepage a German profile page at its own URL', () => {
            // Act
            const schema = profilePageSchema('de');

            // Assert
            expect(schema).toMatchObject({
                '@id': `${siteConfig.url}/de#profilepage`,
                'url': `${siteConfig.url}/de`,
                'name': siteCopy.de.title,
                'inLanguage': 'de',
                'mainEntity': { '@id': PERSON_ID },
            });
        });

        it('should credit a German post to the author with his German job title', () => {
            // Act
            const schema = blogPostingSchema(post, 'de');

            // Assert
            expect(schema.author).toMatchObject({ jobTitle: siteCopy.de.jobTitle });
            expect(schema.publisher).toMatchObject({ jobTitle: siteCopy.de.jobTitle });
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

        it('should give the German site its own @id, so the two languages are not merged into one node', () => {
            // Act
            const english = websiteSchema('en');
            const german = websiteSchema('de');

            // Assert
            expect(german).toMatchObject({
                '@id': `${siteConfig.url}/de#website`,
                'url': `${siteConfig.url}/de`,
                'inLanguage': 'de',
            });
            expect(german['@id']).not.toBe(english['@id']);
            expect(profilePageSchema('de')).toMatchObject({ isPartOf: { '@id': german['@id'] } });
        });

        it('should make the person the main entity of the homepage', () => {
            // Act
            const schema = profilePageSchema();

            // Assert
            expect(schema).toMatchObject({
                '@type': 'ProfilePage',
                'url': siteConfig.url,
                'isPartOf': { '@id': websiteId('en') },
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
            const items = blogPostBreadcrumbs(post, 'en');

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
            const schema = blogPostingSchema(post, 'en');

            // Assert
            expect(schema.publisher).toMatchObject({ '@type': 'Person', '@id': PERSON_ID, 'name': siteConfig.name });
            expect(schema.author).toMatchObject({ '@id': PERSON_ID });
            expect(JSON.stringify(schema)).not.toContain('logo');
        });

        it('should point its image and URL at the post', () => {
            // Act
            const schema = blogPostingSchema(post, 'en');

            // Assert
            expect(schema.url).toBe(`${siteConfig.url}/blog/a-post`);
            expect(schema.image).toBe(`${siteConfig.url}/blog/a-post/card.png`);
            expect(schema.inLanguage).toBe('en-US');
        });

        it('should point a German post at its German page and card, in German', () => {
            // Act
            const schema = blogPostingSchema(post, 'de');
            const items = blogPostBreadcrumbs(post, 'de');

            // Assert
            expect(schema.url).toBe(`${siteConfig.url}/de/blog/a-post`);
            expect(schema.image).toBe(`${siteConfig.url}/de/blog/a-post/card.png`);
            expect(schema.inLanguage).toBe('de-DE');
            expect(items.map(item => item.path)).toEqual(['/de', '/de/blog', '/de/blog/a-post']);
        });

        it('should link the English original and its German translation both ways', () => {
            // Act
            const english = blogPostingSchema(post, 'en');
            const german = blogPostingSchema(post, 'de');

            // Assert
            expect(english.workTranslation).toEqual({ '@type': 'BlogPosting', 'url': `${siteConfig.url}/de/blog/a-post`, 'inLanguage': 'de-DE' });
            expect(german.translationOfWork).toEqual({ '@type': 'BlogPosting', 'url': `${siteConfig.url}/blog/a-post`, 'inLanguage': 'en-US' });
            expect(english).not.toHaveProperty('translationOfWork');
            expect(german).not.toHaveProperty('workTranslation');
        });

        it('should date the post in Bangkok time', () => {
            // Act
            const schema = blogPostingSchema(post, 'en');

            // Assert
            expect(schema.datePublished).toBe('2026-01-02T00:00:00+07:00');
            expect(schema.dateModified).toBe('2026-01-02T00:00:00+07:00');
        });

        it('should date the modification by the post\'s update when it has one', () => {
            // Act
            const schema = blogPostingSchema({ ...post, updated: '2026-03-04' }, 'en');

            // Assert
            expect(schema.datePublished).toBe('2026-01-02T00:00:00+07:00');
            expect(schema.dateModified).toBe('2026-03-04T00:00:00+07:00');
        });
    });

    describe('blogSchema', () => {
        it('should list one posting per post', () => {
            // Act
            const schema = blogSchema([post, { ...post, id: 'y', slug: 'b-post' }], 'en');

            // Assert
            expect(schema.blogPost).toHaveLength(2);
        });
    });
});
