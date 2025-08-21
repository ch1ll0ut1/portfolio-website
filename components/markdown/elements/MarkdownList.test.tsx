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
                [{ segments: [{ text: 'First item' }] }],
                [{ segments: [{ text: 'Second item' }] }],
                [{ segments: [{ text: 'Third item' }] }],
            ],
        };

        render(<MarkdownList element={element} />);

        expect(screen.getByText('First item')).toBeInTheDocument();
        expect(screen.getByText('Second item')).toBeInTheDocument();
        expect(screen.getByText('Third item')).toBeInTheDocument();
    });

    it('should render list items with formatted content', () => {
        const element: ListElement = {
            type: 'list',
            items: [
                [{ segments: [{ text: 'Bold', isBold: true }, { text: ' item' }] }],
                [{ segments: [{ text: 'Italic', isItalic: true }, { text: ' item' }] }],
            ],
        };

        render(<MarkdownList element={element} />);

        expect(screen.getByText('Bold')).toBeInTheDocument();
        expect(screen.getByText('Italic')).toBeInTheDocument();
    });

    it('should handle mixed formatted and plain items', () => {
        const element: ListElement = {
            type: 'list',
            items: [
                [{ segments: [{ text: 'Plain text' }] }],
                [{ segments: [{ text: 'Bold', isBold: true }] }],
                [{ segments: [{ text: 'Link', isLink: true, href: 'https://example.com' }] }],
            ],
        };

        render(<MarkdownList element={element} />);

        expect(screen.getByText('Plain text')).toBeInTheDocument();
        expect(screen.getByText('Bold')).toBeInTheDocument();
        expect(screen.getByRole('link')).toBeInTheDocument();
    });

    it('should handle empty items array', () => {
        const element: ListElement = {
            type: 'list',
            items: [],
        };

        render(<MarkdownList element={element} />);

        const list = screen.getByRole('list');
        expect(list.children.length).toBe(0);
    });

    it('should handle single item', () => {
        const element: ListElement = {
            type: 'list',
            items: [
                [{ segments: [{ text: 'Single item' }] }],
            ],
        };

        render(<MarkdownList element={element} />);

        const list = screen.getByRole('list');
        expect(list.children.length).toBe(1);
        expect(screen.getByText('Single item')).toBeInTheDocument();
    });

    it('should render as a proper list structure', () => {
        const element: ListElement = {
            type: 'list',
            items: [
                [{ segments: [{ text: 'Test item' }] }],
            ],
        };

        render(<MarkdownList element={element} />);

        const list = screen.getByRole('list');
        expect(list).toBeInTheDocument();

        const listItems = screen.getAllByRole('listitem');
        expect(listItems).toHaveLength(1);
    });

    it('should handle items with special characters', () => {
        const element: ListElement = {
            type: 'list',
            items: [
                [{ segments: [{ text: 'Item with & special characters' }] }],
                [{ segments: [{ text: 'Item with < and > symbols' }] }],
                [{ segments: [{ text: 'Item with "quotes" and \'apostrophes\'' }] }],
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
                [{ segments: [{ text: 'Item 1' }] }],
                [{ segments: [{ text: 'Item 2' }] }],
                [{ segments: [{ text: 'Item 3' }] }],
            ],
        };

        render(<MarkdownList element={element} />);

        const listItems = screen.getAllByRole('listitem');
        expect(listItems).toHaveLength(3);

        expect(listItems[0]).toHaveTextContent('Item 1');
        expect(listItems[1]).toHaveTextContent('Item 2');
        expect(listItems[2]).toHaveTextContent('Item 3');
    });

    it('should handle very long item content', () => {
        const longText = 'This is a very long item that might wrap to multiple lines and should still be handled correctly by the component without any issues or problems occurring';
        const element: ListElement = {
            type: 'list',
            items: [
                [{ segments: [{ text: longText }] }],
            ],
        };

        render(<MarkdownList element={element} />);

        expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('should handle items with only whitespace', () => {
        const element: ListElement = {
            type: 'list',
            items: [
                [{ segments: [{ text: '   ' }] }],
                [{ segments: [{ text: '\t\t\t' }] }],
            ],
        };

        render(<MarkdownList element={element} />);

        const listItems = screen.getAllByRole('listitem');
        expect(listItems).toHaveLength(2);
    });
});
