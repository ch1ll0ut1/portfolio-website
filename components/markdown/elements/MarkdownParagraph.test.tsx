/**
 * Tests for MarkdownParagraph component.
 * Tests paragraph rendering and empty content handling.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarkdownParagraph } from './MarkdownParagraph';
import { type ParagraphElement } from '../markdownProcessor';

describe('MarkdownParagraph Component', () => {
    it('should render paragraph with plain text', () => {
        const element: ParagraphElement = {
            type: 'paragraph',
            segments: [{ text: 'This is a plain paragraph' }],
        };

        render(<MarkdownParagraph element={element} />);

        const paragraphElement = document.querySelector('p');
        expect(paragraphElement).toBeInTheDocument();
        expect(paragraphElement?.tagName).toBe('P');
        expect(screen.getByText('This is a plain paragraph')).toBeInTheDocument();
    });

    it('should render paragraph with formatted content', () => {
        const element: ParagraphElement = {
            type: 'paragraph',
            segments: [
                { text: 'Paragraph with ' },
                { text: 'bold', isBold: true },
                { text: ' and ' },
                { text: 'italic', isItalic: true },
                { text: ' text' },
            ],
        };

        render(<MarkdownParagraph element={element} />);

        // Check that formatting is applied
        expect(screen.getByText('bold')).toBeInTheDocument();
        expect(screen.getByText('italic')).toBeInTheDocument();
    });

    it('should render paragraph with links', () => {
        const element: ParagraphElement = {
            type: 'paragraph',
            segments: [
                { text: 'Paragraph with ' },
                { text: 'a link', isLink: true, href: 'https://example.com' },
            ],
        };

        render(<MarkdownParagraph element={element} />);

        const link = screen.getByText('a link');
        expect(link).toBeInTheDocument();
        expect(link.tagName).toBe('A');
        expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('should render empty div for empty content', () => {
        const element: ParagraphElement = {
            type: 'paragraph',
            segments: [{ text: '' }],
        };

        render(<MarkdownParagraph element={element} />);

        const emptyDiv = document.querySelector('div.h-4');
        expect(emptyDiv).toBeInTheDocument();
        expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
    });

    it('should render empty div for whitespace-only content', () => {
        const element: ParagraphElement = {
            type: 'paragraph',
            segments: [{ text: '   \n\t   ' }],
        };

        render(<MarkdownParagraph element={element} />);

        const emptyDiv = document.querySelector('div.h-4');
        expect(emptyDiv).toBeInTheDocument();
    });

    it('should apply correct CSS classes to paragraph', () => {
        const element: ParagraphElement = {
            type: 'paragraph',
            segments: [{ text: 'Test paragraph' }],
        };

        render(<MarkdownParagraph element={element} />);

        const paragraphElement = document.querySelector('p');
        expect(paragraphElement).toHaveClass('text-muted-foreground', 'leading-relaxed', 'mb-4');
        expect(screen.getByText('Test paragraph')).toBeInTheDocument();
    });

    it('should handle special characters', () => {
        const element: ParagraphElement = {
            type: 'paragraph',
            segments: [{ text: 'Paragraph with & special < characters >' }],
        };

        render(<MarkdownParagraph element={element} />);

        expect(screen.getByText('Paragraph with & special < characters >')).toBeInTheDocument();
    });

    it('should handle very long content', () => {
        const longContent = 'This is a very long paragraph that contains a lot of text and should still be rendered correctly without breaking the layout or causing any issues with the styling and text wrapping';
        const element: ParagraphElement = {
            type: 'paragraph',
            segments: [{ text: longContent }],
        };

        render(<MarkdownParagraph element={element} />);

        expect(screen.getByText(longContent)).toBeInTheDocument();
    });

    it('should handle mixed formatting correctly', () => {
        const element: ParagraphElement = {
            type: 'paragraph',
            segments: [
                { text: 'Bold', isBold: true },
                { text: ' text and ' },
                { text: 'link', isLink: true, href: 'https://example.com' },
                { text: ' with ' },
                { text: 'italic', isItalic: true },
            ],
        };

        render(<MarkdownParagraph element={element} />);

        expect(screen.getByText('Bold')).toBeInTheDocument();
        expect(screen.getByText('link')).toBeInTheDocument();
        expect(screen.getByText('italic')).toBeInTheDocument();
    });

    it('should handle formatted vs unformatted content', () => {
        // With formatting
        const elementWithFormatting: ParagraphElement = {
            type: 'paragraph',
            segments: [
                { text: 'Text with ' },
                { text: 'bold', isBold: true },
                { text: ' content' },
            ],
        };

        const { unmount } = render(<MarkdownParagraph element={elementWithFormatting} />);
        expect(screen.getByText('bold')).toBeInTheDocument();
        unmount();

        // Without formatting
        const elementWithoutFormatting: ParagraphElement = {
            type: 'paragraph',
            segments: [{ text: 'Text with **bold** content' }],
        };

        render(<MarkdownParagraph element={elementWithoutFormatting} />);
        expect(screen.getByText('Text with **bold** content')).toBeInTheDocument();
    });

    it('should handle content with line breaks', () => {
        const element: ParagraphElement = {
            type: 'paragraph',
            segments: [{ text: 'First line\nSecond line' }],
        };

        render(<MarkdownParagraph element={element} />);

        const paragraph = screen.getByText(/First line/);
        expect(paragraph).toBeInTheDocument();
        expect(paragraph.textContent).toBe('First line\nSecond line');
    });

    it('should handle content that becomes empty after trimming', () => {
        const element: ParagraphElement = {
            type: 'paragraph',
            segments: [{ text: '   ' }],
        };

        render(<MarkdownParagraph element={element} />);

        const emptyDiv = document.querySelector('div.h-4');
        expect(emptyDiv).toBeInTheDocument();
        expect(screen.queryByText('   ')).not.toBeInTheDocument();
    });
});
