/**
 * Tests for the inline parser: bold, italic, links and inline code, through
 * the paragraphs that carry them.
 */

import { describe, it, expect } from 'vitest';
import { itemAt } from '@/test/itemAt';
import { parseMarkdown } from './blockParser';

describe('parseInline', () => {
    it('should process paragraph with bold text correctly', () => {
        const content = 'This is **bold** text';
        const result = parseMarkdown(content);

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
        const result = parseMarkdown(content);

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
        const result = parseMarkdown(content);

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

    it('should handle consecutive formatting', () => {
        const content = '**Bold***italic*';
        const result = parseMarkdown(content);

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
        const result = parseMarkdown(content);

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
        const result = parseMarkdown(content);

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
        const result = parseMarkdown(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'paragraph',
            segments: [{ text: 'Plain text without any formatting' }],
        });
    });

    it('should process nested formatting in paragraphs correctly', () => {
        const content = '*This is italic with [a link](https://example.com) inside* and **bold with [another link](https://test.com) here**';
        const result = parseMarkdown(content);

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

    it('should handle edge case with adjacent formatting', () => {
        const content = '**Bold**[link](https://example.com)*italic*';
        const result = parseMarkdown(content);

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

/**
 * Inline code is the newest branch of the inline formatter, and the blog's
 * published posts already depend on it. These tests pin the behaviour the
 * regex actually produces, including the cases where it declines to act.
 */
describe('parseInline - inline code', () => {
    const segmentsOf = (content: string) => {
        const element = itemAt(parseMarkdown(content), 0);

        if (element.type !== 'paragraph') {
            throw new Error(`expected a paragraph, got ${element.type}`);
        }

        return element.segments;
    };

    it('should turn a backtick pair into a code segment without the backticks', () => {
        const segments = segmentsOf('Keep a `CLAUDE.md` file nearby');

        expect(segments).toEqual([
            { text: 'Keep a ' },
            { text: 'CLAUDE.md', isCode: true },
            { text: ' file nearby' },
        ]);
        expect(segments.map(segment => segment.text).join('')).not.toContain('`');
    });

    it('should process several inline code spans in one paragraph', () => {
        expect(segmentsOf('Use `a.md` and `b.md` today')).toEqual([
            { text: 'Use ' },
            { text: 'a.md', isCode: true },
            { text: ' and ' },
            { text: 'b.md', isCode: true },
            { text: ' today' },
        ]);
    });

    it('should process inline code next to bold and italic text', () => {
        expect(segmentsOf('**Bold** and `code` and *italic*')).toEqual([
            { text: 'Bold', isBold: true },
            { text: ' and ' },
            { text: 'code', isCode: true },
            { text: ' and ' },
            { text: 'italic', isItalic: true },
        ]);
    });

    it('should leave formatting markers inside inline code untouched', () => {
        expect(segmentsOf('A `**not bold**` token')).toEqual([
            { text: 'A ' },
            { text: '**not bold**', isCode: true },
            { text: ' token' },
        ]);
        expect(segmentsOf('A `*not italic*` token')).toEqual([
            { text: 'A ' },
            { text: '*not italic*', isCode: true },
            { text: ' token' },
        ]);
        expect(segmentsOf('A `[not a link](http://example.com)` token')).toEqual([
            { text: 'A ' },
            { text: '[not a link](http://example.com)', isCode: true },
            { text: ' token' },
        ]);
    });

    /*
     * Bold and italic win the alternation and hand their contents to the inner
     * pass, which only resolves links. Backticks nested inside them therefore
     * survive as literal text. No published post relies on that combination,
     * so this records the limit rather than endorsing it.
     */
    it('should not process inline code nested inside bold or italic text', () => {
        expect(segmentsOf('**Keep a `CLAUDE.md` file**')).toEqual([
            { text: 'Keep a `CLAUDE.md` file', isBold: true },
        ]);
        expect(segmentsOf('*Keep a `CLAUDE.md` file*')).toEqual([
            { text: 'Keep a `CLAUDE.md` file', isItalic: true },
        ]);
    });

    it('should render an unmatched backtick literally instead of swallowing the paragraph', () => {
        expect(segmentsOf('An orphan ` backtick stays put')).toEqual([
            { text: 'An orphan ` backtick stays put' },
        ]);
    });

    it('should stop at the last matched pair when the backtick count is odd', () => {
        expect(segmentsOf('a `b` c ` d')).toEqual([
            { text: 'a ' },
            { text: 'b', isCode: true },
            { text: ' c ` d' },
        ]);
    });

    it('should leave an empty backtick pair alone', () => {
        expect(segmentsOf('empty `` here')).toEqual([
            { text: 'empty `` here' },
        ]);
    });

    it('should process the inline code published posts actually contain', () => {
        // nodejs-vs-python-framework-magic.md
        expect(segmentsOf('Want an HTTP server? Three lines in `server.js`. Need routing? Add a tiny library.')).toEqual([
            { text: 'Want an HTTP server? Three lines in ' },
            { text: 'server.js', isCode: true },
            { text: '. Need routing? Add a tiny library.' },
        ]);
    });
});
