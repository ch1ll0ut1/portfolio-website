/**
 * Tests for MarkdownSeparator component.
 * Tests separator rendering.
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MarkdownSeparator } from './MarkdownSeparator';
import { type SeparatorElement } from '../markdownProcessor';

describe('MarkdownSeparator Component', () => {
    it('should render horizontal rule element', () => {
        const element: SeparatorElement = {
            type: 'separator',
        };

        render(<MarkdownSeparator element={element} />);

        const hr = document.querySelector('hr');
        expect(hr).toBeInTheDocument();
    });

    it('should apply correct CSS classes', () => {
        const element: SeparatorElement = {
            type: 'separator',
        };

        render(<MarkdownSeparator element={element} />);

        const hr = document.querySelector('hr');
        expect(hr).toHaveClass('border-t', 'border-slate-300', 'my-8');
    });

    it('should render as self-closing element', () => {
        const element: SeparatorElement = {
            type: 'separator',
        };

        render(<MarkdownSeparator element={element} />);

        const hr = document.querySelector('hr');
        expect(hr).toBeInTheDocument();
        expect(hr?.children.length).toBe(0);
        expect(hr?.textContent).toBe('');
    });

    it('should handle multiple separators', () => {
        const element: SeparatorElement = {
            type: 'separator',
        };

        render(
            <div>
                <MarkdownSeparator element={element} />
                <MarkdownSeparator element={element} />
                <MarkdownSeparator element={element} />
            </div>,
        );

        const hrs = document.querySelectorAll('hr');
        expect(hrs).toHaveLength(3);
        hrs.forEach((hr) => {
            expect(hr).toHaveClass('border-t', 'border-slate-300', 'my-8');
        });
    });

    it('should not accept any content or children', () => {
        const element: SeparatorElement = {
            type: 'separator',
        };

        render(<MarkdownSeparator element={element} />);

        const hr = document.querySelector('hr');
        expect(hr?.innerHTML).toBe('');
    });

    it('should be accessible as a separator role', () => {
        const element: SeparatorElement = {
            type: 'separator',
        };

        render(<MarkdownSeparator element={element} />);

        const hr = document.querySelector('hr');
        expect(hr).toBeInTheDocument();
        // HR elements have an implicit separator role
        expect(hr?.getAttribute('role')).toBeNull(); // Default role is separator
    });
});
