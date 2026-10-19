/**
 * Schema.org structured data for every page that emits JSON-LD.
 *
 * The builders return plain graph nodes without `@context`; `jsonLdGraph`
 * gathers a page's nodes into one document and `serializeJsonLd` turns that
 * into the text of a `<script type="application/ld+json">`. Keeping them all
 * here means every page describes the author the same way.
 *
 * The site owner is one node, `personSchema`, identified by `PERSON_ID`. Other
 * nodes point at him through that `@id` (`authorRef`, `personRef`), so a
 * search engine joins them into one entity rather than reading a new person
 * on every page.
 */

import { type BlogPost } from '@/config/blog';
import { links } from '@/config/links';
import { absoluteUrl, siteConfig, siteTitle } from '@/config/site';
import { bangkokDateTime } from './date';

export type JsonLdObject = Record<string, unknown>;

/** One step of a breadcrumb trail: its visible name and its site path. */
export interface BreadcrumbItem {
    name: string;
    path: string;
}

interface PersonOptions {
    /** `Offer` nodes for `makesOffer`, such as the services he sells. */
    offers?: JsonLdObject[];
}

/** The `@id` of the site owner's Person node. */
export const PERSON_ID = absoluteUrl('/#person');

/** The `@id` of the WebSite node. */
export const WEBSITE_ID = absoluteUrl('/#website');

/**
 * Serializes structured data for inline embedding. `<` is escaped so a value
 * containing `</script>` cannot close the tag early and inject markup, as the
 * Next.js JSON-LD guide recommends.
 */
export const serializeJsonLd = (data: JsonLdObject) => JSON.stringify(data).replace(/</g, '\\u003c');

/** One JSON-LD document holding every node a page describes. */
export const jsonLdGraph = (...nodes: JsonLdObject[]): JsonLdObject => ({
    '@context': 'https://schema.org',
    '@graph': nodes,
});

/** A bare reference to the site owner, for `mainEntity`, `provider` and the like. */
export const personRef = (): JsonLdObject => ({ '@id': PERSON_ID });

/**
 * The author reference used inside other schemas: the Person's `@id`, plus
 * enough to stand on its own on a page that does not carry the full node.
 */
export const authorRef = (): JsonLdObject => ({
    '@type': 'Person',
    '@id': PERSON_ID,
    'name': siteConfig.name,
    'url': absoluteUrl(),
    'jobTitle': siteConfig.jobTitle,
    'sameAs': [links.social.linkedin, links.social.github],
});

/** The full Person node for the homepage; `offers` become its `makesOffer`. */
export const personSchema = ({ offers = [] }: PersonOptions = {}): JsonLdObject => ({
    ...authorRef(),
    description: siteConfig.description,
    image: absoluteUrl('/opengraph-image'),
    address: {
        '@type': 'PostalAddress',
        'addressLocality': siteConfig.city,
        'addressCountry': siteConfig.countryCode,
    },
    knowsLanguage: ['en', 'de'],
    knowsAbout: [
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
    ...(offers.length > 0 ? { makesOffer: offers } : {}),
});

/** The WebSite node, published by the site owner. */
export const websiteSchema = (): JsonLdObject => ({
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    'name': siteConfig.name,
    'alternateName': new URL(siteConfig.url).hostname,
    'url': absoluteUrl(),
    'inLanguage': 'en',
    'publisher': personRef(),
});

/** The homepage as a ProfilePage about the site owner. */
export const profilePageSchema = (): JsonLdObject => ({
    '@type': 'ProfilePage',
    '@id': absoluteUrl('/#profilepage'),
    'url': absoluteUrl(),
    'name': siteTitle,
    'inLanguage': 'en',
    'isPartOf': { '@id': WEBSITE_ID },
    'mainEntity': personRef(),
    'dateModified': bangkokDateTime(siteConfig.staticPagesUpdated),
});

/** A BreadcrumbList from the homepage down to the current page, in that order. */
export const breadcrumbSchema = (items: BreadcrumbItem[]): JsonLdObject => ({
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.name,
        'item': absoluteUrl(item.path),
    })),
});

/** The Blog node for the index, listing every post it shows. */
export const blogSchema = (posts: BlogPost[]): JsonLdObject => ({
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
        'datePublished': bangkokDateTime(post.date),
        'url': absoluteUrl(`/blog/${post.slug}`),
        'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': absoluteUrl(`/blog/${post.slug}`),
        },
    })),
});

/** The BlogPosting node for one article page. */
export const blogPostingSchema = (post: BlogPost): JsonLdObject => {
    const url = absoluteUrl(`/blog/${post.slug}`);

    return {
        '@type': 'BlogPosting',
        'headline': post.title,
        'description': post.excerpt,
        'image': absoluteUrl(`/blog/${post.slug}/opengraph-image`),
        'author': authorRef(),
        // A personal site: the author is the publisher, so no organization logo is needed.
        'publisher': authorRef(),
        'datePublished': bangkokDateTime(post.date),
        'dateModified': bangkokDateTime(post.date),
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

/** The breadcrumb trail of one article: Home › Writing › the post. */
export const blogPostBreadcrumbs = (post: BlogPost): BreadcrumbItem[] => [
    { name: 'Home', path: '/' },
    { name: 'Writing', path: '/blog' },
    { name: post.title, path: `/blog/${post.slug}` },
];
