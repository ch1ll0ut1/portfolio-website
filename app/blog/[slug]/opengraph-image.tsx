import { notFound } from 'next/navigation';
import { blogPosts } from '@/config/blog';
import { siteConfig } from '@/config/site';
import { createOgImage, ogContentType, ogImageSize } from '@/lib/og/createOgImage';
import { OgHeadline } from '@/lib/og/OgHeadline';
import { OgLayout } from '@/lib/og/OgLayout';
import { OgMono } from '@/lib/og/OgMono';
import { ogPalette } from '@/lib/og/palette';
import { headlineSize, postMetaLine, truncateAtWord } from '@/lib/og/text';

export const alt = `A post from ${siteConfig.name}'s blog`;
export const size = ogImageSize;
export const contentType = ogContentType;

/** Only the posts generated at build time have a card; anything else is a 404. */
export const dynamicParams = false;

/** Longest title the card sets in full; three lines at the smallest headline size. */
const TITLE_MAX = 84;
const TAGS_SHOWN = 3;

export async function generateStaticParams() {
    return blogPosts.map(post => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = blogPosts.find(p => p.slug === slug);

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
