import { describe, it, expect } from 'vitest';
import { type BlogPost } from '@/config/blog';
import { siteConfig } from '@/config/site';
import { blogPostingSchema, blogSchema, personSchema, serializeJsonLd } from './structuredData';

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

    describe('personSchema', () => {
        it('should describe the site owner with contact and image', () => {
            // Act
            const schema = personSchema();

            // Assert
            expect(schema).toMatchObject({
                '@type': 'Person',
                'name': siteConfig.name,
                'jobTitle': siteConfig.jobTitle,
                'email': `mailto:${siteConfig.contactEmail}`,
            });
            expect(schema.image).toEqual(expect.stringContaining(siteConfig.url));
        });
    });

    describe('blogPostingSchema', () => {
        it('should name a person as publisher instead of an organization logo', () => {
            // Act
            const schema = blogPostingSchema(post);

            // Assert
            expect(schema.publisher).toMatchObject({ '@type': 'Person', 'name': siteConfig.name });
            expect(JSON.stringify(schema)).not.toContain('logo');
        });

        it('should point its image and URL at the post', () => {
            // Act
            const schema = blogPostingSchema(post);

            // Assert
            expect(schema.url).toBe(`${siteConfig.url}/blog/a-post`);
            expect(schema.image).toBe(`${siteConfig.url}/blog/a-post/opengraph-image`);
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
