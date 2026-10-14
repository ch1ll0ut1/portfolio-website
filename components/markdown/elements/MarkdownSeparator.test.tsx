/**
 * Tests for MarkdownSeparator component.
 * Tests separator rendering.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarkdownSeparator } from './MarkdownSeparator';
import { type SeparatorElement } from '../parser/types';

describe('MarkdownSeparator Component', () => {
    it('should render horizontal rule element', () => {
        const element: SeparatorElement = {
            type: 'separator',
        };

        render(<MarkdownSeparator element={element} />);

        const hr = document.querySelector('hr');
        expect(hr).toBeInTheDocument();
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

    it('should be accessible as a separator role', () => {
        const element: SeparatorElement = {
            type: 'separator',
        };

        render(<MarkdownSeparator element={element} />);

        // The hr's implicit role, not an explicit attribute that could drift.
        expect(screen.getByRole('separator')).not.toHaveAttribute('role');
    });
});
