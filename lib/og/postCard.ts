/**
 * Where a post's share card is served.
 *
 * The card route (`app/blog/[slug]/opengraph-image.tsx`) describes its image
 * with `generateImageMetadata`, which is how the card's alt text can be the
 * post's own title. That puts the card's id at the end of its URL, so
 * anything linking the card by hand (structured data) builds the URL here.
 */

/** The id of the one card each post has. */
export const POST_CARD_ID = 'card';

/** The site-relative path of a post's share card. */
export const postCardPath = (slug: string) => `/blog/${slug}/opengraph-image/${POST_CARD_ID}`;
