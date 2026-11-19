/**
 * Tests for the table parser.
 */

import { describe, it, expect } from 'vitest';
import { parseMarkdown } from './blockParser';

describe('parseTable', () => {
    it('should process tables correctly', () => {
        const content = '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n| Cell 3   | Cell 4   |';
        const result = parseMarkdown(content);

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
        const result = parseMarkdown(content);

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
