import { notFound } from 'next/navigation';
import { blogPosts } from '@/config/blog';
import { listBlogPosts } from '@/lib/content/blogPosts';
import { createOgImage, ogContentType, ogImageSize } from '@/lib/og/createOgImage';
import { OgHeadline } from '@/lib/og/OgHeadline';
import { OgLayout } from '@/lib/og/OgLayout';
import { OgMono } from '@/lib/og/OgMono';
import { ogPalette } from '@/lib/og/palette';
import { POST_CARD_ID } from '@/lib/og/postCard';
import { headlineSize, postMetaLine, truncateAtWord } from '@/lib/og/text';

/** Only the posts generated at build time have a card; anything else is a 404. */
export const dynamicParams = false;

/** Longest title the card sets in full; three lines at the smallest headline size. */
const TITLE_MAX = 84;
const TAGS_SHOWN = 3;

export async function generateStaticParams() {
    return blogPosts.map(post => ({ slug: post.slug }));
}

/**
 * The post's one card, described per post so its alt text is the post's
 * title. Through this, the card's URL ends in its id (lib/og/postCard.ts).
 * An unknown slug has no card, and the route answers 404.
 */
export function generateImageMetadata({ params }: { params: { slug: string } }) {
    const post = blogPosts.find(p => p.slug === params.slug);

    return post
        ? [{ id: POST_CARD_ID, alt: post.title, size: ogImageSize, contentType: ogContentType }]
        : [];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = listBlogPosts().find(p => p.slug === slug);

    // Unreachable with `dynamicParams` off; narrows `post` for the render.
    if (!post) {
        notFound();
    }

    const title = truncateAtWord(post.title, TITLE_MAX);

    return createOgImage(
        <OgLayout>
            <OgHeadline text={title} fontSize={headlineSize(title)} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 36 }}>
                <OgMono>{postMetaLine(post)}</OgMono>
                <OgMono color={ogPalette.caret}>
                    {post.tags.slice(0, TAGS_SHOWN).join(' / ')}
                </OgMono>
            </div>
        </OgLayout>,
    );
}
