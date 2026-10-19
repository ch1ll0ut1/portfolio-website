/**
 * Tests for the Article component.
 * Covers the reading surface: the metadata it publishes, the markdown it
 * renders, the neighbour links, and the decorative progress indicator.
 */

import { describe, it, expect, afterAll, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Article } from './Article';
import { type BlogPost, type ListedPost } from '@/config/blog';
import { formatDate } from '@/lib/date';
import { installMatchMedia } from '@/test/motionEnv';

const content = [
    '## A section heading',
    '',
    'A paragraph of body copy with `inline code` in it.',
    '',
    '```typescript',
    'const answer = 42;',
    '```',
    '',
    '| Column | Other |',
    '| --- | --- |',
    '| Cell | Value |',
].join('\n');

const post: ListedPost & { content: string } = {
    id: '1',
    title: 'Why Good Software Engineering Is Expensive',
    excerpt: 'AI can generate code, but it cannot replace engineering judgment.',
    date: '2026-05-15',
    readTime: '14 min read',
    tags: ['Software Engineering', 'AI'],
    slug: 'why-good-software-engineering-is-expensive',
    published: true,
    content,
};

const older: BlogPost = { ...post, id: '2', title: 'An Older Post', slug: 'an-older-post', content: undefined } as BlogPost;
const newer: BlogPost = { ...post, id: '3', title: 'A Newer Post', slug: 'a-newer-post', content: undefined } as BlogPost;

describe('Article Component', () => {
    // jsdom exposes `matchMedia` as an accessor that yields undefined, which the
    // motion kit calls on mount.
    let restoreMatchMedia: () => void = () => undefined;

    beforeAll(() => {
        restoreMatchMedia = installMatchMedia();
    });

    afterAll(() => {
        restoreMatchMedia();
    });

    it('should render the post title as the page heading', () => {
        // Arrange
        render(<Article post={post} />);

        // Assert
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(post.title);
    });

    it('should publish the post metadata', () => {
        // Arrange
        render(<Article post={post} />);

        // Assert
        expect(screen.getByText(formatDate(post.date))).toBeInTheDocument();
        expect(screen.getByText(post.readTime)).toBeInTheDocument();
        expect(screen.getAllByRole('link', { name: 'Stefan Knoch' })[0]).toHaveAttribute('href', '/');
        expect(screen.getByText(post.excerpt)).toBeInTheDocument();
        post.tags.forEach((tag) => {
            expect(screen.getByText(tag)).toBeInTheDocument();
        });
    });

    it('should mark the date up as machine readable', () => {
        // Arrange
        render(<Article post={post} />);

        // Act
        const time = screen.getByText(formatDate(post.date));

        // Assert
        expect(time.tagName).toBe('TIME');
        expect(time).toHaveAttribute('datetime', post.date);
    });

    it('should say when a post was updated after it was published', () => {
        // Arrange
        render(<Article post={{ ...post, updated: '2026-10-13' }} />);

        // Act
        const updated = screen.getByText(formatDate('2026-10-13'));

        // Assert
        expect(updated.tagName).toBe('TIME');
        expect(updated).toHaveAttribute('datetime', '2026-10-13');
        expect(updated.parentElement).toHaveTextContent(`Updated ${formatDate('2026-10-13')}`);
    });

    it('should not show an update for a post that was never revised', () => {
        // Arrange
        render(<Article post={post} />);

        // Assert
        expect(screen.queryByText(/Updated/)).not.toBeInTheDocument();
    });

    it('should render the markdown content of the post', () => {
        // Arrange
        render(<Article post={post} />);

        // Assert
        expect(screen.getByRole('heading', { level: 2, name: 'A section heading' })).toBeInTheDocument();
        expect(screen.getByTestId('syntax-highlighter')).toHaveAttribute('data-language', 'typescript');
        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(screen.getByText('inline code').tagName).toBe('CODE');
    });

    it('should offer a breadcrumb back to the index', () => {
        // Arrange
        render(<Article post={post} />);

        // Act
        const breadcrumb = screen.getByRole('navigation', { name: 'Breadcrumb' });

        // Assert
        expect(breadcrumb).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Writing' })).toHaveAttribute('href', '/blog');
    });

    it('should link to the neighbouring posts and to all articles', () => {
        // Arrange
        render(<Article post={post} newer={newer} older={older} />);

        // Act
        const pager = screen.getByRole('navigation', { name: 'More articles' });

        // Assert
        expect(pager).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /A Newer Post/ })).toHaveAttribute('href', '/blog/a-newer-post');
        expect(screen.getByRole('link', { name: /An Older Post/ })).toHaveAttribute('href', '/blog/an-older-post');
        expect(screen.getByRole('link', { name: 'All articles' })).toHaveAttribute('href', '/blog');
    });

    it('should close the body with the author card and suggest related posts', () => {
        // Arrange
        const related = { ...post, id: '4', title: 'A Related Post', slug: 'a-related-post' };
        render(<Article post={post} related={[related]} />);

        // Assert
        expect(screen.getByRole('complementary', { name: 'About the author' })).toBeInTheDocument();
        expect(screen.getByRole('region', { name: 'Related posts' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /A Related Post/ })).toHaveAttribute('href', '/blog/a-related-post');
    });

    it('should omit a neighbour link that does not exist', () => {
        // Arrange
        render(<Article post={post} older={older} />);

        // Assert
        expect(screen.queryByText('Newer')).not.toBeInTheDocument();
        expect(screen.getByText('Older')).toBeInTheDocument();
    });

    it('should keep the reading progress indicator out of the accessibility tree', () => {
        // Arrange
        const { container } = render(<Article post={post} />);

        // Act
        const decorations = container.querySelectorAll('[aria-hidden="true"]');

        // Assert
        expect(decorations.length).toBeGreaterThan(0);
        expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    });

    it('should expose the article as the analytics scroll target', () => {
        // Arrange
        const { container } = render(<Article post={post} />);

        // Assert
        const article = container.querySelector('article');
        expect(article).toBeInTheDocument();
        expect(article).toHaveAttribute('id', 'article-body');
    });
});
