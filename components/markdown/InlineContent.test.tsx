/**
 * Tests for InlineContent component.
 * Tests rendering of parsed inline segments into JSX.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InlineContent } from './InlineContent';
import { type InlineSegment } from './markdownProcessor';

describe('InlineContent Component', () => {
    it('should render plain text segments', () => {
        const segments: InlineSegment[] = [
            { text: 'Plain text without formatting' },
        ];

        render(<InlineContent segments={segments} />);

        expect(screen.getByText('Plain text without formatting')).toBeInTheDocument();
    });

    it('should render bold text with proper styling', () => {
        const segments: InlineSegment[] = [
            { text: 'This is ' },
            { text: 'bold', isBold: true },
            { text: ' text' },
        ];

        render(<InlineContent segments={segments} />);

        const boldElement = screen.getByText('bold');
        expect(boldElement).toBeInTheDocument();
        expect(boldElement.tagName).toBe('STRONG');
        expect(boldElement).toHaveClass('font-semibold', 'text-primary');
    });

    it('should render italic text with proper styling', () => {
        const segments: InlineSegment[] = [
            { text: 'This is ' },
            { text: 'italic', isItalic: true },
            { text: ' text' },
        ];

        render(<InlineContent segments={segments} />);

        const italicElement = screen.getByText('italic');
        expect(italicElement).toBeInTheDocument();
        expect(italicElement.tagName).toBe('EM');
        expect(italicElement).toHaveClass('italic');
    });

    it('should render links with proper attributes', () => {
        const segments: InlineSegment[] = [
            { text: 'Check ' },
            { text: 'this link', isLink: true, href: 'https://example.com' },
            { text: ' out' },
        ];

        render(<InlineContent segments={segments} />);

        const linkElement = screen.getByText('this link');
        expect(linkElement).toBeInTheDocument();
        expect(linkElement.tagName).toBe('A');
        expect(linkElement).toHaveAttribute('href', 'https://example.com');
        expect(linkElement).toHaveAttribute('target', '_blank');
        expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer');
        expect(linkElement).toHaveClass('text-action', 'hover:text-action/90', 'underline', 'transition-colors');
    });

    it('should render mixed formatting correctly', () => {
        const segments: InlineSegment[] = [
            { text: 'Bold', isBold: true },
            { text: ' and ' },
            { text: 'italic', isItalic: true },
            { text: ' plus ' },
            { text: 'link', isLink: true, href: 'https://example.com' },
        ];

        render(<InlineContent segments={segments} />);

        expect(screen.getByText('Bold')).toHaveClass('font-semibold');
        expect(screen.getByText('italic')).toHaveClass('italic');
        expect(screen.getByText('link')).toHaveAttribute('href', 'https://example.com');

        // Check that the full content is rendered by checking the parent container
        const container = screen.getByText('Bold').closest('span')?.parentElement;
        expect(container?.textContent).toContain('Bold and italic plus link');
    });

    it('should handle consecutive formatting', () => {
        const segments: InlineSegment[] = [
            { text: 'Bold', isBold: true },
            { text: 'italic', isItalic: true },
        ];

        render(<InlineContent segments={segments} />);

        expect(screen.getByText('Bold')).toHaveClass('font-semibold');
        expect(screen.getByText('italic')).toHaveClass('italic');
    });

    it('should handle multiple links', () => {
        const segments: InlineSegment[] = [
            { text: 'Visit ' },
            { text: 'Google', isLink: true, href: 'https://google.com' },
            { text: ' or ' },
            { text: 'GitHub', isLink: true, href: 'https://github.com' },
        ];

        render(<InlineContent segments={segments} />);

        const googleLink = screen.getByText('Google');
        const githubLink = screen.getByText('GitHub');

        expect(googleLink).toHaveAttribute('href', 'https://google.com');
        expect(githubLink).toHaveAttribute('href', 'https://github.com');
    });

    it('should handle custom className prop', () => {
        const segments: InlineSegment[] = [
            { text: 'Test content' },
        ];

        render(<InlineContent segments={segments} className="custom-class" />);

        const container = screen.getByText('Test content').parentElement;
        expect(container).toHaveClass('custom-class');
    });

    it('should apply default className when none provided', () => {
        const segments: InlineSegment[] = [
            { text: 'Test content' },
        ];

        render(<InlineContent segments={segments} />);

        const container = screen.getByText('Test content').parentElement;
        expect(container?.tagName).toBe('SPAN');
    });

    it('should handle empty segments array', () => {
        const segments: InlineSegment[] = [];

        render(<InlineContent segments={segments} />);

        const span = document.querySelector('span');
        expect(span).toBeInTheDocument();
        expect(span?.textContent).toBe('');
    });

    it('should handle links without href gracefully', () => {
        const segments: InlineSegment[] = [
            { text: 'invalid link', isLink: true },
        ];

        render(<InlineContent segments={segments} />);

        // Should render as plain text when href is missing
        expect(screen.getByText('invalid link')).toBeInTheDocument();
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('should handle special characters in segments', () => {
        const segments: InlineSegment[] = [
            { text: 'Text with & special < characters >' },
        ];

        render(<InlineContent segments={segments} />);

        expect(screen.getByText('Text with & special < characters >')).toBeInTheDocument();
    });
});
