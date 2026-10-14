/**
 * Tests for the article route's layout: the Suspense boundary that keeps an
 * unknown slug's `notFound()` from failing the server render of the whole
 * document, and its absence around a real post.
 */

import { FC } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/config/blog';
import { itemAt } from '@/test/itemAt';
import PostLayout from './layout';

const params = (slug: string) => Promise.resolve({ slug });

/** Stands in for ./page.tsx on an unknown slug. */
const MissingPost: FC = () => notFound();

describe('/blog/[slug] layout', () => {
    const consoleError = vi.spyOn(console, 'error');

    beforeEach(() => {
        // React logs the error it recovers from on the server.
        consoleError.mockImplementation(() => undefined);
    });

    afterEach(() => {
        consoleError.mockReset();
    });

    it('should render the post-specific 404 on the server when the page calls notFound()', async () => {
        // Arrange
        const layout = await PostLayout({ children: <MissingPost />, params: params('this-article-does-not-exist') });

        // Act
        const html = renderToString(<html lang="en"><body>{layout}</body></html>);

        // Assert
        expect(html).toContain('Post not found');
        expect(html).toContain('All articles');
    });

    it('should leave a real post without a boundary, so its prerendered HTML is unchanged', async () => {
        // Arrange
        const children = <p>article</p>;

        // Act
        const layout = await PostLayout({ children, params: params(itemAt(blogPosts, 0).slug) });

        // Assert
        expect(layout).toBe(children);
    });
});
