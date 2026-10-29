/**
 * The body of a post's share-card route (`/blog/[slug]/card.png` and its
 * German twin), rendered at build time.
 *
 * A plain route rather than an `opengraph-image` file: that convention gives
 * every post the same alt text, and its per-post alternative
 * (`generateImageMetadata`) cannot be prerendered under a dynamic segment.
 * The post's metadata links this card with the post's title as its alt text
 * (./postCard.ts). The route file keeps the segment config, which Next only
 * reads from the file itself.
 */

import { notFound } from 'next/navigation';
import { blogPostsFor, tagLabel } from '@/config/blog';
import { listBlogPosts } from '@/lib/content/blogPosts';
import type { Locale } from '@/lib/i18n/locale';
import { createOgImage } from './createOgImage';
import { OgHeadline } from './OgHeadline';
import { OgLayout } from './OgLayout';
import { OgMono } from './OgMono';
import { ogPalette } from './palette';
import { headlineSize, postMetaLine, truncateAtWord } from './text';

/** Longest title the card sets in full; three lines at the smallest headline size. */
const TITLE_MAX = 84;
const TAGS_SHOWN = 3;

/** One card per post in `locale`. */
export const postCardParams = (locale: Locale) => blogPostsFor(locale).map(post => ({ slug: post.slug }));

/** The card of the post at `slug` in `locale`. */
export const postCardResponse = (slug: string, locale: Locale) => {
    const post = listBlogPosts(locale).find(p => p.slug === slug);

    // Unreachable with the route's `dynamicParams` off; narrows `post` for the render.
    if (!post) {
        notFound();
    }

    const title = truncateAtWord(post.title, TITLE_MAX);

    return createOgImage(
        <OgLayout>
            <OgHeadline text={title} fontSize={headlineSize(title)} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 36 }}>
                <OgMono>{postMetaLine(post, locale)}</OgMono>
                <OgMono color={ogPalette.caret}>
                    {post.tags.slice(0, TAGS_SHOWN).map(tag => tagLabel(locale, tag)).join(' / ')}
                </OgMono>
            </div>
        </OgLayout>,
    );
};
