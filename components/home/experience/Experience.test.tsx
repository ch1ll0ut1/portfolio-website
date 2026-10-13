/**
 * Tests for the experience section.
 * Focus: the history reads as text, the structure is navigable, and the graph
 * stays decorative.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { careerLog } from '@/config/career';
import { itemAt } from '@/test/itemAt';
import { installIntersectionObserver, installMatchMedia } from '../../../test/motionEnv';
import { Experience } from './Experience';

/**
 * Hovers a row. jsdom has no PointerEvent, so the event is built by hand to
 * carry the `pointerType` the row checks before reacting.
 */
const hover = (row: HTMLElement, pointerType: string) => {
    const event = new Event('pointerover', { bubbles: true });

    Object.defineProperty(event, 'pointerType', { value: pointerType });
    fireEvent(row, event);
};

describe('Experience', () => {
    let observers: ReturnType<typeof installIntersectionObserver>;
    let restoreMedia: () => void;

    beforeEach(() => {
        observers = installIntersectionObserver();
        restoreMedia = installMatchMedia([]);
    });

    afterEach(() => {
        observers.restore();
        restoreMedia();
    });

    describe('Section Shell', () => {
        it('should render a labelled section anchored at the experience id', () => {
            // Act
            const { container } = render(<Experience />);

            // Assert
            expect(screen.getByRole('region', { name: /\d+ years, one log/i })).toBeInTheDocument();
            expect(container.querySelector('#experience')).toBeInTheDocument();
        });

        it('should explain the two branches in the sub-line', () => {
            // Act
            render(<Experience />);

            // Assert
            expect(screen.getByText(/forks off main onto its own branch/i)).toBeInTheDocument();
        });
    });

    describe('Career History', () => {
        it('should render every commit as a list item', () => {
            // Act
            render(<Experience />);

            // Assert
            expect(screen.getAllByRole('listitem')).toHaveLength(careerLog.length);
        });

        it('should render every role title as a heading', () => {
            // Act
            render(<Experience />);

            // Assert
            careerLog.forEach((commit) => {
                expect(screen.getByRole('heading', { level: 3, name: commit.title })).toBeInTheDocument();
            });
        });

        it('should render every description and year range as text', () => {
            // Act
            render(<Experience />);

            // Assert
            careerLog.forEach((commit) => {
                expect(screen.getByText(commit.description)).toBeInTheDocument();
                expect(screen.getAllByText(commit.years).length).toBeGreaterThan(0);
            });
        });

        it('should render every commit hash', () => {
            // Act
            render(<Experience />);

            // Assert
            careerLog.forEach((commit) => {
                expect(screen.getByText(commit.hash)).toBeInTheDocument();
            });
        });

        it('should keep the commits in newest-first document order', () => {
            // Act
            render(<Experience />);
            const items = screen.getAllByRole('listitem');

            // Assert
            items.forEach((item, index) => {
                expect(item.textContent).toContain(itemAt(careerLog, index).title);
            });
        });

        it('should hide the git ref chips from assistive technology', () => {
            // Act
            const { container } = render(<Experience />);
            const chips = Array.from(container.querySelectorAll('h3 span'));

            // Assert
            expect(chips.length).toBeGreaterThan(0);
            chips.forEach((chip) => {
                expect(chip).toHaveAttribute('aria-hidden', 'true');
            });
        });
    });

    describe('Career Graph', () => {
        it('should hide both graph layers from assistive technology', () => {
            // Act
            const { container } = render(<Experience />);
            const layers = Array.from(container.querySelectorAll('svg'));

            // Assert
            expect(layers).toHaveLength(2);
            layers.forEach((layer) => {
                expect(layer).toHaveAttribute('aria-hidden', 'true');
            });
        });

        it('should draw one lane per branch on each layer', () => {
            // Act
            const { container } = render(<Experience />);
            const layers = Array.from(container.querySelectorAll('svg'));

            // Assert
            layers.forEach((layer) => {
                expect(layer.querySelectorAll('path')).toHaveLength(2);
            });
        });

        it('should draw a node for every commit on each layer', () => {
            // Act
            const { container } = render(<Experience />);
            const layers = container.querySelectorAll('svg');
            const track = itemAt(layers, 0);
            const ink = itemAt(layers, 1);

            // Assert: the track carries a node and a pulse ring per commit.
            expect(track.querySelectorAll('circle').length).toBeGreaterThanOrEqual(careerLog.length * 2);
            // The ink carries a node and its filled dot per commit.
            expect(ink.querySelectorAll('circle')).toHaveLength(careerLog.length * 2);
        });
    });

    describe('Row Hover', () => {
        it('should re-roll the hovered commit hash for a mouse', () => {
            // Arrange
            const { container } = render(<Experience />);
            const row = itemAt(screen.getAllByRole('listitem'), 0);

            // Act
            hover(row, 'mouse');

            // Assert: the scramble stashes the real hash before it starts.
            expect(container.querySelector('[data-hash]')).toHaveAttribute('data-hash', itemAt(careerLog, 0).hash);
        });

        it('should ignore hover from a touch pointer', () => {
            // Arrange
            const { container } = render(<Experience />);
            const row = itemAt(screen.getAllByRole('listitem'), 0);

            // Act
            hover(row, 'touch');

            // Assert
            expect(container.querySelector('[data-hash]')).toBeNull();
        });
    });
});
