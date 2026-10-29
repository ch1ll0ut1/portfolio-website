/**
 * Tests for a post's share card: which cards are built, and how a post's
 * metadata describes its card.
 */

import { describe, expect, it } from 'vitest';
import { blogPosts } from '@/config/blog';
import { postCardImage, postCardPath } from '@/lib/og/postCard';
import { itemAt } from '@/test/itemAt';
import { dynamicParams, generateStaticParams } from './route';

describe('/blog/[slug]/card.png', () => {
    it('should build a card for every post and nothing else', () => {
        expect(generateStaticParams()).toEqual(blogPosts.map(post => ({ slug: post.slug })));
        expect(dynamicParams).toBe(false);
    });

    it('should be described by the post title, at the share-card size', () => {
        // Arrange
        const post = itemAt(blogPosts, 0);

        // Act
        const image = postCardImage(post);

        // Assert
        expect(image).toEqual({
            url: `/blog/${post.slug}/card.png`,
            width: 1200,
            height: 630,
            type: 'image/png',
            alt: post.title,
        });
        expect(postCardPath(post.slug)).toBe(image.url);
    });
});
