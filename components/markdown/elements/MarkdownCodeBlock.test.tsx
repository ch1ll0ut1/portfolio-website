/**
 * Tests for MarkdownCodeBlock component.
 * Tests syntax highlighter integration and props.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarkdownCodeBlock } from './MarkdownCodeBlock';
import { type CodeBlockElement } from '../parser/types';

describe('MarkdownCodeBlock Component', () => {
    it('should render code block with syntax highlighter', () => {
        const element: CodeBlockElement = {
            type: 'codeBlock',
            language: 'javascript',
            content: 'const test = "hello";',
        };

        render(<MarkdownCodeBlock element={element} />);

        const codeBlock = screen.getByTestId('syntax-highlighter');
        expect(codeBlock).toBeInTheDocument();
        expect(codeBlock).toHaveAttribute('data-language', 'javascript');
    });

    it('should handle different programming languages', () => {
        const languages = ['typescript', 'python', 'java', 'rust', 'go'];

        languages.forEach((language) => {
            const element: CodeBlockElement = {
                type: 'codeBlock',
                language,
                content: 'sample code',
            };

            const { unmount } = render(<MarkdownCodeBlock element={element} />);

            const codeBlock = screen.getByTestId('syntax-highlighter');
            expect(codeBlock).toHaveAttribute('data-language', language);

            unmount();
        });
    });

    it('should render multi-line code correctly', () => {
        const element: CodeBlockElement = {
            type: 'codeBlock',
            language: 'javascript',
            content: 'function test() {\n    return "hello";\n}',
        };

        render(<MarkdownCodeBlock element={element} />);

        const codeBlock = screen.getByTestId('syntax-highlighter');
        expect(codeBlock).toBeInTheDocument();
        // Content is rendered by SyntaxHighlighter, so we check for its presence
        expect(codeBlock.textContent).toContain('function test()');
        expect(codeBlock.textContent).toContain('return "hello"');
    });

    it('should handle empty code content', () => {
        const element: CodeBlockElement = {
            type: 'codeBlock',
            language: 'javascript',
            content: '',
        };

        render(<MarkdownCodeBlock element={element} />);

        const codeBlock = screen.getByTestId('syntax-highlighter');
        expect(codeBlock).toBeInTheDocument();
    });

    it('should trim whitespace from content', () => {
        const element: CodeBlockElement = {
            type: 'codeBlock',
            language: 'javascript',
            content: '  \n  const test = "hello";  \n  ',
        };

        render(<MarkdownCodeBlock element={element} />);

        const codeBlock = screen.getByTestId('syntax-highlighter');
        expect(codeBlock).toBeInTheDocument();
        // Content should be trimmed by the component
    });

    it('should handle special characters in code', () => {
        const element: CodeBlockElement = {
            type: 'codeBlock',
            language: 'javascript',
            content: 'const special = "<>&\\"\'";',
        };

        render(<MarkdownCodeBlock element={element} />);

        const codeBlock = screen.getByTestId('syntax-highlighter');
        expect(codeBlock).toBeInTheDocument();
        expect(codeBlock.textContent).toContain('special');
    });

    it('should label the block with its language and keep it keyboard reachable', () => {
        const element: CodeBlockElement = {
            type: 'codeBlock',
            language: 'javascript',
            content: 'const test = "hello";',
        };

        render(<MarkdownCodeBlock element={element} />);

        const block = screen.getByTestId('syntax-highlighter');

        // The block scrolls horizontally instead of widening the page.
        expect(block).toHaveAttribute('tabindex', '0');
        expect(block.parentElement).toHaveTextContent('javascript');
    });

    it('should handle unknown language gracefully', () => {
        const element: CodeBlockElement = {
            type: 'codeBlock',
            language: 'unknown-language',
            content: 'some code',
        };

        render(<MarkdownCodeBlock element={element} />);

        const codeBlock = screen.getByTestId('syntax-highlighter');
        expect(codeBlock).toBeInTheDocument();
        expect(codeBlock).toHaveAttribute('data-language', 'unknown-language');
    });

    it.each([
        ['javascript', 'const answer = 42;', 'keyword'],
        ['python', 'def answer():\n    return 42', 'keyword'],
        ['bash', 'echo "hi"', 'string'],
    ])('should highlight %s with token classes rather than inline styles', (language, content, tokenClass) => {
        const element: CodeBlockElement = { type: 'codeBlock', language, content };

        render(<MarkdownCodeBlock element={element} />);

        const codeBlock = screen.getByTestId('syntax-highlighter');

        // The theme stylesheet colours tokens by class, in both themes.
        expect(codeBlock.querySelector(`.token.${tokenClass}`)).not.toBeNull();
        expect(codeBlock.querySelector('.token[style]')).toBeNull();
        expect(codeBlock.querySelector('.linenumber[style]')).toBeNull();
    });

    it('should handle very long code content', () => {
        const longCode = 'const veryLongVariableName = '.repeat(100) + '"end";';
        const element: CodeBlockElement = {
            type: 'codeBlock',
            language: 'javascript',
            content: longCode,
        };

        render(<MarkdownCodeBlock element={element} />);

        const codeBlock = screen.getByTestId('syntax-highlighter');
        expect(codeBlock).toBeInTheDocument();
    });
});
