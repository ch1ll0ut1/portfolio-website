/**
 * Tests for MarkdownTable component.
 * Tests table structure and cell formatting.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarkdownTable } from './MarkdownTable';
import { type TableElement } from '../markdownProcessor';

describe('MarkdownTable Component', () => {
    it('should render table with headers and rows', () => {
        const element: TableElement = {
            type: 'table',
            headers: [
                [{ text: 'Header 1' }],
                [{ text: 'Header 2' }],
            ],
            rows: [
                [
                    [{ text: 'Row 1 Col 1' }],
                    [{ text: 'Row 1 Col 2' }],
                ],
                [
                    [{ text: 'Row 2 Col 1' }],
                    [{ text: 'Row 2 Col 2' }],
                ],
            ],
        };

        render(<MarkdownTable element={element} />);

        const table = screen.getByRole('table');
        expect(table).toBeInTheDocument();

        // Check headers
        expect(screen.getByText('Header 1')).toBeInTheDocument();
        expect(screen.getByText('Header 2')).toBeInTheDocument();

        // Check rows
        expect(screen.getByText('Row 1 Col 1')).toBeInTheDocument();
        expect(screen.getByText('Row 1 Col 2')).toBeInTheDocument();
        expect(screen.getByText('Row 2 Col 1')).toBeInTheDocument();
        expect(screen.getByText('Row 2 Col 2')).toBeInTheDocument();
    });

    it('should render table with formatted cell content', () => {
        const element: TableElement = {
            type: 'table',
            headers: [
                [{ text: 'Text' }],
                [{ text: 'Formatted' }],
            ],
            rows: [
                [
                    [{ text: 'Plain text' }],
                    [{ text: 'Bold text', isBold: true }],
                ],
                [
                    [{ text: 'More text' }],
                    [{ text: 'Italic text', isItalic: true }],
                ],
                [
                    [{ text: 'Even more' }],
                    [{ text: 'Link', isLink: true, href: 'https://example.com' }],
                ],
            ],
        };

        render(<MarkdownTable element={element} />);

        const table = screen.getByRole('table');
        expect(table).toBeInTheDocument();

        // Check that formatting is applied
        expect(screen.getByText('Bold text')).toBeInTheDocument();
        expect(screen.getByText('Italic text')).toBeInTheDocument();
        expect(screen.getByText('Link')).toBeInTheDocument();

        // Check plain text
        expect(screen.getByText('Plain text')).toBeInTheDocument();
    });

    it('should handle empty table', () => {
        const element: TableElement = {
            type: 'table',
            headers: [],
            rows: [],
        };

        render(<MarkdownTable element={element} />);

        const table = screen.getByRole('table');
        expect(table).toBeInTheDocument();

        const thead = table.querySelector('thead tr');
        const tbody = table.querySelector('tbody');
        expect(thead?.children.length).toBe(0);
        expect(tbody?.children.length).toBe(0);
    });

    it('should handle table with headers but no rows', () => {
        const element: TableElement = {
            type: 'table',
            headers: [
                [{ text: 'Header 1' }],
                [{ text: 'Header 2' }],
            ],
            rows: [],
        };

        render(<MarkdownTable element={element} />);

        const table = screen.getByRole('table');
        expect(table).toBeInTheDocument();

        expect(screen.getByText('Header 1')).toBeInTheDocument();
        expect(screen.getByText('Header 2')).toBeInTheDocument();

        const tbody = table.querySelector('tbody');
        expect(tbody?.children.length).toBe(0);
    });

    it('should apply correct CSS classes to container', () => {
        const element: TableElement = {
            type: 'table',
            headers: [[{ text: 'Header' }]],
            rows: [[[{ text: 'Cell' }]]],
        };

        render(<MarkdownTable element={element} />);

        const container = screen.getByRole('table').parentElement;
        expect(container).toHaveClass('my-6', 'overflow-x-auto');
    });

    it('should apply correct CSS classes to table', () => {
        const element: TableElement = {
            type: 'table',
            headers: [[{ text: 'Header' }]],
            rows: [[[{ text: 'Cell' }]]],
        };

        render(<MarkdownTable element={element} />);

        const table = screen.getByRole('table');
        expect(table).toHaveClass('w-full', 'border-collapse', 'border', 'border-slate-300', 'rounded-lg');
    });

    it('should apply correct CSS classes to header cells', () => {
        const element: TableElement = {
            type: 'table',
            headers: [[{ text: 'Header 1' }]],
            rows: [],
        };

        render(<MarkdownTable element={element} />);

        const headerCell = document.querySelector('th');
        expect(headerCell).toBeInTheDocument();
        expect(headerCell?.tagName).toBe('TH');
        expect(headerCell).toHaveClass(
            'border',
            'border-slate-300',
            'px-4',
            'py-3',
            'text-left',
            'font-semibold',
            'text-primary',
        );
        expect(screen.getByText('Header 1')).toBeInTheDocument();
    });

    it('should apply correct CSS classes to data cells', () => {
        const element: TableElement = {
            type: 'table',
            headers: [[{ text: 'Header' }]],
            rows: [[[{ text: 'Cell' }]]],
        };

        render(<MarkdownTable element={element} />);

        const dataCell = document.querySelector('td');
        expect(dataCell).toBeInTheDocument();
        expect(dataCell?.tagName).toBe('TD');
        expect(dataCell).toHaveClass(
            'border',
            'border-slate-300',
            'px-4',
            'py-3',
            'text-muted-foreground',
        );
        expect(screen.getByText('Cell')).toBeInTheDocument();
    });

    it('should apply hover effects to rows', () => {
        const element: TableElement = {
            type: 'table',
            headers: [[{ text: 'Header' }]],
            rows: [[[{ text: 'Cell' }]]],
        };

        render(<MarkdownTable element={element} />);

        const row = screen.getByText('Cell').closest('tr');
        expect(row).toHaveClass('hover:bg-slate-50', 'transition-colors');
    });

    it('should handle special characters in cells', () => {
        const element: TableElement = {
            type: 'table',
            headers: [[{ text: 'Special & Characters' }]],
            rows: [[[{ text: 'Cell with < and > symbols' }]]],
        };

        render(<MarkdownTable element={element} />);

        expect(screen.getByText('Special & Characters')).toBeInTheDocument();
        expect(screen.getByText('Cell with < and > symbols')).toBeInTheDocument();
    });

    it('should handle large tables', () => {
        const headers = Array.from({ length: 5 }, (_, i) => [{ text: `Header ${i + 1}` }]);
        const rows = Array.from({ length: 10 }, (_, i) =>
            Array.from({ length: 5 }, (_, j) => [{ text: `Row ${i + 1} Col ${j + 1}` }]),
        );

        const element: TableElement = {
            type: 'table',
            headers,
            rows,
        };

        render(<MarkdownTable element={element} />);

        const table = screen.getByRole('table');
        expect(table).toBeInTheDocument();

        // Check some headers and cells
        expect(screen.getByText('Header 1')).toBeInTheDocument();
        expect(screen.getByText('Header 5')).toBeInTheDocument();
        expect(screen.getByText('Row 1 Col 1')).toBeInTheDocument();
        expect(screen.getByText('Row 10 Col 5')).toBeInTheDocument();
    });

    it('should handle mixed formatted and plain cells', () => {
        const element: TableElement = {
            type: 'table',
            headers: [
                [{ text: 'Plain' }],
                [{ text: 'Formatted' }],
            ],
            rows: [
                [
                    [{ text: 'Plain cell' }],
                    [{ text: 'Bold cell', isBold: true }],
                ],
                [
                    [{ text: 'Another plain' }],
                    [{ text: 'Plain cell' }],
                ],
                [
                    [{ text: 'Yet another' }],
                    [{ text: 'Link cell', isLink: true, href: 'https://example.com' }],
                ],
            ],
        };

        render(<MarkdownTable element={element} />);

        expect(screen.getAllByText('Plain cell')).toHaveLength(2);
        expect(screen.getByText('Bold cell')).toBeInTheDocument();
        expect(screen.getByText('Link cell')).toBeInTheDocument();
    });
});
