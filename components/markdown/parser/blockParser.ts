/**
 * Markdown block parsing: the entry point that turns a post's markdown into
 * structured, type-safe elements.
 *
 * A custom processor designed for the blog's content. It walks the lines once,
 * recognising each block by its first line and handing multi-line blocks
 * (code, lists, quotes, tables) to their own parsers, which report where they
 * stopped. Text inside blocks goes through the inline parser.
 *
 * Pure: it reads no files. Image sizes come from the `measureImage` argument,
 * which the server passes in from `lib/content`.
 */

import { parseInline } from './inlineParser';
import { ORDERED_ITEM, UNORDERED_ITEM, parseList } from './listParser';
import { parseTable, startsTable } from './tableParser';
import {
    type BlockResult,
    type CodeBlockElement,
    type MarkdownElement,
    type MeasureImage,
    type QuoteElement,
} from './types';

const QUOTE_LINE = /^\s*>\s/;
const IMAGE_LINE = /^!\[([^\]]*)\]\(([^)]+)\)$/;

/**
 * Processes a raw markdown string into an array of structured elements.
 *
 * Parsing Rules:
 * - Lines starting with # = Headings (1-6 levels)
 * - Lines starting with ``` = Code blocks
 * - Lines matching /^[-*+]\s/ = Unordered lists
 * - Lines matching /^\d+\.\s/ = Ordered lists
 * - Lines matching /^\s*>\s/ = Blockquotes (including indented)
 * - Lines with | and separator row = Tables
 * - Lines with only --- = Horizontal separators
 * - A line that is only `![alt](src)` = Images
 * - All other non-empty lines = Paragraphs
 *
 * @param content Raw markdown string
 * @param measureImage Looks up an image's pixel size; without it images carry none
 * @returns Array of processed MarkdownElement objects
 */
export function parseMarkdown(content: string, measureImage?: MeasureImage): MarkdownElement[] {
    const lines = content.split('\n');
    const elements: MarkdownElement[] = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];
        if (line === undefined) {
            break;
        }
        const nextLine = lines[i + 1] ?? '';
        let block: BlockResult<MarkdownElement> | undefined;

        // Handle headings (1-6 levels)
        const headingMatch = /^(#{1,6})\s+(.+)$/.exec(line);
        const headingHashes = headingMatch?.[1];
        const headingText = headingMatch?.[2];
        if (headingHashes !== undefined && headingText !== undefined) {
            elements.push({
                type: 'heading',
                level: headingLevel(headingHashes.length),
                content: headingText.trim(),
            });
        }
        else if (line.startsWith('```')) {
            block = parseCodeBlock(lines, i);
        }
        else if (UNORDERED_ITEM.test(line)) {
            block = parseList(lines, i, false);
        }
        else if (ORDERED_ITEM.test(line)) {
            block = parseList(lines, i, true);
        }
        else if (QUOTE_LINE.test(line)) {
            block = parseQuote(lines, i);
        }
        else if (startsTable(line, nextLine)) {
            block = parseTable(lines, i);
        }
        else if (line.trim() === '---') {
            elements.push({
                type: 'separator',
            });
        }
        else if (IMAGE_LINE.test(line.trim())) {
            const imageMatch = IMAGE_LINE.exec(line.trim());
            const alt = imageMatch?.[1];
            const src = imageMatch?.[2];
            if (alt !== undefined && src !== undefined) {
                elements.push({
                    type: 'image',
                    alt,
                    src,
                    ...measureImage?.(src),
                });
            }
        }
        else if (line.trim() !== '') {
            elements.push({
                type: 'paragraph',
                segments: parseInline(line.trim()),
            });
        }

        if (block) {
            elements.push(block.element);
            i = block.nextIndex;
        }
        else {
            i++;
        }
    }

    return elements;
}

/** One to six `#`, as the heading level they mark. */
function headingLevel(hashes: number): 1 | 2 | 3 | 4 | 5 | 6 {
    switch (hashes) {
        case 1: return 1;
        case 2: return 2;
        case 3: return 3;
        case 4: return 4;
        case 5: return 5;
        default: return 6;
    }
}

/**
 * Processes a code block starting at the given line index.
 * Returns the code block element and the next line index to process.
 */
function parseCodeBlock(lines: string[], startIndex: number): BlockResult<CodeBlockElement> {
    const startLine = lines[startIndex] ?? '';
    const language = startLine.replace('```', '').trim() || 'javascript';
    const codeLines: string[] = [];

    let i = startIndex + 1;
    while (i < lines.length) {
        const line = lines[i];
        if (line === undefined || line.startsWith('```')) {
            break;
        }
        codeLines.push(line);
        i++;
    }

    return {
        element: {
            type: 'codeBlock',
            language,
            content: codeLines.join('\n'),
        },
        nextIndex: i + 1,
    };
}

/**
 * Processes a quote block starting at the given line index. Consecutive quote
 * lines join into one paragraph; a blank line between them is kept inside it.
 */
function parseQuote(lines: string[], startIndex: number): BlockResult<QuoteElement> {
    const quoteLines: string[] = [];
    let i = startIndex;

    while (i < lines.length) {
        const line = lines[i];
        if (line === undefined) {
            break;
        }

        if (QUOTE_LINE.test(line)) {
            // Remove the leading whitespace, '>' and optional space
            quoteLines.push(line.replace(/^\s*>\s?/, ''));
        }
        else if (line.trim() === '') {
            // Empty line might continue the quote or end it
            if (i + 1 < lines.length && QUOTE_LINE.test(lines[i + 1] ?? '')) {
                quoteLines.push(''); // Add empty line to quote
            }
            else {
                // End of quote
                break;
            }
        }
        else {
            // Non-quote line, end of quote
            break;
        }

        i++;
    }

    return {
        element: {
            type: 'quote',
            segments: parseInline(quoteLines.join(' ').trim()),
        },
        nextIndex: i,
    };
}
