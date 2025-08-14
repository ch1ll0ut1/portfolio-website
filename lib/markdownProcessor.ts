/**
 * Markdown processing utilities for blog content.
 * Self-contained module for all markdown-related operations.
 */

import fs from 'fs';
import path from 'path';

export type MarkdownElement = HeadingElement | ParagraphElement | CodeBlockElement | ListElement | QuoteElement | SeparatorElement;

export interface HeadingElement {
    type: 'heading';
    level: 1 | 2 | 3 | 4 | 5 | 6;
    content: string;
}

export interface ParagraphElement {
    type: 'paragraph';
    content: string;
    hasFormatting?: boolean;
}

export interface CodeBlockElement {
    type: 'codeBlock';
    language: string;
    content: string;
}

export interface ListElement {
    type: 'list';
    items: string[];
}

export interface QuoteElement {
    type: 'quote';
    content: string;
    hasFormatting?: boolean;
}

export interface SeparatorElement {
    type: 'separator';
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
        else if (line.startsWith('>')) {
            const quoteResult = processQuoteBlock(lines, i);
            elements.push(quoteResult.element);
            i = quoteResult.nextIndex - 1; // -1 because loop will increment
        }
        else if (line.trim() === '---') {
            elements.push({
                type: 'separator',
            });
        }
        else if (line.trim() !== '') {
            const hasFormatting = /\*\*.*?\*\*|\*.*?\*/.test(line);
            elements.push({
                type: 'paragraph',
                content: line.trim(),
                hasFormatting,
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
}

export function processInlineFormatting(content: string): InlineSegment[] {
    const segments: InlineSegment[] = [];
    let currentIndex = 0;

    // Process bold (**text**) and italic (*text*) formatting
    const formatRegex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
    let match;

    while ((match = formatRegex.exec(content)) !== null) {
        // Add text before the match as plain text
        if (match.index > currentIndex) {
            const plainText = content.substring(currentIndex, match.index);
            if (plainText) {
                segments.push({ text: plainText });
            }
        }

        // Add the formatted text
        if (match[2]) {
            // Bold text (**text**)
            segments.push({ text: match[2], isBold: true });
        }
        else if (match[3]) {
            // Italic text (*text*)
            segments.push({ text: match[3], isItalic: true });
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
    const items: string[] = [];
    let i = startIndex;

    while (i < lines.length) {
        const line = lines[i];
        const listMatch = /^[-*+]\s+(.+)$/.exec(line);

        if (listMatch) {
            items.push(listMatch[1]);
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

        if (line.startsWith('>')) {
            // Remove the '>' and optional space
            const content = line.replace(/^>\s?/, '');
            quoteLines.push(content);
        }
        else if (line.trim() === '') {
            // Empty line might continue the quote or end it
            if (i + 1 < lines.length && lines[i + 1].startsWith('>')) {
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
    const hasFormatting = /\*\*.*?\*\*|\*.*?\*/.test(content);

    return {
        element: {
            type: 'quote',
            content,
            hasFormatting,
        },
        nextIndex: i,
    };
}
