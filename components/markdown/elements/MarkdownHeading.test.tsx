/**
 * Tests for MarkdownHeading component.
 * Tests heading level rendering and accessibility.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarkdownHeading } from './MarkdownHeading';
import { type HeadingElement } from '../parser/types';

describe('MarkdownHeading Component', () => {
    it('should render h1 as h4 element', () => {
        const element: HeadingElement = {
            type: 'heading',
            level: 1,
            content: 'Main Title',
        };

        render(<MarkdownHeading element={element} />);

        const heading = screen.getByRole('heading', { level: 4 });
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('Main Title');
    });

    it('should render h2 as h2 element', () => {
        const element: HeadingElement = {
            type: 'heading',
            level: 2,
            content: 'Section Title',
        };

        render(<MarkdownHeading element={element} />);

        const heading = screen.getByRole('heading', { level: 2 });
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('Section Title');
    });

    it('should render h3 as h3 element', () => {
        const element: HeadingElement = {
            type: 'heading',
            level: 3,
            content: 'Subsection Title',
        };

        render(<MarkdownHeading element={element} />);

        const heading = screen.getByRole('heading', { level: 3 });
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('Subsection Title');
    });

    it('should render h4-h6 as h4 elements', () => {
        const levels = [4, 5, 6] as const;

        levels.forEach((level) => {
            const element: HeadingElement = {
                type: 'heading',
                level,
                content: `Level ${level} Title`,
            };

            const { unmount } = render(<MarkdownHeading element={element} />);

            const heading = screen.getByRole('heading', { level: 4 });
            expect(heading).toBeInTheDocument();
            expect(heading).toHaveTextContent(`Level ${level} Title`);

            unmount();
        });
    });

    it('should handle empty content', () => {
        const element: HeadingElement = {
            type: 'heading',
            level: 2,
            content: '',
        };

        render(<MarkdownHeading element={element} />);

        const heading = screen.getByRole('heading', { level: 2 });
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('');
    });

    it('should handle special characters in content', () => {
        const element: HeadingElement = {
            type: 'heading',
            level: 2,
            content: 'Title with & special < characters >',
        };

        render(<MarkdownHeading element={element} />);

        const heading = screen.getByRole('heading', { level: 2 });
        expect(heading).toHaveTextContent('Title with & special < characters >');
    });

    it('should map each markdown level onto a heading rank below the page title', () => {
        const testCases = [
            { level: 1 as const, expectedRank: 4 },
            { level: 2 as const, expectedRank: 2 },
            { level: 3 as const, expectedRank: 3 },
            { level: 4 as const, expectedRank: 4 },
        ];

        testCases.forEach(({ level, expectedRank }) => {
            const element: HeadingElement = {
                type: 'heading',
                level,
                content: `Level ${level}`,
            };

            const { unmount } = render(<MarkdownHeading element={element} />);

            expect(screen.getByRole('heading', { level: expectedRank })).toHaveTextContent(`Level ${level}`);

            unmount();
        });
    });

    it('should render long content correctly', () => {
        const longContent = 'This is a very long heading that might wrap to multiple lines and should still be rendered correctly';
        const element: HeadingElement = {
            type: 'heading',
            level: 2,
            content: longContent,
        };

        render(<MarkdownHeading element={element} />);

        const heading = screen.getByRole('heading', { level: 2 });
        expect(heading).toHaveTextContent(longContent);
    });
});
