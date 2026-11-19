/**
 * A post's share card as page metadata.
 *
 * The card is a plain route (`app/(en)/blog/[slug]/card.png/route.tsx`, its
 * body in ./postCardRoute.tsx), not an `opengraph-image` file, so the post's
 * own metadata links it, and can give it the post's title as its alt text.
 * Structured data links the same URL.
 */

import type { Locale } from '@/lib/i18n/locale';
import { localizedPath } from '@/lib/i18n/paths';
import { ogContentType, ogImageSize } from './createOgImage';

/** The site-relative path of a post's share card in `locale`. */
export const postCardPath = (slug: string, locale: Locale) => localizedPath(locale, `/blog/${slug}/card.png`);

/** The card as an Open Graph or X image entry, described by the post's title. */
export const postCardImage = (post: { slug: string; title: string }, locale: Locale) => ({
    url: postCardPath(post.slug, locale),
    ...ogImageSize,
    type: ogContentType,
    alt: post.title,
});
