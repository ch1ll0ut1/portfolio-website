/**
 * Markdown processing utilities for blog content.
 * Self-contained module for all markdown-related operations.
 */

import fs from 'fs';
import path from 'path';

export type MarkdownElement = HeadingElement | ParagraphElement | CodeBlockElement | ListElement;

export interface HeadingElement {
    type: 'heading';
    level: 1 | 2 | 3 | 4 | 5 | 6;
    content: string;
}

export interface ParagraphElement {
    type: 'paragraph';
    content: string;
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
        else if (line.trim() !== '') {
            elements.push({
                type: 'paragraph',
                content: line.trim(),
            });
        }

        i++;
    }

    return elements;
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
