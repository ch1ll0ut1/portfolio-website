/**
 * Tests for MarkdownQuote component.
 * Tests blockquote rendering with formatting.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarkdownQuote } from './MarkdownQuote';
import { type QuoteElement } from '../markdownProcessor';

describe('MarkdownQuote Component', () => {
    it('should render blockquote with plain text', () => {
        const element: QuoteElement = {
            type: 'quote',
            segments: [{ text: 'This is a simple quote' }],
        };

        render(<MarkdownQuote element={element} />);

        const blockquote = document.querySelector('blockquote');
        expect(blockquote).toBeInTheDocument();
        expect(screen.getByText('This is a simple quote')).toBeInTheDocument();
    });

    it('should render blockquote with formatted content', () => {
        const element: QuoteElement = {
            type: 'quote',
            segments: [
                { text: 'Quote with ' },
                { text: 'bold', isBold: true },
                { text: ' and ' },
                { text: 'italic', isItalic: true },
                { text: ' text' },
            ],
        };

        render(<MarkdownQuote element={element} />);

        const blockquote = document.querySelector('blockquote');
        expect(blockquote).toBeInTheDocument();

        // Check that formatting is applied
        expect(screen.getByText('bold')).toBeInTheDocument();
        expect(screen.getByText('italic')).toBeInTheDocument();
    });

    it('should render blockquote with link', () => {
        const element: QuoteElement = {
            type: 'quote',
            segments: [
                { text: 'Quote with ' },
                { text: 'a link', isLink: true, href: 'https://example.com' },
            ],
        };

        render(<MarkdownQuote element={element} />);

        const blockquote = document.querySelector('blockquote');
        expect(blockquote).toBeInTheDocument();

        const link = screen.getByText('a link');
        expect(link).toBeInTheDocument();
        expect(link.tagName).toBe('A');
    });

    it('should apply correct CSS classes to blockquote', () => {
        const element: QuoteElement = {
            type: 'quote',
            segments: [{ text: 'Test quote' }],
        };

        render(<MarkdownQuote element={element} />);

        const blockquote = document.querySelector('blockquote');
        expect(blockquote).toHaveClass('border-l-2', 'border-slate-300', 'pl-6', 'my-6', 'text-slate-600');
    });

    it('should apply correct CSS classes to paragraph', () => {
        const element: QuoteElement = {
            type: 'quote',
            segments: [{ text: 'Test quote' }],
        };

        render(<MarkdownQuote element={element} />);

        const paragraph = document.querySelector('blockquote p');
        expect(paragraph).toHaveClass('italic', 'leading-relaxed', 'text-lg');
    });

    it('should handle empty content', () => {
        const element: QuoteElement = {
            type: 'quote',
            segments: [{ text: '' }],
        };

        render(<MarkdownQuote element={element} />);

        const blockquote = document.querySelector('blockquote');
        expect(blockquote).toBeInTheDocument();
        expect(blockquote?.textContent.trim() ?? '').toBe('');
    });

    it('should handle special characters in content', () => {
        const element: QuoteElement = {
            type: 'quote',
            segments: [{ text: 'Quote with & special < characters >' }],
        };

        render(<MarkdownQuote element={element} />);

        expect(screen.getByText('Quote with & special < characters >')).toBeInTheDocument();
    });

    it('should handle very long quote content', () => {
        const longContent = 'This is a very long quote that contains a lot of text and should still be rendered correctly without breaking the layout or causing any issues with the styling';
        const element: QuoteElement = {
            type: 'quote',
            segments: [{ text: longContent }],
        };

        render(<MarkdownQuote element={element} />);

        expect(screen.getByText(longContent)).toBeInTheDocument();
    });

    it('should handle mixed formatting correctly', () => {
        const element: QuoteElement = {
            type: 'quote',
            segments: [
                { text: 'Bold', isBold: true },
                { text: ' text and ' },
                { text: 'link', isLink: true, href: 'https://example.com' },
                { text: ' with ' },
                { text: 'italic', isItalic: true },
            ],
        };

        render(<MarkdownQuote element={element} />);

        expect(screen.getByText('Bold')).toBeInTheDocument();
        expect(screen.getByText('link')).toBeInTheDocument();
        expect(screen.getByText('italic')).toBeInTheDocument();
    });

    it('should handle formatted vs unformatted content', () => {
        // With formatting
        const elementWithFormatting: QuoteElement = {
            type: 'quote',
            segments: [
                { text: 'Quote with ' },
                { text: 'bold', isBold: true },
                { text: ' text' },
            ],
        };

        const { unmount } = render(<MarkdownQuote element={elementWithFormatting} />);
        expect(screen.getByText('bold')).toBeInTheDocument();
        unmount();

        // Without formatting
        const elementWithoutFormatting: QuoteElement = {
            type: 'quote',
            segments: [{ text: 'Quote with **bold** text' }],
        };

        render(<MarkdownQuote element={elementWithoutFormatting} />);
        expect(screen.getByText('Quote with **bold** text')).toBeInTheDocument();
    });

    it('should handle whitespace-only content', () => {
        const element: QuoteElement = {
            type: 'quote',
            segments: [{ text: '   \n\t   ' }],
        };

        render(<MarkdownQuote element={element} />);

        const blockquote = document.querySelector('blockquote');
        expect(blockquote).toBeInTheDocument();
    });
});
