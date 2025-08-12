/**
 * Markdown processing utilities for blog content.
 * Self-contained module for all markdown-related operations.
 */

import fs from 'fs';
import path from 'path';

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
        console.error(`Error reading markdown file ${fileName}:`, error);
        return null;
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

        if (line.startsWith('# ')) {
            elements.push({
                type: 'heading',
                level: 1,
                content: line.replace('# ', '').trim(),
            });
        }
        else if (line.startsWith('## ')) {
            elements.push({
                type: 'heading',
                level: 2,
                content: line.replace('## ', '').trim(),
            });
        }
        else if (line.startsWith('### ')) {
            elements.push({
                type: 'heading',
                level: 3,
                content: line.replace('### ', '').trim(),
            });
        }
        else if (line.startsWith('```')) {
            const codeBlock = processCodeBlock(lines, i);
            elements.push(codeBlock.element);
            i = codeBlock.nextIndex - 1; // -1 because loop will increment
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

export interface MarkdownElement {
    type: 'heading' | 'paragraph' | 'codeBlock';
    content: string;
    level?: number;
    language?: string;
}

export interface HeadingElement extends MarkdownElement {
    type: 'heading';
    level: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface ParagraphElement extends MarkdownElement {
    type: 'paragraph';
}

export interface CodeBlockElement extends MarkdownElement {
    type: 'codeBlock';
    language: string;
}
