/**
 * Markdown processing utilities for blog content.
 * Self-contained module for all markdown-related operations.
 */

import fs from 'fs';
import path from 'path';

export type MarkdownElement = HeadingElement | ParagraphElement | CodeBlockElement | ListElement | QuoteElement | SeparatorElement | TableElement;

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

export interface ListElement {
    type: 'list';
    items: InlineSegment[][];
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
 * Processes markdown content into structured elements.
 * Handles headings, paragraphs, code blocks, and lists.
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
            const listResult = processListBlock(lines, i);
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
 * Processes a list block starting at the given line index.
 * Returns the list element and the next line index to process.
 */
function processListBlock(lines: string[], startIndex: number): { element: ListElement; nextIndex: number } {
    const items: InlineSegment[][] = [];
    let i = startIndex;

    while (i < lines.length) {
        const line = lines[i];
        const listMatch = /^[-*+]\s+(.+)$/.exec(line);

        if (listMatch) {
            items.push(processInlineFormatting(listMatch[1]));
        }
        else if (line.trim() === '') {
            // Empty line might continue the list or end it
            if (i + 1 < lines.length && /^[-*+]\s+/.test(lines[i + 1])) {
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
