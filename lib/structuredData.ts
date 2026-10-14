/**
 * Schema.org structured data for the homepage, the blog index and each post.
 *
 * The builders return plain objects; `serializeJsonLd` turns one into the text
 * of a `<script type="application/ld+json">`. Keeping both here means the
 * three pages that emit JSON-LD describe the author the same way.
 */

import { type BlogPost } from '@/config/blog';
import { links } from '@/config/links';
import { absoluteUrl, siteConfig } from '@/config/site';

export type JsonLdObject = Record<string, unknown>;

/**
 * Serializes structured data for inline embedding. `<` is escaped so a value
 * containing `</script>` cannot close the tag early and inject markup, as the
 * Next.js JSON-LD guide recommends.
 */
export const serializeJsonLd = (data: JsonLdObject) => JSON.stringify(data).replace(/</g, '\\u003c');

/** The short author reference used inside other schemas. */
export const authorRef = (): JsonLdObject => ({
    '@type': 'Person',
    'name': siteConfig.name,
    'url': absoluteUrl(),
});

/** The full Person schema for the homepage. */
export const personSchema = (): JsonLdObject => ({
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': siteConfig.name,
    'jobTitle': siteConfig.jobTitle,
    'description': siteConfig.description,
    'url': absoluteUrl(),
    'image': absoluteUrl('/opengraph-image'),
    'address': {
        '@type': 'PostalAddress',
        'addressLocality': siteConfig.city,
        'addressCountry': siteConfig.countryCode,
    },
    'sameAs': [
        links.social.linkedin,
        links.social.github,
    ],
    'knowsAbout': [
        'Software Architecture',
        'Full-Stack Development',
        'Technical Leadership',
        'Rich Text Editors',
        'React',
        'TypeScript',
        'Next.js',
        'Node.js',
        'AWS',
        'AI-Augmented Engineering',
    ],
});

/** The Blog schema for the index, listing every post it shows. */
export const blogSchema = (posts: BlogPost[]): JsonLdObject => ({
    '@context': 'https://schema.org',
    '@type': 'Blog',
    'name': `${siteConfig.name} Blog`,
    'description': 'Writing on software engineering, technical leadership, hiring, and building software with AI.',
    'url': absoluteUrl('/blog'),
    'author': authorRef(),
    'blogPost': posts.map(post => ({
        '@type': 'BlogPosting',
        'headline': post.title,
        'description': post.excerpt,
        'author': authorRef(),
        'datePublished': post.date,
        'url': absoluteUrl(`/blog/${post.slug}`),
        'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': absoluteUrl(`/blog/${post.slug}`),
        },
    })),
});

/** The BlogPosting schema for one article page. */
export const blogPostingSchema = (post: BlogPost): JsonLdObject => {
    const url = absoluteUrl(`/blog/${post.slug}`);

    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': post.title,
        'description': post.excerpt,
        'image': absoluteUrl(`/blog/${post.slug}/opengraph-image`),
        'author': authorRef(),
        // A personal site: the author is the publisher, so no organization logo is needed.
        'publisher': authorRef(),
        'datePublished': post.date,
        'dateModified': post.date,
        'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': url,
        },
        'url': url,
        'keywords': post.tags.join(', '),
        'inLanguage': 'en-US',
        'isAccessibleForFree': true,
    };
};
