/**
 * Tests for markdownProcessor utilities.
 * Tests markdown parsing and inline formatting functionality.
 */

import { describe, it, expect } from 'vitest';
import { processMarkdownContent, type MarkdownElement } from './markdownProcessor';

describe('processMarkdownContent', () => {
    it('should process headings correctly', () => {
        const content = '# Heading 1\n## Heading 2\n### Heading 3';
        const result = processMarkdownContent(content);

        expect(result).toHaveLength(3);
        expect(result[0]).toEqual({
            type: 'heading',
            level: 1,
            content: 'Heading 1',
        });
        expect(result[1]).toEqual({
            type: 'heading',
            level: 2,
            content: 'Heading 2',
        });
        expect(result[2]).toEqual({
            type: 'heading',
            level: 3,
            content: 'Heading 3',
        });
    });

    it('should detect paragraphs with formatting', () => {
        const content = 'Regular text\n**Bold text**\n*Italic text*\n**Bold** and *italic* mixed\n[Link text](https://example.com)';
        const result = processMarkdownContent(content);

        expect(result).toHaveLength(5);
        expect(result[0]).toEqual({
            type: 'paragraph',
            segments: [{ text: 'Regular text' }],
        });
        expect(result[1]).toEqual({
            type: 'paragraph',
            segments: [{ text: 'Bold text', isBold: true }],
        });
        expect(result[2]).toEqual({
            type: 'paragraph',
            segments: [{ text: 'Italic text', isItalic: true }],
        });
        expect(result[3]).toEqual({
            type: 'paragraph',
            segments: [
                { text: 'Bold', isBold: true },
                { text: ' and ' },
                { text: 'italic', isItalic: true },
                { text: ' mixed' },
            ],
        });
        expect(result[4]).toEqual({
            type: 'paragraph',
            segments: [{ text: 'Link text', isLink: true, href: 'https://example.com' }],
        });
    });

    it('should process code blocks correctly', () => {
        const content = '```typescript\nconst test = "hello";\nconsole.log(test);\n```';
        const result = processMarkdownContent(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'codeBlock',
            language: 'typescript',
            content: 'const test = "hello";\nconsole.log(test);',
        });
    });

    it('should process lists correctly', () => {
        const content = '- Item 1\n- Item 2\n- Item 3';
        const result = processMarkdownContent(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'list',
            items: [
                [{ text: 'Item 1' }],
                [{ text: 'Item 2' }],
                [{ text: 'Item 3' }],
            ],
        });
    });

    it('should process separators correctly', () => {
        const content = 'Before separator\n---\nAfter separator';
        const result = processMarkdownContent(content);

        expect(result).toHaveLength(3);
        expect(result[0]).toEqual({
            type: 'paragraph',
            segments: [{ text: 'Before separator' }],
        });
        expect(result[1]).toEqual({
            type: 'separator',
        });
        expect(result[2]).toEqual({
            type: 'paragraph',
            segments: [{ text: 'After separator' }],
        });
    });

    it('should process quotes correctly', () => {
        const content = '> This is a quote\n> with multiple lines';
        const result = processMarkdownContent(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'quote',
            segments: [{ text: 'This is a quote with multiple lines' }],
        });
    });

    it('should process quotes with formatting correctly', () => {
        const content = '> This is a **bold** quote with *italic* text';
        const result = processMarkdownContent(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'quote',
            segments: [
                { text: 'This is a ' },
                { text: 'bold', isBold: true },
                { text: ' quote with ' },
                { text: 'italic', isItalic: true },
                { text: ' text' },
            ],
        });
    });

    it('should process quotes with links correctly', () => {
        const content = '> Check out [this link](https://example.com) for more info';
        const result = processMarkdownContent(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'quote',
            segments: [
                { text: 'Check out ' },
                { text: 'this link', isLink: true, href: 'https://example.com' },
                { text: ' for more info' },
            ],
        });
    });

    it('should process quotes with italic text containing links correctly', () => {
        const content = '> *And if you want to know more, check out [this link](https://example.com) for info.*';
        const result = processMarkdownContent(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'quote',
            segments: [
                { text: 'And if you want to know more, check out ', isItalic: true },
                { text: 'this link', isItalic: true, isLink: true, href: 'https://example.com' },
                { text: ' for info.', isItalic: true },
            ],
        });
    });

    it('should process quotes with bold text containing links correctly', () => {
        const content = '> **Check this out: [awesome link](https://example.com) is here**';
        const result = processMarkdownContent(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'quote',
            segments: [
                { text: 'Check this out: ', isBold: true },
                { text: 'awesome link', isBold: true, isLink: true, href: 'https://example.com' },
                { text: ' is here', isBold: true },
            ],
        });
    });

    it('should process quotes with multiple links in formatted text', () => {
        const content = '> *Visit [Google](https://google.com) or [GitHub](https://github.com) for more.*';
        const result = processMarkdownContent(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'quote',
            segments: [
                { text: 'Visit ', isItalic: true },
                { text: 'Google', isItalic: true, isLink: true, href: 'https://google.com' },
                { text: ' or ', isItalic: true },
                { text: 'GitHub', isItalic: true, isLink: true, href: 'https://github.com' },
                { text: ' for more.', isItalic: true },
            ],
        });
    });

    it('should process quotes with mixed formatting and links', () => {
        const content = '> **Bold text** with *italic [link](https://example.com) here* and more';
        const result = processMarkdownContent(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'quote',
            segments: [
                { text: 'Bold text', isBold: true },
                { text: ' with ' },
                { text: 'italic ', isItalic: true },
                { text: 'link', isItalic: true, isLink: true, href: 'https://example.com' },
                { text: ' here', isItalic: true },
                { text: ' and more' },
            ],
        });
    });

    it('should process tables correctly', () => {
        const content = '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n| Cell 3   | Cell 4   |';
        const result = processMarkdownContent(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'table',
            headers: [
                [{ text: 'Header 1' }],
                [{ text: 'Header 2' }],
            ],
            rows: [
                [
                    [{ text: 'Cell 1' }],
                    [{ text: 'Cell 2' }],
                ],
                [
                    [{ text: 'Cell 3' }],
                    [{ text: 'Cell 4' }],
                ],
            ],
        });
    });

    it('should process tables with formatting correctly', () => {
        const content = '| **Bold** | *Italic* |\n|----------|----------|\n| [Link](https://example.com) | Normal |';
        const result = processMarkdownContent(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'table',
            headers: [
                [{ text: 'Bold', isBold: true }],
                [{ text: 'Italic', isItalic: true }],
            ],
            rows: [
                [
                    [{ text: 'Link', isLink: true, href: 'https://example.com' }],
                    [{ text: 'Normal' }],
                ],
            ],
        });
    });
});

describe('processMarkdownContent - Inline Formatting', () => {
    it('should process paragraph with bold text correctly', () => {
        const content = 'This is **bold** text';
        const result = processMarkdownContent(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'paragraph',
            segments: [
                { text: 'This is ' },
                { text: 'bold', isBold: true },
                { text: ' text' },
            ],
        });
    });

    it('should process paragraph with italic text correctly', () => {
        const content = 'This is *italic* text';
        const result = processMarkdownContent(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'paragraph',
            segments: [
                { text: 'This is ' },
                { text: 'italic', isItalic: true },
                { text: ' text' },
            ],
        });
    });

    it('should process paragraph with mixed formatting', () => {
        const content = '**Bold** and *italic* with [link](https://example.com)';
        const result = processMarkdownContent(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'paragraph',
            segments: [
                { text: 'Bold', isBold: true },
                { text: ' and ' },
                { text: 'italic', isItalic: true },
                { text: ' with ' },
                { text: 'link', isLink: true, href: 'https://example.com' },
            ],
        });
    });

    it('should process list items with formatting', () => {
        const content = '- **Bold** item\n- *Italic* item\n- [Link](https://example.com) item';
        const result = processMarkdownContent(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'list',
            items: [
                [
                    { text: 'Bold', isBold: true },
                    { text: ' item' },
                ],
                [
                    { text: 'Italic', isItalic: true },
                    { text: ' item' },
                ],
                [
                    { text: 'Link', isLink: true, href: 'https://example.com' },
                    { text: ' item' },
                ],
            ],
        });
    });

    it('should process quote with formatting', () => {
        const content = '> This is a **bold** quote with *italic* text';
        const result = processMarkdownContent(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'quote',
            segments: [
                { text: 'This is a ' },
                { text: 'bold', isBold: true },
                { text: ' quote with ' },
                { text: 'italic', isItalic: true },
                { text: ' text' },
            ],
        });
    });

    it('should process table cells with formatting', () => {
        const content = '| **Bold** | *Italic* |\n|----------|----------|\n| [Link](https://example.com) | Plain |';
        const result = processMarkdownContent(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'table',
            headers: [
                [{ text: 'Bold', isBold: true }],
                [{ text: 'Italic', isItalic: true }],
            ],
            rows: [
                [
                    [{ text: 'Link', isLink: true, href: 'https://example.com' }],
                    [{ text: 'Plain' }],
                ],
            ],
        });
    });

    it('should handle consecutive formatting', () => {
        const content = '**Bold***italic*';
        const result = processMarkdownContent(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'paragraph',
            segments: [
                { text: 'Bold', isBold: true },
                { text: 'italic', isItalic: true },
            ],
        });
    });

    it('should handle multiple links', () => {
        const content = 'Visit [Google](https://google.com) or [GitHub](https://github.com)';
        const result = processMarkdownContent(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'paragraph',
            segments: [
                { text: 'Visit ' },
                { text: 'Google', isLink: true, href: 'https://google.com' },
                { text: ' or ' },
                { text: 'GitHub', isLink: true, href: 'https://github.com' },
            ],
        });
    });

    it('should handle formatting at text boundaries', () => {
        const content = '**Start** middle *end*';
        const result = processMarkdownContent(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'paragraph',
            segments: [
                { text: 'Start', isBold: true },
                { text: ' middle ' },
                { text: 'end', isItalic: true },
            ],
        });
    });

    it('should handle plain text without formatting', () => {
        const content = 'Plain text without any formatting';
        const result = processMarkdownContent(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'paragraph',
            segments: [{ text: 'Plain text without any formatting' }],
        });
    });

    it('should process nested formatting in paragraphs correctly', () => {
        const content = '*This is italic with [a link](https://example.com) inside* and **bold with [another link](https://test.com) here**';
        const result = processMarkdownContent(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'paragraph',
            segments: [
                { text: 'This is italic with ', isItalic: true },
                { text: 'a link', isItalic: true, isLink: true, href: 'https://example.com' },
                { text: ' inside', isItalic: true },
                { text: ' and ' },
                { text: 'bold with ', isBold: true },
                { text: 'another link', isBold: true, isLink: true, href: 'https://test.com' },
                { text: ' here', isBold: true },
            ],
        });
    });

    it('should process list items with nested formatting correctly', () => {
        const content = '- *Item with [link](https://example.com) in italic*\n- **Bold item with [link](https://test.com)**';
        const result = processMarkdownContent(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'list',
            items: [
                [
                    { text: 'Item with ', isItalic: true },
                    { text: 'link', isItalic: true, isLink: true, href: 'https://example.com' },
                    { text: ' in italic', isItalic: true },
                ],
                [
                    { text: 'Bold item with ', isBold: true },
                    { text: 'link', isBold: true, isLink: true, href: 'https://test.com' },
                ],
            ],
        });
    });

    it('should handle edge case with adjacent formatting', () => {
        const content = '**Bold**[link](https://example.com)*italic*';
        const result = processMarkdownContent(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'paragraph',
            segments: [
                { text: 'Bold', isBold: true },
                { text: 'link', isLink: true, href: 'https://example.com' },
                { text: 'italic', isItalic: true },
            ],
        });
    });
});
