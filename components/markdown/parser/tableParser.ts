/**
 * Table parsing: a header row, a separator row of pipes and dashes, then body
 * rows with the same number of cells.
 */

import { parseInline } from './inlineParser';
import { type BlockResult, type InlineSegment, type TableElement } from './types';

/** Whether `line` and the one after it open a table. */
export const startsTable = (line: string, nextLine: string) =>
    line.includes('|') && nextLine.includes('|') && /^[\s|:-]+$/.test(nextLine);

/**
 * Processes a table block starting at the given line index.
 * Returns the table element and the next line index to process.
 */
export function parseTable(lines: string[], startIndex: number): BlockResult<TableElement> {
    const headers = parseCells(lines[startIndex] ?? '');

    // Start processing rows from the line after the separator
    let i = startIndex + 2;
    const rows: InlineSegment[][][] = [];

    while (i < lines.length) {
        const line = lines[i];
        if (line === undefined) {
            break;
        }

        // Check if this line is a table row (contains pipes)
        if (line.includes('|')) {
            const cells = parseCells(line);

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
            if (lines[i + 1]?.includes('|') === true) {
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

/** A row's non-empty cells, each parsed for inline formatting. */
function parseCells(line: string) {
    return line
        .split('|')
        .map(cell => cell.trim())
        .filter(cell => cell !== '')
        .map(cell => parseInline(cell));
}
