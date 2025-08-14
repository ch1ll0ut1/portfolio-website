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
});
