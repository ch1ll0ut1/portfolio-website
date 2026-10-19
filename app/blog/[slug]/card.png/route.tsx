import { notFound } from 'next/navigation';
import { blogPosts } from '@/config/blog';
import { listBlogPosts } from '@/lib/content/blogPosts';
import { createOgImage } from '@/lib/og/createOgImage';
import { OgHeadline } from '@/lib/og/OgHeadline';
import { OgLayout } from '@/lib/og/OgLayout';
import { OgMono } from '@/lib/og/OgMono';
import { ogPalette } from '@/lib/og/palette';
import { headlineSize, postMetaLine, truncateAtWord } from '@/lib/og/text';

/**
 * A post's share card, rendered at build time.
 *
 * A plain route rather than an `opengraph-image` file: that convention gives
 * every post the same alt text, and its per-post alternative
 * (`generateImageMetadata`) cannot be prerendered under a dynamic segment.
 * The post's metadata links this card with the post's title as its alt text
 * (`lib/og/postCard.ts`).
 */
export const dynamic = 'force-static';

/** Only the posts generated at build time have a card; anything else is a 404. */
export const dynamicParams = false;

/** Longest title the card sets in full; three lines at the smallest headline size. */
const TITLE_MAX = 84;
const TAGS_SHOWN = 3;

export function generateStaticParams() {
    return blogPosts.map(post => ({ slug: post.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
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
