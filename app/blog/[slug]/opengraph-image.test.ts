/**
 * Tests for the description of a post's share card: its alt text is the
 * post's title, and the URL it is served at matches the one structured data
 * links.
 */

import { describe, expect, it } from 'vitest';
import { blogPosts } from '@/config/blog';
import { ogContentType, ogImageSize } from '@/lib/og/createOgImage';
import { POST_CARD_ID, postCardPath } from '@/lib/og/postCard';
import { itemAt } from '@/test/itemAt';
import { generateImageMetadata } from './opengraph-image';

describe('/blog/[slug]/opengraph-image', () => {
    it('should describe one card per post, with the post title as its alt text', () => {
        // Arrange
        const post = itemAt(blogPosts, 0);

        // Act
        const images = generateImageMetadata({ params: { slug: post.slug } });

        // Assert
        expect(images).toEqual([{ id: POST_CARD_ID, alt: post.title, size: ogImageSize, contentType: ogContentType }]);
        expect(postCardPath(post.slug)).toBe(`/blog/${post.slug}/opengraph-image/${POST_CARD_ID}`);
    });

    it('should describe no card for a slug with no post', () => {
        expect(generateImageMetadata({ params: { slug: 'no-such-post' } })).toEqual([]);
    });
});
