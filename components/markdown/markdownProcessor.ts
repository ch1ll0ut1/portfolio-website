/**
 * Advanced Markdown Processing Engine
 *
 * A custom, feature-rich markdown processor designed specifically for blog content.
 * Supports complex structures including:
 * - Nested content within list items
 * - Indented blockquotes
 * - Mixed block types (quotes, paragraphs, empty lines)
 * - Inline formatting (bold, italic, links)
 * - Tables with formatting
 * - Code blocks with syntax highlighting
 *
 * Architecture:
 * - Block-level parsing: Processes markdown into structured elements
 * - Inline formatting: Handles bold, italic, and links within text
 * - Hierarchical structure: Lists contain blocks, blocks contain inline segments
 *
 * Key Features:
 * - Smart list processing with continuation text detection
 * - Indented blockquote support within lists
 * - Empty line preservation for proper spacing
 * - Type-safe element structure with comprehensive interfaces
 */

import fs from 'fs';
import path from 'path';

/**
 * Union type representing all possible markdown block elements
 * Each element type corresponds to a major markdown structure
 */
export type MarkdownElement = HeadingElement | ParagraphElement | CodeBlockElement | ListElement | QuoteElement | SeparatorElement | TableElement | ImageElement;

export interface HeadingElement {
    type: 'heading';
    level: 1 | 2 | 3 | 4 | 5 | 6;
    content: string;
}

export interface ParagraphElement {
    type: 'paragraph';
    segments: InlineSegment[];
}

export interface CodeBlockElement {
    type: 'codeBlock';
    language: string;
    content: string;
}

/**
 * Represents a markdown list (ordered or unordered)
 *
 * Structure:
 * - items: Array of list items, where each item is an array of BlockSegments
 * - Each BlockSegment can be a paragraph, quote, or empty line
 * - Supports complex nested content within list items
 *
 * Example:
 * ```
 * 1. **Main point**
 *    Additional explanation
 *
 *    > "Quote within list item"
 * ```
 */
export interface ListElement {
    type: 'list';
    items: BlockSegment[][];
    ordered?: boolean;
}

/**
 * Represents a block of content within a list item
 *
 * Types:
 * - 'quote': Blockquote content (renders with border and italic styling)
 * - undefined: Regular paragraph content
 *
 * Each block contains an array of InlineSegments for formatted text
 */
export interface BlockSegment {
    type?: 'quote' | 'paragraph';
    segments: InlineSegment[];
}

export interface QuoteElement {
    type: 'quote';
    segments: InlineSegment[];
}

export interface SeparatorElement {
    type: 'separator';
}

export interface TableElement {
    type: 'table';
    headers: InlineSegment[][];
    rows: InlineSegment[][][];
}

export interface ImageElement {
    type: 'image';
    src: string;
    alt: string;
}

/**
 * Reads a markdown file from the content directory.
 * Returns the raw content as a string.
 */
export function readMarkdownFile(fileName: string): string | null {
    try {
        const contentPath = path.join(process.cwd(), 'content', 'blog', `${fileName}.md`);

        if (!fs.existsSync(contentPath)) {
            return null;
        }

        const content = fs.readFileSync(contentPath, 'utf8');

        return content.trim();
    }
    catch (error) {
        throw new Error(`Error reading markdown file ${fileName}: ${String(error)}`);
    }
}

/**
 * Main entry point for markdown processing
 *
 * Processes a raw markdown string into an array of structured, type-safe elements.
 * Uses a multi-pass parsing strategy:
 *
 * 1. **Block Detection**: Identifies major markdown structures (headings, lists, quotes, etc.)
 * 2. **Content Processing**: Processes continuation text, indented content, and nested structures
 * 3. **Inline Formatting**: Handles bold, italic, and links within text content
 *
 * Parsing Rules:
 * - Lines starting with # = Headings (1-6 levels)
 * - Lines starting with ``` = Code blocks
 * - Lines matching /^[-*+]\s/ = Unordered lists
 * - Lines matching /^\d+\.\s/ = Ordered lists
 * - Lines matching /^\s*>\s/ = Blockquotes (including indented)
 * - Lines with | and separator row = Tables
 * - Lines with only --- = Horizontal separators
 * - All other non-empty lines = Paragraphs
 *
 * @param content Raw markdown string
 * @returns Array of processed MarkdownElement objects
 */
export function processMarkdownContent(content: string): MarkdownElement[] {
    const lines = content.split('\n');
    const elements: MarkdownElement[] = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        // Handle headings (1-6 levels)
        const headingMatch = /^(#{1,6})\s+(.+)$/.exec(line);
        if (headingMatch) {
            elements.push({
                type: 'heading',
                level: headingMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6,
                content: headingMatch[2].trim(),
            });
        }
        else if (line.startsWith('```')) {
            const codeBlock = processCodeBlock(lines, i);
            elements.push(codeBlock.element);
            i = codeBlock.nextIndex - 1; // -1 because loop will increment
        }
        else if (/^[-*+]\s+(.+)$/.test(line)) {
            const listResult = processListBlock(lines, i, false);
            elements.push(listResult.element);
            i = listResult.nextIndex - 1; // -1 because loop will increment
        }
        else if (/^\d+\.\s+(.+)$/.test(line)) {
            const listResult = processListBlock(lines, i, true);
            elements.push(listResult.element);
            i = listResult.nextIndex - 1; // -1 because loop will increment
        }
        else if (/^\s*>\s/.test(line)) {
            const quoteResult = processQuoteBlock(lines, i);
            elements.push(quoteResult.element);
            i = quoteResult.nextIndex - 1; // -1 because loop will increment
        }
        else if (line.includes('|') && i + 1 < lines.length && lines[i + 1].includes('|') && /^[\s|:-]+$/.test(lines[i + 1])) {
            const tableResult = processTableBlock(lines, i);
            elements.push(tableResult.element);
            i = tableResult.nextIndex - 1; // -1 because loop will increment
        }
        else if (line.trim() === '---') {
            elements.push({
                type: 'separator',
            });
        }
        else if (/^!\[([^\]]*)\]\(([^)]+)\)$/.test(line.trim())) {
            // Handle image syntax: ![alt text](image_path)
            const imageMatch = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(line.trim());
            if (imageMatch) {
                elements.push({
                    type: 'image',
                    alt: imageMatch[1],
                    src: imageMatch[2],
                });
            }
        }
        else if (line.trim() !== '') {
            elements.push({
                type: 'paragraph',
                segments: processInlineFormatting(line.trim()),
            });
        }

        i++;
    }

    return elements;
}

/**
 * Processes inline formatting (bold, italic) in text content.
 * Returns an array of text segments with formatting information.
 */
export interface InlineSegment {
    text: string;
    isBold?: boolean;
    isItalic?: boolean;
    isLink?: boolean;
    href?: string;
}

function processInlineFormatting(content: string): InlineSegment[] {
    const segments: InlineSegment[] = [];
    let currentIndex = 0;

    // First pass: find all links and process them
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const links: { start: number; end: number; text: string; href: string }[] = [];
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
        links.push({
            start: match.index,
            end: match.index + match[0].length,
            text: match[1],
            href: match[2],
        });
    }

    // Second pass: process all formatting including links
    const formatRegex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*(.+?)\*\*|\*(.+?)\*)/g;

    while ((match = formatRegex.exec(content)) !== null) {
        // Add text before the match as plain text
        if (match.index > currentIndex) {
            const plainText = content.substring(currentIndex, match.index);
            if (plainText) {
                segments.push({ text: plainText });
            }
        }

        // Check if this is a link
        if (match[2] && match[3]) {
            // Link [text](url)
            segments.push({
                text: match[2],
                isLink: true,
                href: match[3],
            });
        }
        else if (match[4]) {
            // Bold text (**text**)
            // Check if there are any links inside the bold text
            const boldContent = match[4];
            const innerSegments = processInnerFormatting(boldContent, links, match.index + 2);
            segments.push(...innerSegments.map(seg => ({ ...seg, isBold: true })));
        }
        else if (match[5]) {
            // Italic text (*text*)
            // Check if there are any links inside the italic text
            const italicContent = match[5];
            const innerSegments = processInnerFormatting(italicContent, links, match.index + 1);
            segments.push(...innerSegments.map(seg => ({ ...seg, isItalic: true })));
        }

        currentIndex = match.index + match[0].length;
    }

    // Add remaining text as plain text
    if (currentIndex < content.length) {
        const remainingText = content.substring(currentIndex);
        if (remainingText) {
            segments.push({ text: remainingText });
        }
    }

    // If no formatting found, return the whole content as plain text
    if (segments.length === 0) {
        segments.push({ text: content });
    }

    return segments;
}

/**
 * Process formatting inside bold or italic text, checking for nested links
 */
function processInnerFormatting(
    content: string,
    links: { start: number; end: number; text: string; href: string }[],
    contentOffset: number,
): InlineSegment[] {
    const segments: InlineSegment[] = [];
    let currentIndex = 0;

    // Find links that fall within this content
    const innerLinks = links.filter(link =>
        link.start >= contentOffset
        && link.end <= contentOffset + content.length,
    );

    if (innerLinks.length === 0) {
        // No links inside, return plain text
        return [{ text: content }];
    }

    // Process content with links
    for (const link of innerLinks) {
        const linkStartInContent = link.start - contentOffset;
        const linkEndInContent = link.end - contentOffset;

        // Add text before link
        if (linkStartInContent > currentIndex) {
            const plainText = content.substring(currentIndex, linkStartInContent);
            if (plainText) {
                segments.push({ text: plainText });
            }
        }

        // Add link
        segments.push({
            text: link.text,
            isLink: true,
            href: link.href,
        });

        currentIndex = linkEndInContent;
    }

    // Add remaining text
    if (currentIndex < content.length) {
        const remainingText = content.substring(currentIndex);
        if (remainingText) {
            segments.push({ text: remainingText });
        }
    }

    return segments;
}

/**
 * Processes a code block starting at the given line index.
 * Returns the code block element and the next line index to process.
 */
function processCodeBlock(lines: string[], startIndex: number): { element: CodeBlockElement; nextIndex: number } {
    const startLine = lines[startIndex];
    const language = startLine.replace('```', '').trim() || 'javascript';
    const codeLines: string[] = [];

    let i = startIndex + 1;
    while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
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
 * Advanced list processing with smart continuation detection
 *
 * Handles complex list structures including:
 * - Multi-line list items with indented continuation text
 * - Nested blockquotes within list items
 * - Empty lines for spacing (preserved as empty blocks)
 * - Mixed content types within single list items
 *
 * Processing Algorithm:
 * 1. **Item Detection**: Identifies list item markers (-, *, +, or 1., 2., etc.)
 * 2. **Continuation Scanning**: Uses lookahead to find indented continuation text
 * 3. **Empty Line Handling**: Preserves empty lines if followed by more content
 * 4. **Block Processing**: Converts each line into appropriate BlockSegment type
 *
 * Examples of supported structures:
 * ```markdown
 * 1. **Main point**
 *    Continuation text
 *
 *    > "Quote within item"
 *
 *    Final paragraph
 *
 * 2. **Next item**
 * ```
 *
 * @param lines Array of markdown lines
 * @param startIndex Starting line index for list processing
 * @param ordered Whether this is an ordered (numbered) or unordered list
 * @returns Object containing the processed ListElement and next line index
 */
function processListBlock(lines: string[], startIndex: number, ordered = false): { element: ListElement; nextIndex: number } {
    const items: BlockSegment[][] = [];
    let i = startIndex;
    const listPattern = ordered ? /^\d+\.\s+(.+)$/ : /^[-*+]\s+(.+)$/;
    const nextLinePattern = ordered ? /^\d+\.\s+/ : /^[-*+]\s+/;

    while (i < lines.length) {
        const line = lines[i];
        const listMatch = listPattern.exec(line);

        if (listMatch) {
            // Start a new list item
            const itemLines = [listMatch[1]];

            // Look ahead for indented continuation text
            let j = i + 1;
            while (j < lines.length) {
                const nextLine = lines[j];

                // If it's an indented line (starts with spaces/tabs), add to current item
                if (/^\s+\S/.test(nextLine)) {
                    itemLines.push(nextLine.trim());
                    j++;
                }
                // If it's empty, add as empty line and keep looking
                else if (nextLine.trim() === '') {
                    // Check if this empty line is followed by more list content
                    let k = j + 1;
                    let hasMoreContent = false;
                    while (k < lines.length) {
                        const lookAhead = lines[k];
                        if (/^\s+\S/.test(lookAhead)) {
                            hasMoreContent = true;
                            break;
                        }
                        else if (lookAhead.trim() === '') {
                            k++;
                        }
                        else {
                            break;
                        }
                    }

                    if (hasMoreContent) {
                        itemLines.push(''); // Add empty line as part of this list item
                        j++;
                    }
                    else {
                        break; // End of list item
                    }
                }
                // If it's the next list item or other content, stop
                else {
                    break;
                }
            }

            // Process each line as a separate block segment
            const blocks: BlockSegment[] = [];
            for (const line of itemLines) {
                // Check if this line is empty
                if (line === '') {
                    // Add empty text block
                    blocks.push({ segments: [{ text: '' }] });
                }
                // Check if this line is a blockquote
                else if (/^\s*>\s/.test(line)) {
                    // Extract quote content and process as quote
                    const quoteContent = line.replace(/^\s*>\s?/, '');
                    blocks.push({
                        type: 'quote',
                        segments: processInlineFormatting(quoteContent),
                    });
                }
                else {
                    // Regular paragraph
                    blocks.push({ segments: processInlineFormatting(line) });
                }
            }

            items.push(blocks);
            i = j - 1; // Will be incremented at end of loop
        }
        else if (line.trim() === '') {
            // Empty line might continue the list or end it
            if (i + 1 < lines.length && nextLinePattern.test(lines[i + 1])) {
                // Continue to next item
            }
            else {
                // End of list
                break;
            }
        }
        else {
            // Non-list line, end of list
            break;
        }

        i++;
    }

    return {
        element: {
            type: 'list',
            items,
            ordered,
        },
        nextIndex: i,
    };
}

/**
 * Processes a quote block starting at the given line index.
 * Returns the quote element and the next line index to process.
 */
function processQuoteBlock(lines: string[], startIndex: number): { element: QuoteElement; nextIndex: number } {
    const quoteLines: string[] = [];
    let i = startIndex;

    while (i < lines.length) {
        const line = lines[i];

        if (/^\s*>\s/.test(line)) {
            // Remove the leading whitespace, '>' and optional space
            const content = line.replace(/^\s*>\s?/, '');
            quoteLines.push(content);
        }
        else if (line.trim() === '') {
            // Empty line might continue the quote or end it
            if (i + 1 < lines.length && /^\s*>\s/.test(lines[i + 1])) {
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

    const content = quoteLines.join(' ').trim();

    return {
        element: {
            type: 'quote',
            segments: processInlineFormatting(content),
        },
        nextIndex: i,
    };
}

/**
 * Processes a table block starting at the given line index.
 * Returns the table element and the next line index to process.
 */
function processTableBlock(lines: string[], startIndex: number): { element: TableElement; nextIndex: number } {
    const headerLine = lines[startIndex];

    // Parse headers from the first line
    const headers = headerLine
        .split('|')
        .map(cell => cell.trim())
        .filter(cell => cell !== '')
        .map(cell => processInlineFormatting(cell));

    // Start processing rows from the line after the separator
    let i = startIndex + 2;
    const rows: InlineSegment[][][] = [];

    while (i < lines.length) {
        const line = lines[i];

        // Check if this line is a table row (contains pipes)
        if (line.includes('|')) {
            const cells = line
                .split('|')
                .map(cell => cell.trim())
                .filter(cell => cell !== '')
                .map(cell => processInlineFormatting(cell));

            // Only add if we have the right number of cells
            if (cells.length === headers.length) {
                rows.push(cells);
            }
            else {
                // Malformed table row, end table processing
                break;
            }
        }
        else if (line.trim() === '') {
            // Empty line might end the table or continue it
            if (i + 1 < lines.length && lines[i + 1].includes('|')) {
                // Continue to next row
            }
            else {
                // End of table
                break;
            }
        }
        else {
            // Non-table line, end of table
            break;
        }

        i++;
    }

    return {
        element: {
            type: 'table',
            headers,
            rows,
        },
        nextIndex: i,
    };
}
