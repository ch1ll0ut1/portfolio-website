/**
 * Tests for the list parser: items, continuation lines, blank lines kept
 * inside an item, and quotes nested in items.
 */

import { describe, it, expect } from 'vitest';
import { parseMarkdown } from './blockParser';

describe('parseList', () => {
    it('should process lists correctly', () => {
        const content = '- Item 1\n- Item 2\n- Item 3';
        const result = parseMarkdown(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'list',
            items: [
                [{ segments: [{ text: 'Item 1' }] }],
                [{ segments: [{ text: 'Item 2' }] }],
                [{ segments: [{ text: 'Item 3' }] }],
            ],
            ordered: false,
        });
    });

    it('should process ordered lists correctly', () => {
        const content = '1. First item\n2. Second item\n3. Third item';
        const result = parseMarkdown(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'list',
            items: [
                [{ segments: [{ text: 'First item' }] }],
                [{ segments: [{ text: 'Second item' }] }],
                [{ segments: [{ text: 'Third item' }] }],
            ],
            ordered: true,
        });
    });

    it('should process ordered lists with indented continuation text', () => {
        const content = '1. **Cut scope early**\n   Ruthlessly prioritize the features.\n\n2. **Hire generalists first**\n   A senior engineer will do more.';
        const result = parseMarkdown(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'list',
            items: [
                [
                    { segments: [{ text: 'Cut scope early', isBold: true }] },
                    { segments: [{ text: 'Ruthlessly prioritize the features.' }] },
                ],
                [
                    { segments: [{ text: 'Hire generalists first', isBold: true }] },
                    { segments: [{ text: 'A senior engineer will do more.' }] },
                ],
            ],
            ordered: true,
        });
    });

    it('should process ordered lists with indented quotes', () => {
        const content = '1. **Communication overhead**\n   Every developer adds costs.\n\n   > "Adding manpower to a late software project makes it later."\n\n2. **Next item**';
        const result = parseMarkdown(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'list',
            items: [
                [
                    { segments: [{ text: 'Communication overhead', isBold: true }] },
                    { segments: [{ text: 'Every developer adds costs.' }] },
                    { segments: [{ text: '' }] }, // Empty line
                    { type: 'quote', segments: [{ text: '"Adding manpower to a late software project makes it later."' }] },
                ],
                [
                    { segments: [{ text: 'Next item', isBold: true }] },
                ],
            ],
            ordered: true,
        });
    });

    it('should preserve empty lines within list items', () => {
        const content = '1. **First line**\n\n   Second line after empty\n\n   Third line\n\n2. **Next item**';
        const result = parseMarkdown(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'list',
            items: [
                [
                    { segments: [{ text: 'First line', isBold: true }] },
                    { segments: [{ text: '' }] }, // Empty line
                    { segments: [{ text: 'Second line after empty' }] },
                    { segments: [{ text: '' }] }, // Empty line
                    { segments: [{ text: 'Third line' }] },
                ],
                [
                    { segments: [{ text: 'Next item', isBold: true }] },
                ],
            ],
            ordered: true,
        });
    });

    it('should process list items with formatting', () => {
        const content = '- **Bold** item\n- *Italic* item\n- [Link](https://example.com) item';
        const result = parseMarkdown(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'list',
            items: [
                [{ segments: [
                    { text: 'Bold', isBold: true },
                    { text: ' item' },
                ] }],
                [{ segments: [
                    { text: 'Italic', isItalic: true },
                    { text: ' item' },
                ] }],
                [{ segments: [
                    { text: 'Link', isLink: true, href: 'https://example.com' },
                    { text: ' item' },
                ] }],
            ],
            ordered: false,
        });
    });

    it('should process list items with nested formatting correctly', () => {
        const content = '- *Item with [link](https://example.com) in italic*\n- **Bold item with [link](https://test.com)**';
        const result = parseMarkdown(content);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            type: 'list',
            items: [
                [{ segments: [
                    { text: 'Item with ', isItalic: true },
                    { text: 'link', isItalic: true, isLink: true, href: 'https://example.com' },
                    { text: ' in italic', isItalic: true },
                ] }],
                [{ segments: [
                    { text: 'Bold item with ', isBold: true },
                    { text: 'link', isBold: true, isLink: true, href: 'https://test.com' },
                ] }],
            ],
            ordered: false,
        });
    });

    it('should process the inline code published posts contain inside an ordered list', () => {
        // 10-ai-workflows-every-developer-should-know-2025.md
        const [list] = parseMarkdown('3. Generate a `ARCHITECTURE.md` file with diagrams and folder structure.');

        expect(list).toEqual({
            type: 'list',
            ordered: true,
            items: [[{
                segments: [
                    { text: 'Generate a ' },
                    { text: 'ARCHITECTURE.md', isCode: true },
                    { text: ' file with diagrams and folder structure.' },
                ],
            }]],
        });
    });
});
