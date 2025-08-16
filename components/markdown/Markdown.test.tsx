/**
 * Tests for Markdown component.
 * Tests main component integration and element mapping.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Markdown } from './Markdown';

describe('Markdown Component', () => {
    it('should render headings correctly', () => {
        const content = '# Heading 1\n## Heading 2';

        render(<Markdown content={content} />);

        expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Heading 1');
        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Heading 2');
    });

    it('should render paragraphs correctly', () => {
        const content = 'First paragraph\n\nSecond paragraph';

        render(<Markdown content={content} />);

        expect(screen.getByText('First paragraph')).toBeInTheDocument();
        expect(screen.getByText('Second paragraph')).toBeInTheDocument();
    });

    it('should render code blocks correctly', () => {
        const content = '```javascript\nconst test = "hello";\n```';

        render(<Markdown content={content} />);

        expect(screen.getByTestId('syntax-highlighter')).toBeInTheDocument();
        expect(screen.getByTestId('syntax-highlighter')).toHaveAttribute('data-language', 'javascript');
    });

    it('should render lists correctly', () => {
        const content = '- Item 1\n- Item 2\n- Item 3';

        render(<Markdown content={content} />);

        const list = screen.getByRole('list');
        expect(list).toBeInTheDocument();
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();
        expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('should render quotes correctly', () => {
        const content = '> This is a quote';

        render(<Markdown content={content} />);

        const quote = document.querySelector('blockquote');
        expect(quote).toBeInTheDocument();
        expect(screen.getByText('This is a quote')).toBeInTheDocument();
    });

    it('should render tables correctly', () => {
        const content = '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |';

        render(<Markdown content={content} />);

        const table = screen.getByRole('table');
        expect(table).toBeInTheDocument();
        expect(screen.getByText('Header 1')).toBeInTheDocument();
        expect(screen.getByText('Header 2')).toBeInTheDocument();
        expect(screen.getByText('Cell 1')).toBeInTheDocument();
        expect(screen.getByText('Cell 2')).toBeInTheDocument();
    });

    it('should render separators correctly', () => {
        const content = 'Before\n---\nAfter';

        render(<Markdown content={content} />);

        const separator = document.querySelector('hr');
        expect(separator).toBeInTheDocument();
        expect(screen.getByText('Before')).toBeInTheDocument();
        expect(screen.getByText('After')).toBeInTheDocument();
    });

    it('should render mixed content correctly', () => {
        const content = '# Title\n\nThis is a paragraph.\n\n- List item\n\n```js\ncode\n```';

        render(<Markdown content={content} />);

        expect(screen.getByRole('heading')).toHaveTextContent('Title');
        expect(screen.getByText('This is a paragraph.')).toBeInTheDocument();
        expect(screen.getByText('List item')).toBeInTheDocument();
        expect(screen.getByTestId('syntax-highlighter')).toBeInTheDocument();
    });

    it('should handle custom className prop', () => {
        const content = 'Test content';

        render(<Markdown content={content} className="custom-class" />);

        const container = screen.getByText('Test content').closest('.prose');
        expect(container).toHaveClass('custom-class');
    });

    it('should apply default prose classes', () => {
        const content = 'Test content';

        render(<Markdown content={content} />);

        const container = screen.getByText('Test content').closest('.prose');
        expect(container).toHaveClass('prose', 'prose-lg', 'max-w-none');
    });

    it('should handle empty content', () => {
        render(<Markdown content="" />);

        const container = document.querySelector('.prose');
        expect(container).toBeInTheDocument();
        expect(container?.children.length).toBe(0);
    });

    it('should handle content with only whitespace', () => {
        render(<Markdown content="   \n\n   " />);

        const container = document.querySelector('.prose');
        expect(container).toBeInTheDocument();
        // Should not render any meaningful content
    });

    it('should render elements in correct order', () => {
        const content = '# First\n\nParagraph\n\n## Second';

        render(<Markdown content={content} />);

        const container = document.querySelector('.prose');
        const elements = container?.children;

        expect(elements?.[0]).toHaveTextContent('First');
        expect(elements?.[1]).toHaveTextContent('Paragraph');
        expect(elements?.[2]).toHaveTextContent('Second');
    });
});
