import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarkdownImage } from './MarkdownImage';
import { ImageElement } from '../markdownProcessor';

// Mock Next.js Image component
vi.mock('next/image', () => ({
    default: ({ src, alt, ...props }: any) => (
        <img src={src} alt={alt} {...props} data-testid="next-image" />
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
});
