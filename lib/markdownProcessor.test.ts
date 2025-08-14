/**
 * Tests for markdownProcessor utilities.
 * Tests markdown parsing and inline formatting functionality.
 */

import { describe, it, expect } from 'vitest';
import { processMarkdownContent, processInlineFormatting, type MarkdownElement } from './markdownProcessor';

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
        const content = 'Regular text\n**Bold text**\n*Italic text*\n**Bold** and *italic* mixed';
        const result = processMarkdownContent(content);

        expect(result).toHaveLength(4);
        expect(result[0]).toEqual({
            type: 'paragraph',
            content: 'Regular text',
            hasFormatting: false,
        });
        expect(result[1]).toEqual({
            type: 'paragraph',
            content: '**Bold text**',
            hasFormatting: true,
        });
        expect(result[2]).toEqual({
            type: 'paragraph',
            content: '*Italic text*',
            hasFormatting: true,
        });
        expect(result[3]).toEqual({
            type: 'paragraph',
            content: '**Bold** and *italic* mixed',
            hasFormatting: true,
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
            items: ['Item 1', 'Item 2', 'Item 3'],
        });
    });

    it('should process separators correctly', () => {
        const content = 'Before separator\n---\nAfter separator';
        const result = processMarkdownContent(content);

        expect(result).toHaveLength(3);
        expect(result[0]).toEqual({
            type: 'paragraph',
            content: 'Before separator',
            hasFormatting: false,
        });
        expect(result[1]).toEqual({
            type: 'separator',
        });
        expect(result[2]).toEqual({
            type: 'paragraph',
            content: 'After separator',
            hasFormatting: false,
        });
    });

    it('should process quotes correctly', () => {
        const content = '> This is a quote\n> with multiple lines';
        const result = processMarkdownContent(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'quote',
            content: 'This is a quote with multiple lines',
            hasFormatting: false,
        });
    });

    it('should process quotes with formatting correctly', () => {
        const content = '> This is a **bold** quote with *italic* text';
        const result = processMarkdownContent(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'quote',
            content: 'This is a **bold** quote with *italic* text',
            hasFormatting: true,
        });
    });
});

describe('processInlineFormatting', () => {
    it('should handle plain text without formatting', () => {
        const result = processInlineFormatting('Plain text without formatting');

        expect(result).toEqual([
            { text: 'Plain text without formatting' },
        ]);
    });

    it('should process bold text correctly', () => {
        const result = processInlineFormatting('This is **bold** text');

        expect(result).toEqual([
            { text: 'This is ' },
            { text: 'bold', isBold: true },
            { text: ' text' },
        ]);
    });

    it('should process italic text correctly', () => {
        const result = processInlineFormatting('This is *italic* text');

        expect(result).toEqual([
            { text: 'This is ' },
            { text: 'italic', isItalic: true },
            { text: ' text' },
        ]);
    });

    it('should process multiple bold sections', () => {
        const result = processInlineFormatting('**First** and **second** bold');

        expect(result).toEqual([
            { text: 'First', isBold: true },
            { text: ' and ' },
            { text: 'second', isBold: true },
            { text: ' bold' },
        ]);
    });

    it('should process mixed bold and italic', () => {
        const result = processInlineFormatting('**Bold** and *italic* mixed');

        expect(result).toEqual([
            { text: 'Bold', isBold: true },
            { text: ' and ' },
            { text: 'italic', isItalic: true },
            { text: ' mixed' },
        ]);
    });

    it('should handle text starting with formatting', () => {
        const result = processInlineFormatting('**Bold** at start');

        expect(result).toEqual([
            { text: 'Bold', isBold: true },
            { text: ' at start' },
        ]);
    });

    it('should handle text ending with formatting', () => {
        const result = processInlineFormatting('Text ending with **bold**');

        expect(result).toEqual([
            { text: 'Text ending with ' },
            { text: 'bold', isBold: true },
        ]);
    });

    it('should handle only formatting', () => {
        const result = processInlineFormatting('**Issue**:');

        expect(result).toEqual([
            { text: 'Issue', isBold: true },
            { text: ':' },
        ]);
    });

    it('should handle consecutive formatting', () => {
        const result = processInlineFormatting('**Bold***italic*');

        expect(result).toEqual([
            { text: 'Bold', isBold: true },
            { text: 'italic', isItalic: true },
        ]);
    });
});
