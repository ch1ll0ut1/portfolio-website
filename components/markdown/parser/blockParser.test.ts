/**
 * Tests for the block parser: how each line is recognised as a block, and
 * the blocks it parses itself (headings, paragraphs, code, quotes, images).
 */

import { describe, it, expect } from 'vitest';
import { parseMarkdown } from './blockParser';

describe('parseMarkdown', () => {
    it('should process headings correctly', () => {
        const content = '# Heading 1\n## Heading 2\n### Heading 3';
        const result = parseMarkdown(content);

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
        const result = parseMarkdown(content);

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
        const result = parseMarkdown(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'codeBlock',
            language: 'typescript',
            content: 'const test = "hello";\nconsole.log(test);',
        });
    });

    it('should process separators correctly', () => {
        const content = 'Before separator\n---\nAfter separator';
        const result = parseMarkdown(content);

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

    it('should still route a fenced block to the code block path', () => {
        const result = parseMarkdown('```js\nconst a = 1;\n```\n\nThen `x` after');

        expect(result[0]).toEqual({
            type: 'codeBlock',
            language: 'js',
            content: 'const a = 1;',
        });
        expect(result[1]).toEqual({
            type: 'paragraph',
            segments: [
                { text: 'Then ' },
                { text: 'x', isCode: true },
                { text: ' after' },
            ],
        });
    });
});

describe('parseMarkdown - Quotes', () => {
    it('should process quotes correctly', () => {
        const content = '> This is a quote\n> with multiple lines';
        const result = parseMarkdown(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'quote',
            segments: [{ text: 'This is a quote with multiple lines' }],
        });
    });

    it('should process quotes with formatting correctly', () => {
        const content = '> This is a **bold** quote with *italic* text';
        const result = parseMarkdown(content);

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
        const result = parseMarkdown(content);

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
        const result = parseMarkdown(content);

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
        const result = parseMarkdown(content);

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
        const result = parseMarkdown(content);

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
        const result = parseMarkdown(content);

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

    it('should process indented quotes correctly', () => {
        const content = '   > "Adding manpower to a late software project makes it later."';
        const result = parseMarkdown(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'quote',
            segments: [{ text: '"Adding manpower to a late software project makes it later."' }],
        });
    });
});

describe('parseMarkdown - Images', () => {
    it('should process images correctly', () => {
        const content = '![Alt text for image](test-image.jpg)';
        const result = parseMarkdown(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'image',
            src: 'test-image.jpg',
            alt: 'Alt text for image',
        });
    });

    it('should process images with empty alt text', () => {
        const content = '![](image-without-alt.png)';
        const result = parseMarkdown(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'image',
            src: 'image-without-alt.png',
            alt: '',
        });
    });

    it('should process images with absolute paths', () => {
        const content = '![Custom image](/custom/path/image.webp)';
        const result = parseMarkdown(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'image',
            src: '/custom/path/image.webp',
            alt: 'Custom image',
        });
    });

    it('should spread the measured size onto the image when a measurer is given', () => {
        const measured: string[] = [];
        const result = parseMarkdown('![A chart](chart.webp)', (src) => {
            measured.push(src);

            return { width: 1024, height: 1536 };
        });

        expect(measured).toEqual(['chart.webp']);
        expect(result).toEqual([{
            type: 'image',
            alt: 'A chart',
            src: 'chart.webp',
            width: 1024,
            height: 1536,
        }]);
    });

    it('should leave the size off when the measurer finds no file', () => {
        expect(parseMarkdown('![Missing](missing.webp)', () => undefined)).toEqual([{
            type: 'image',
            alt: 'Missing',
            src: 'missing.webp',
        }]);
    });
});
