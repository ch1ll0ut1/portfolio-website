/**
 * List parsing with smart continuation detection.
 *
 * Handles complex list structures including:
 * - Multi-line list items with indented continuation text
 * - Nested blockquotes within list items
 * - Empty lines for spacing (preserved as empty blocks)
 * - Mixed content types within single list items
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
 */

import { parseInline } from './inlineParser';
import { type BlockResult, type BlockSegment, type ListElement } from './types';

/** An unordered list item: `-`, `*` or `+`, then its text. */
export const UNORDERED_ITEM = /^[-*+]\s+(.+)$/;
/** An ordered list item: a number and a dot, then its text. */
export const ORDERED_ITEM = /^\d+\.\s+(.+)$/;

const QUOTE_LINE = /^\s*>\s/;
const INDENTED = /^\s+\S/;

/**
 * Processing Algorithm:
 * 1. **Item Detection**: Identifies list item markers (-, *, +, or 1., 2., etc.)
 * 2. **Continuation Scanning**: Uses lookahead to find indented continuation text
 * 3. **Empty Line Handling**: Preserves empty lines if followed by more content
 * 4. **Block Processing**: Converts each line into appropriate BlockSegment type
 *
 * @param lines Array of markdown lines
 * @param startIndex Starting line index for list processing
 * @param ordered Whether this is an ordered (numbered) or unordered list
 * @returns Object containing the processed ListElement and next line index
 */
export function parseList(lines: string[], startIndex: number, ordered = false): BlockResult<ListElement> {
    const items: BlockSegment[][] = [];
    let i = startIndex;
    const listPattern = ordered ? ORDERED_ITEM : UNORDERED_ITEM;
    const nextLinePattern = ordered ? /^\d+\.\s+/ : /^[-*+]\s+/;

    while (i < lines.length) {
        const line = lines[i];
        if (line === undefined) {
            break;
        }
        const firstItemLine = listPattern.exec(line)?.[1];

        if (firstItemLine !== undefined) {
            const { itemLines, nextIndex } = collectItemLines(lines, i + 1, firstItemLine);

            items.push(itemLines.map(toBlockSegment));
            i = nextIndex - 1; // Will be incremented at end of loop
        }
        else if (line.trim() === '') {
            // Empty line might continue the list or end it
            if (i + 1 < lines.length && nextLinePattern.test(lines[i + 1] ?? '')) {
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
 * Gathers an item's own line plus the indented lines that continue it. A blank
 * line stays part of the item only when more indented content follows it;
 * kept blanks come back as empty strings.
 */
function collectItemLines(lines: string[], from: number, firstItemLine: string) {
    const itemLines = [firstItemLine];
    let j = from;

    while (j < lines.length) {
        const nextLine = lines[j];
        if (nextLine === undefined) {
            break;
        }

        // If it's an indented line (starts with spaces/tabs), add to current item
        if (INDENTED.test(nextLine)) {
            itemLines.push(nextLine.trim());
            j++;
        }
        // If it's empty, keep it only if the item carries on after it
        else if (nextLine.trim() === '') {
            if (hasIndentedContentAfter(lines, j + 1)) {
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

    return { itemLines, nextIndex: j };
}

/** Whether, skipping blank lines from `from`, the next line is indented. */
function hasIndentedContentAfter(lines: string[], from: number) {
    let k = from;

    while (k < lines.length) {
        const lookAhead = lines[k];
        if (lookAhead === undefined) {
            break;
        }
        if (INDENTED.test(lookAhead)) {
            return true;
        }
        else if (lookAhead.trim() === '') {
            k++;
        }
        else {
            break;
        }
    }

    return false;
}

/** One line of an item: an empty spacer, a quote, or a paragraph. */
function toBlockSegment(line: string): BlockSegment {
    if (line === '') {
        return { segments: [{ text: '' }] };
    }

    if (QUOTE_LINE.test(line)) {
        return {
            type: 'quote',
            segments: parseInline(line.replace(/^\s*>\s?/, '')),
        };
    }

    return { segments: parseInline(line) };
}
