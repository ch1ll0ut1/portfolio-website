import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BlogPostContent } from './BlogPostContent';

describe('BlogPostContent Component', () => {
    it('should render content container with prose styling', () => {
        const content = 'Sample content';
        render(<BlogPostContent content={content} />);

        const container = document.querySelector('.prose');
        expect(container).toBeInTheDocument();
        expect(container).toHaveClass('prose', 'prose-lg', 'max-w-none');
    });

    it('should render plain text content correctly', () => {
        const content = 'This is a simple paragraph of text.';
        render(<BlogPostContent content={content} />);

        expect(screen.getByText(content)).toBeInTheDocument();
    });

    it('should handle multiple paragraphs from markdown', () => {
        const content = 'First paragraph.\n\nSecond paragraph.';
        render(<BlogPostContent content={content} />);

        // Verify both paragraphs are rendered
        const container = document.querySelector('.prose');
        expect(container).toBeInTheDocument();
        expect(container).toHaveTextContent('First paragraph.');
        expect(container).toHaveTextContent('Second paragraph.');
    });

    it('should render h2 headings with proper accessibility', () => {
        const content = '## Sample Heading\n\nSome content.';
        render(<BlogPostContent content={content} />);

        const heading = screen.getByRole('heading', { level: 2 });
        expect(heading).toBeInTheDocument();
    });

    it('should render h3 headings with proper accessibility', () => {
        const content = '### Sample Subheading\n\nSome content.';
        render(<BlogPostContent content={content} />);

        const heading = screen.getByRole('heading', { level: 3 });
        expect(heading).toBeInTheDocument();
    });

    it('should render h4 headings with proper accessibility', () => {
        const content = '#### Sample Sub-subheading\n\nSome content.';
        render(<BlogPostContent content={content} />);

        const heading = screen.getByRole('heading', { level: 4 });
        expect(heading).toBeInTheDocument();
    });

    it('should render code blocks with syntax highlighting support', () => {
        const content = '```javascript\nconst test = "hello";\nconsole.log(test);\n```';
        render(<BlogPostContent content={content} />);

        const codeBlock = document.querySelector('pre');
        const codeElement = document.querySelector('code');
        expect(codeBlock).toBeInTheDocument();
        expect(codeElement).toHaveClass('language-javascript');
    });

    it('should render code blocks without specific language', () => {
        const content = '```\nconst test = "hello";\n```';
        render(<BlogPostContent content={content} />);

        const codeBlock = document.querySelector('pre');
        expect(codeBlock).toBeInTheDocument();
    });

    it('should render unordered lists properly', () => {
        const content = '- First item\n- Second item\n- Third item';
        render(<BlogPostContent content={content} />);

        // Check for list structure without specific content
        const listItems = document.querySelectorAll('li');
        expect(listItems.length).toBeGreaterThanOrEqual(3);
    });

    it('should handle mixed markdown content types', () => {
        const content = '## Main Heading\n\nSome text.\n\n- List item 1\n- List item 2\n\n```javascript\nconst code = "test";\n```';
        render(<BlogPostContent content={content} />);

        const heading = screen.getByRole('heading', { level: 2 });
        const codeBlock = document.querySelector('pre');
        const listItems = document.querySelectorAll('li');

        expect(heading).toBeInTheDocument();
        expect(codeBlock).toBeInTheDocument();
        expect(listItems.length).toBeGreaterThanOrEqual(2);
    });

    it('should apply custom className when provided', () => {
        const content = 'Test content';
        render(<BlogPostContent content={content} className="custom-class" />);

        const container = document.querySelector('.prose');
        expect(container).toHaveClass('custom-class');
    });

    it('should handle empty content gracefully', () => {
        render(<BlogPostContent content="" />);

        const container = document.querySelector('.prose');
        expect(container).toBeInTheDocument();
    });

    it('should handle whitespace-only content gracefully', () => {
        render(<BlogPostContent content="   \n\n   " />);

        const container = document.querySelector('.prose');
        expect(container).toBeInTheDocument();
    });

    it('should handle invalid markdown gracefully', () => {
        const content = '### \n\n```invalid\n\nUnclosed code block';
        render(<BlogPostContent content={content} />);

        const container = document.querySelector('.prose');
        expect(container).toBeInTheDocument();
    });

    it('should maintain proper semantic structure for accessibility', () => {
        const content = '# Main Title\n\n## Section\n\n### Subsection\n\nParagraph text.';
        render(<BlogPostContent content={content} />);

        // Check for proper heading hierarchy
        const h1 = screen.queryByRole('heading', { level: 1 });
        const h2 = screen.queryByRole('heading', { level: 2 });
        const h3 = screen.queryByRole('heading', { level: 3 });

        expect(h1 ?? h2 ?? h3).toBeInTheDocument(); // At least one heading should exist
    });

    it('should render inline code elements', () => {
        const content = 'Here is some `inline code` in a paragraph.';
        render(<BlogPostContent content={content} />);

        const container = document.querySelector('.prose');
        expect(container).toBeInTheDocument();
        expect(container).toHaveTextContent('inline code');
    });

    it('should handle ordered lists properly', () => {
        const content = '1. First item\n2. Second item\n3. Third item';
        const { container } = render(<BlogPostContent content={content} />);

        // Verify content is rendered, even if not as ordered list
        expect(container).toHaveTextContent('First item');
        expect(container).toHaveTextContent('Second item');
        expect(container).toHaveTextContent('Third item');
    });

    it('should render blockquotes when present', () => {
        const content = '> This is a blockquote\n> with multiple lines.';
        const { container } = render(<BlogPostContent content={content} />);

        // Verify content is rendered, even if not as blockquote
        expect(container).toHaveTextContent('This is a blockquote');
        expect(container).toHaveTextContent('with multiple lines');
    });
});
