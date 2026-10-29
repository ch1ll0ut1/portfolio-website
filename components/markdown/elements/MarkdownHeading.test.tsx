/**
 * Tests for MarkdownHeading component: it renders the rank the body outline
 * assigned, styled by rank.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarkdownHeading } from './MarkdownHeading';
import { type HeadingRank, type RankedHeading } from '../bodyOutline';

const heading = (rank: HeadingRank, content: string, level: RankedHeading['level'] = 2): RankedHeading => ({
    type: 'heading',
    level,
    rank,
    content,
});

describe('MarkdownHeading Component', () => {
    it('renders the element for its rank, not its markdown level', () => {
        render(<MarkdownHeading element={heading(2, 'Part one', 1)} id="part-one" />);

        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Part one');
    });

    it.each([2, 3, 4, 5, 6] as const)('renders rank %i as that heading level', (rank) => {
        render(<MarkdownHeading element={heading(rank, `Rank ${rank}`)} id={`rank-${rank}`} />);

        expect(screen.getByRole('heading', { level: rank })).toHaveTextContent(`Rank ${rank}`);
    });

    it('shares the h4 style for every rank below h3', () => {
        render(
            <>
                <MarkdownHeading element={heading(4, 'Four')} id="four" />
                <MarkdownHeading element={heading(6, 'Six')} id="six" />
            </>,
        );

        expect(screen.getByText('Six').className).toBe(screen.getByText('Four').className);
        expect(screen.getByText('Four').className).not.toBe('');
    });

    it('should handle special characters in content', () => {
        render(<MarkdownHeading element={heading(2, 'Title with & special < characters >')} id="title" />);

        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Title with & special < characters >');
    });

    it('should carry its id and link to itself under an accessible label', () => {
        render(<MarkdownHeading element={heading(2, 'Part one')} id="part-one" />);

        const section = screen.getByRole('heading', { level: 2, name: 'Part one' });
        const link = screen.getByRole('link', { name: 'Link to section: Part one' });

        expect(section).toHaveAttribute('id', 'part-one');
        expect(link).toHaveAttribute('href', '#part-one');
        expect(section).toContainElement(link);
        // The "#" is CSS: the heading's text is only its own.
        expect(section.textContent).toBe('Part one');
    });
});
