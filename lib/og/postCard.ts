/**
 * A post's share card as page metadata.
 *
 * The card is a plain route (`app/blog/[slug]/card.png/route.tsx`), not an
 * `opengraph-image` file, so the post's own metadata links it, and can give
 * it the post's title as its alt text. Structured data links the same URL.
 */

import { ogContentType, ogImageSize } from './createOgImage';

/** The site-relative path of a post's share card. */
export const postCardPath = (slug: string) => `/blog/${slug}/card.png`;

/** The card as an Open Graph or X image entry, described by the post's title. */
export const postCardImage = (post: { slug: string; title: string }) => ({
    url: postCardPath(post.slug),
    ...ogImageSize,
    type: ogContentType,
    alt: post.title,
});
