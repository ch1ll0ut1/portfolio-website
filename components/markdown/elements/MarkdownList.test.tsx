/**
 * Tests for MarkdownList component.
 * Tests list rendering and InlineContent integration.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarkdownList } from './MarkdownList';
import { type ListElement } from '../markdownProcessor';

describe('MarkdownList Component', () => {
    it('should render list with plain text items', () => {
        const element: ListElement = {
            type: 'list',
            items: [
                [{ text: 'First item' }],
                [{ text: 'Second item' }],
                [{ text: 'Third item' }],
            ],
        };

        render(<MarkdownList element={element} />);

        const list = screen.getByRole('list');
        expect(list).toBeInTheDocument();
        expect(list.tagName).toBe('UL');

        expect(screen.getByText('First item')).toBeInTheDocument();
        expect(screen.getByText('Second item')).toBeInTheDocument();
        expect(screen.getByText('Third item')).toBeInTheDocument();
    });

    it('should render list items with formatted content', () => {
        const element: ListElement = {
            type: 'list',
            items: [
                [
                    { text: 'Item with ' },
                    { text: 'bold', isBold: true },
                    { text: ' text' },
                ],
                [
                    { text: 'Item with ' },
                    { text: 'italic', isItalic: true },
                    { text: ' text' },
                ],
                [
                    { text: 'Item with ' },
                    { text: 'link', isLink: true, href: 'https://example.com' },
                ],
            ],
        };

        render(<MarkdownList element={element} />);

        const list = screen.getByRole('list');
        expect(list).toBeInTheDocument();

        // Check that formatting is applied
        expect(screen.getByText('bold')).toBeInTheDocument();
        expect(screen.getByText('italic')).toBeInTheDocument();
        expect(screen.getByText('link')).toBeInTheDocument();
    });

    it('should handle mixed formatted and plain items', () => {
        const element: ListElement = {
            type: 'list',
            items: [
                [{ text: 'Plain text item' }],
                [
                    { text: 'Item with ' },
                    { text: 'bold', isBold: true },
                    { text: ' text' },
                ],
                [{ text: 'Another plain item' }],
            ],
        };

        render(<MarkdownList element={element} />);

        expect(screen.getByText('Plain text item')).toBeInTheDocument();
        expect(screen.getByText('bold')).toBeInTheDocument();
        expect(screen.getByText('Another plain item')).toBeInTheDocument();
    });

    it('should handle empty items array', () => {
        const element: ListElement = {
            type: 'list',
            items: [],
        };

        render(<MarkdownList element={element} />);

        const list = screen.getByRole('list');
        expect(list).toBeInTheDocument();
        expect(list.children.length).toBe(0);
    });

    it('should handle single item', () => {
        const element: ListElement = {
            type: 'list',
            items: [[{ text: 'Single item' }]],
        };

        render(<MarkdownList element={element} />);

        const list = screen.getByRole('list');
        expect(list).toBeInTheDocument();
        expect(list.children.length).toBe(1);
        expect(screen.getByText('Single item')).toBeInTheDocument();
    });

    it('should apply correct CSS classes', () => {
        const element: ListElement = {
            type: 'list',
            items: [[{ text: 'Test item' }]],
        };

        render(<MarkdownList element={element} />);

        const list = screen.getByRole('list');
        expect(list).toHaveClass('list-disc', 'list-inside', 'space-y-2', 'my-4', 'text-muted-foreground');
    });

    it('should handle items with special characters', () => {
        const element: ListElement = {
            type: 'list',
            items: [
                [{ text: 'Item with & special characters' }],
                [{ text: 'Item with < and > symbols' }],
                [{ text: 'Item with "quotes" and \'apostrophes\'' }],
            ],
        };

        render(<MarkdownList element={element} />);

        expect(screen.getByText('Item with & special characters')).toBeInTheDocument();
        expect(screen.getByText('Item with < and > symbols')).toBeInTheDocument();
        expect(screen.getByText('Item with "quotes" and \'apostrophes\'')).toBeInTheDocument();
    });

    it('should render each item as a list item element', () => {
        const element: ListElement = {
            type: 'list',
            items: [
                [{ text: 'First' }],
                [{ text: 'Second' }],
                [{ text: 'Third' }],
            ],
        };

        render(<MarkdownList element={element} />);

        const listItems = screen.getAllByRole('listitem');
        expect(listItems).toHaveLength(3);
        expect(listItems[0]).toHaveTextContent('First');
        expect(listItems[1]).toHaveTextContent('Second');
        expect(listItems[2]).toHaveTextContent('Third');
    });

    it('should handle very long item content', () => {
        const longContent = 'This is a very long list item that contains a lot of text and should still be rendered correctly without breaking the layout or causing any issues';
        const element: ListElement = {
            type: 'list',
            items: [[{ text: longContent }]],
        };

        render(<MarkdownList element={element} />);

        expect(screen.getByText(longContent)).toBeInTheDocument();
    });

    it('should handle items with only whitespace', () => {
        const element: ListElement = {
            type: 'list',
            items: [
                [{ text: '   ' }],
                [{ text: '\t\n' }],
                [{ text: 'Valid item' }],
            ],
        };

        render(<MarkdownList element={element} />);

        const listItems = screen.getAllByRole('listitem');
        expect(listItems).toHaveLength(3);
        expect(screen.getByText('Valid item')).toBeInTheDocument();
    });
});
