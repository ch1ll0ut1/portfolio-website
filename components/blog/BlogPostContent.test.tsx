/**
 * Tests for BlogPostContent component.
 * Tests markdown parsing business logic, syntax highlighting, and rendering behavior.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BlogPostContent } from './BlogPostContent';

// Mock react-syntax-highlighter to avoid heavy dependencies in tests
vi.mock('react-syntax-highlighter', () => ({
    Prism: ({ children, language }: { children: string; language: string }) => (
        <code data-testid="syntax-highlighter" data-language={language}>
            {children}
        </code>
    ),
}));

vi.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
    oneDark: {},
}));

describe('BlogPostContent Component', () => {
    describe('Basic Rendering', () => {
        it('should render with prose styling container', () => {
            render(<BlogPostContent content="Test content" />);

            const container = document.querySelector('.prose');
            expect(container).toBeInTheDocument();
            expect(container).toHaveClass('prose', 'prose-lg', 'max-w-none');
        });

        it('should handle custom className prop', () => {
            render(<BlogPostContent content="Test" className="custom-class" />);

            const container = document.querySelector('.prose');
            expect(container).toHaveClass('custom-class');
        });

        it('should handle empty content gracefully', () => {
            render(<BlogPostContent content="" />);

            const container = document.querySelector('.prose');
            expect(container).toBeInTheDocument();
        });
    });

    describe('Heading Parsing Logic', () => {
        it('should parse and render h2 headings correctly', () => {
            const content = '## This is an H2 heading';
            render(<BlogPostContent content={content} />);

            const heading = screen.getByRole('heading', { level: 2 });
            expect(heading).toBeInTheDocument();
            expect(heading).toHaveTextContent('This is an H2 heading');
            expect(heading.tagName).toBe('H2');
        });

        it('should parse and render h3 headings correctly', () => {
            const content = '### This is an H3 heading';
            render(<BlogPostContent content={content} />);

            const heading = screen.getByRole('heading', { level: 3 });
            expect(heading).toBeInTheDocument();
            expect(heading).toHaveTextContent('This is an H3 heading');
            expect(heading.tagName).toBe('H3');
        });

        it('should parse and render h4+ headings correctly', () => {
            const content = '#### This is an H4 heading';
            render(<BlogPostContent content={content} />);

            const heading = screen.getByRole('heading', { level: 4 });
            expect(heading).toBeInTheDocument();
            expect(heading).toHaveTextContent('This is an H4 heading');
            expect(heading.tagName).toBe('H4');
        });

        it('should handle multiple headings of different levels', () => {
            const content = '## Main Section\n### Subsection\n#### Details';
            render(<BlogPostContent content={content} />);

            expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Main Section');
            expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Subsection');
            expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Details');
        });

        it('should parse h1 headings as h4 (fallback behavior)', () => {
            const content = '# This is an H1 heading';
            render(<BlogPostContent content={content} />);

            const heading = screen.getByRole('heading');
            expect(heading.tagName).toBe('H4');
            expect(heading).toHaveTextContent('This is an H1 heading');
        });
    });

    describe('Code Block Parsing Logic', () => {
        it('should parse and render basic code blocks', () => {
            const content = '```javascript\nconst foo = "bar";\nconsole.log(foo);\n```';
            render(<BlogPostContent content={content} />);

            const codeBlock = screen.getByTestId('syntax-highlighter');
            expect(codeBlock).toBeInTheDocument();
            expect(codeBlock).toHaveAttribute('data-language', 'javascript');
            expect(codeBlock).toHaveTextContent('const foo = "bar"; console.log(foo);');
        });

        it('should handle code blocks with different languages', () => {
            const content = '```python\nprint("Hello World")\n```';
            render(<BlogPostContent content={content} />);

            const codeBlock = screen.getByTestId('syntax-highlighter');
            expect(codeBlock).toHaveAttribute('data-language', 'python');
            expect(codeBlock).toHaveTextContent('print("Hello World")');
        });

        it('should default to javascript for code blocks without language', () => {
            const content = '```\nconst test = true;\n```';
            render(<BlogPostContent content={content} />);

            const codeBlock = screen.getByTestId('syntax-highlighter');
            expect(codeBlock).toHaveAttribute('data-language', 'javascript');
        });

        it('should handle multiple code blocks in same content', () => {
            const content = '```javascript\nconst js = true;\n```\n\nSome text\n\n```python\npy = True\n```';
            render(<BlogPostContent content={content} />);

            const codeBlocks = screen.getAllByTestId('syntax-highlighter');
            expect(codeBlocks).toHaveLength(2);
            expect(codeBlocks[0]).toHaveAttribute('data-language', 'javascript');
            expect(codeBlocks[1]).toHaveAttribute('data-language', 'python');
        });

        it('should preserve code formatting and whitespace', () => {
            const content = '```javascript\nfunction test() {\n    return "indented";\n}\n```';
            render(<BlogPostContent content={content} />);

            const codeBlock = screen.getByTestId('syntax-highlighter');
            expect(codeBlock.textContent).toContain('function test() {\n    return "indented";\n}');
        });
    });

    describe('List Parsing Logic', () => {
        it('should parse and render unordered lists with dashes', () => {
            const content = '- First item\n- Second item\n- Third item';
            render(<BlogPostContent content={content} />);

            const list = screen.getByRole('list');
            expect(list).toBeInTheDocument();
            expect(list.tagName).toBe('UL');

            const items = screen.getAllByRole('listitem');
            expect(items).toHaveLength(3);
            expect(items[0]).toHaveTextContent('First item');
            expect(items[1]).toHaveTextContent('Second item');
            expect(items[2]).toHaveTextContent('Third item');
        });

        it('should parse lists with asterisk markers', () => {
            const content = '* Item A\n* Item B';
            render(<BlogPostContent content={content} />);

            const items = screen.getAllByRole('listitem');
            expect(items).toHaveLength(2);
            expect(items[0]).toHaveTextContent('Item A');
            expect(items[1]).toHaveTextContent('Item B');
        });

        it('should parse lists with plus markers', () => {
            const content = '+ Item X\n+ Item Y';
            render(<BlogPostContent content={content} />);

            const items = screen.getAllByRole('listitem');
            expect(items).toHaveLength(2);
            expect(items[0]).toHaveTextContent('Item X');
            expect(items[1]).toHaveTextContent('Item Y');
        });

        it('should handle mixed content with lists', () => {
            const content = 'Some text\n\n- List item 1\n- List item 2\n\nMore text';
            render(<BlogPostContent content={content} />);

            expect(screen.getByText('Some text')).toBeInTheDocument();
            expect(screen.getByText('More text')).toBeInTheDocument();
            expect(screen.getAllByRole('listitem')).toHaveLength(2);
        });
    });

    describe('Text and Paragraph Parsing', () => {
        it('should render regular text as paragraphs', () => {
            const content = 'This is a paragraph of text.';
            render(<BlogPostContent content={content} />);

            expect(screen.getByText('This is a paragraph of text.')).toBeInTheDocument();
        });

        it('should handle multiple paragraphs', () => {
            const content = 'First paragraph.\n\nSecond paragraph.';
            render(<BlogPostContent content={content} />);

            expect(screen.getByText('First paragraph.')).toBeInTheDocument();
            expect(screen.getByText('Second paragraph.')).toBeInTheDocument();
        });

        it('should handle empty lines as spacing', () => {
            const content = 'Text\n\n\nMore text';
            render(<BlogPostContent content={content} />);

            const container = document.querySelector('.prose');
            expect(container).toBeInTheDocument();
            // Should have spacing divs for empty lines
        });
    });

    describe('Complex Mixed Content Parsing', () => {
        it('should handle mixed content types correctly', () => {
            const content = `# Main Title

This is a paragraph.

## Code Example

Here's some code:

\`\`\`javascript
const example = "test";
\`\`\`

### Features List

- Feature 1
- Feature 2
- Feature 3

More text after the list.`;

            render(<BlogPostContent content={content} />);

            // Check all content types are rendered
            expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Main Title'); // h1 → h4
            expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Code Example');
            expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Features List');
            expect(screen.getByText('This is a paragraph.')).toBeInTheDocument();
            expect(screen.getByTestId('syntax-highlighter')).toBeInTheDocument();
            expect(screen.getAllByRole('listitem')).toHaveLength(3);
            expect(screen.getByText('More text after the list.')).toBeInTheDocument();
        });

        it('should maintain proper parsing state across complex transitions', () => {
            const content = `Text before

\`\`\`
code block
\`\`\`

- List item
- Another item

## Heading

More text`;

            render(<BlogPostContent content={content} />);

            expect(screen.getByText('Text before')).toBeInTheDocument();
            expect(screen.getByTestId('syntax-highlighter')).toBeInTheDocument();
            expect(screen.getAllByRole('listitem')).toHaveLength(2);
            expect(screen.getByRole('heading')).toHaveTextContent('Heading');
            expect(screen.getByText('More text')).toBeInTheDocument();
        });
    });

    describe('Edge Cases and Error Handling', () => {
        it('should handle malformed markdown gracefully', () => {
            const content = '###\n```\nunclosed code\n- incomplete';
            render(<BlogPostContent content={content} />);

            const container = document.querySelector('.prose');
            expect(container).toBeInTheDocument();
        });

        it('should handle only whitespace content', () => {
            const content = '   \n  \n   ';
            render(<BlogPostContent content={content} />);

            const container = document.querySelector('.prose');
            expect(container).toBeInTheDocument();
        });

        it('should handle special characters in content', () => {
            const content = 'Text with & < > " \' special chars';
            render(<BlogPostContent content={content} />);

            expect(screen.getByText('Text with & < > " \' special chars')).toBeInTheDocument();
        });
    });

    describe('Link Rendering', () => {
        it('should render links in paragraphs as clickable elements', () => {
            const content = 'Check out [Google](https://google.com) for search.';
            render(<BlogPostContent content={content} />);

            const link = screen.getByRole('link', { name: 'Google' });
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute('href', 'https://google.com');
            expect(link).toHaveAttribute('target', '_blank');
            expect(link).toHaveAttribute('rel', 'noopener noreferrer');
            expect(link).toHaveClass('text-action', 'hover:text-action/90', 'underline', 'transition-colors');
        });

        it('should render multiple links in same paragraph', () => {
            const content = 'Visit [Google](https://google.com) or [GitHub](https://github.com) today.';
            render(<BlogPostContent content={content} />);

            const googleLink = screen.getByRole('link', { name: 'Google' });
            const githubLink = screen.getByRole('link', { name: 'GitHub' });

            expect(googleLink).toHaveAttribute('href', 'https://google.com');
            expect(githubLink).toHaveAttribute('href', 'https://github.com');
        });

        it('should render links mixed with bold and italic formatting', () => {
            const content = '**Bold** text and [a link](https://example.com) plus *italic* text.';
            render(<BlogPostContent content={content} />);

            const link = screen.getByRole('link', { name: 'a link' });
            const boldText = screen.getByText('Bold');
            const italicText = screen.getByText('italic');

            expect(link).toHaveAttribute('href', 'https://example.com');
            expect(boldText.tagName).toBe('STRONG');
            expect(italicText.tagName).toBe('EM');
        });

        it('should render links in list items', () => {
            const content = '- Check [Google](https://google.com)\n- Visit [GitHub](https://github.com)';
            render(<BlogPostContent content={content} />);

            const googleLink = screen.getByRole('link', { name: 'Google' });
            const githubLink = screen.getByRole('link', { name: 'GitHub' });

            expect(googleLink).toHaveAttribute('href', 'https://google.com');
            expect(githubLink).toHaveAttribute('href', 'https://github.com');
        });

        it('should render links in quotes', () => {
            const content = '> Check out [this link](https://example.com) for more info';
            render(<BlogPostContent content={content} />);

            const link = screen.getByRole('link', { name: 'this link' });
            expect(link).toHaveAttribute('href', 'https://example.com');
        });

        it('should handle links with special characters in URL', () => {
            const content = 'Visit [search](https://google.com/search?q=test&lang=en) now.';
            render(<BlogPostContent content={content} />);

            const link = screen.getByRole('link', { name: 'search' });
            expect(link).toHaveAttribute('href', 'https://google.com/search?q=test&lang=en');
        });

        it('should handle links with complex text content', () => {
            const content = 'Check [My Awesome Project!!!](https://github.com/user/project) out.';
            render(<BlogPostContent content={content} />);

            const link = screen.getByRole('link', { name: 'My Awesome Project!!!' });
            expect(link).toHaveAttribute('href', 'https://github.com/user/project');
        });
    });
});
