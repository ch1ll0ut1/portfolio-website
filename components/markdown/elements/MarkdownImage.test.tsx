import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarkdownImage } from './MarkdownImage';
import { ImageElement } from '../markdownProcessor';

// Mock Next.js Image component
vi.mock('next/image', () => ({
    default: ({ src, alt, priority, ...props }: any) => (
        <img src={src} alt={alt} {...props} data-priority={String(Boolean(priority))} data-testid="next-image" />
    ),
}));

describe('MarkdownImage', () => {
    it('renders image with alt text', () => {
        const element: ImageElement = {
            type: 'image',
            src: 'test-image.jpg',
            alt: 'Test image description',
        };

        render(<MarkdownImage element={element} />);

        const image = screen.getByTestId('next-image');
        expect(image).toHaveAttribute('src', '/images/blog/test-image.jpg');
        expect(image).toHaveAttribute('alt', 'Test image description');

        expect(screen.getByText('Test image description')).toBeInTheDocument();
    });

    it('handles absolute paths correctly', () => {
        const element: ImageElement = {
            type: 'image',
            src: '/custom/path/image.png',
            alt: 'Custom path image',
        };

        render(<MarkdownImage element={element} />);

        const image = screen.getByTestId('next-image');
        expect(image).toHaveAttribute('src', '/custom/path/image.png');
    });

    it('renders without alt text caption when alt is empty', () => {
        const element: ImageElement = {
            type: 'image',
            src: 'no-alt.jpg',
            alt: '',
        };

        render(<MarkdownImage element={element} />);

        const image = screen.getByTestId('next-image');
        expect(image).toBeInTheDocument();

        // Check that no caption paragraph exists
        const caption = screen.queryByRole('paragraph');
        expect(caption).not.toBeInTheDocument();
    });

    it('passes the measured size through so the box matches the image', () => {
        const element: ImageElement = {
            type: 'image',
            src: 'portrait.webp',
            alt: 'Portrait',
            width: 1024,
            height: 1536,
        };

        render(<MarkdownImage element={element} />);

        const image = screen.getByTestId('next-image');
        expect(image).toHaveAttribute('width', '1024');
        expect(image).toHaveAttribute('height', '1536');
    });

    it('marks the image as priority only when asked to', () => {
        const element: ImageElement = { type: 'image', src: 'a.webp', alt: 'A' };

        const { unmount } = render(<MarkdownImage element={element} />);
        expect(screen.getByTestId('next-image')).toHaveAttribute('data-priority', 'false');
        unmount();

        render(<MarkdownImage element={element} priority />);
        expect(screen.getByTestId('next-image')).toHaveAttribute('data-priority', 'true');
    });
});
