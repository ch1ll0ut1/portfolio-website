/**
 * Tests for the project index.
 *
 * The behaviour that matters: every project is readable, the rows stay out of
 * the Tab order since none of them does anything, and the cursor-only marker
 * and preview stay out of the way of touch devices.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { itemAt } from '../../../test/itemAt';
import { installMatchMedia } from '../../../test/motionEnv';
import { FINE_POINTER_QUERY } from '../../../lib/motion';
import { projectsIndex } from '../../../config/projectsIndex';
import { MoreProjects } from './MoreProjects';
import styles from './MoreProjects.module.css';

/** jsdom lays nothing out, so rows get the offsets the marker needs. */
const stubOffsets = (rows: HTMLElement[]) => {
    rows.forEach((row, index) => {
        Object.defineProperty(row, 'offsetTop', { value: index * 70, configurable: true });
        Object.defineProperty(row, 'offsetHeight', { value: 70, configurable: true });
    });
};

const marker = (container: HTMLElement) => {
    const element = container.querySelector(`.${styles.marker}`);

    if (!(element instanceof HTMLElement)) {
        throw new Error('marker not rendered');
    }

    return element;
};

const hover = (row: HTMLElement) => {
    act(() => {
        fireEvent.pointerOver(row);
    });
};

describe('MoreProjects', () => {
    let restoreMedia: (() => void) | null = null;

    /** Pass FINE_POINTER_QUERY to get the hover and cursor-preview behaviour. */
    const setup = (matching: string[] = []) => {
        restoreMedia = installMatchMedia(matching);

        return render(<MoreProjects />);
    };

    afterEach(() => {
        restoreMedia?.();
        restoreMedia = null;
    });

    describe('content', () => {
        it('should render every project with its year, name, description and stack', () => {
            // Act
            setup();

            // Assert
            const rows = screen.getAllByRole('listitem');

            expect(rows).toHaveLength(projectsIndex.length);
            projectsIndex.forEach((project, index) => {
                const row = rows[index];

                expect(row).toHaveTextContent(project.year);
                expect(row).toHaveTextContent(project.name);
                expect(row).toHaveTextContent(project.description);
                expect(row).toHaveTextContent(project.stack.join(', '));
            });
        });

        it('should render a heading for the index', () => {
            // Act
            setup();

            // Assert
            expect(screen.getByRole('heading', { name: 'More projects' })).toBeInTheDocument();
        });
    });

    describe('keyboard', () => {
        it('should keep the rows out of the Tab order, since they have no action', () => {
            // Act
            setup([FINE_POINTER_QUERY]);

            // Assert
            screen.getAllByRole('listitem').forEach((row) => {
                expect(row).not.toHaveAttribute('tabindex');
            });
        });
    });

    describe('fine pointer', () => {
        it('should move the marker to the hovered row', () => {
            // Arrange
            const { container } = setup([FINE_POINTER_QUERY]);
            const rows = screen.getAllByRole('listitem');

            stubOffsets(rows);

            // Act
            hover(itemAt(rows, 2));

            // Assert
            expect(marker(container).className).toContain(styles.markerOn);
            expect(marker(container).style.transform).toContain('140px');

            // Act
            hover(itemAt(rows, 4));

            // Assert
            expect(marker(container).style.transform).toContain('280px');
        });

        it('should mark the hovered row and dim the rest', () => {
            // Arrange
            setup([FINE_POINTER_QUERY]);

            const rows = screen.getAllByRole('listitem');

            // Act
            hover(itemAt(rows, 1));

            // Assert
            expect(itemAt(rows, 1).className).toContain(styles.rowActive);
            expect(itemAt(rows, 0).className).not.toContain(styles.rowActive);
            expect(itemAt(rows, 1).closest('ol')?.className).toContain(styles.listHot);
        });

        it('should clear the active row when the pointer leaves the list', () => {
            // Arrange
            const { container } = setup([FINE_POINTER_QUERY]);
            const rows = screen.getAllByRole('listitem');

            hover(itemAt(rows, 1));

            // Act
            act(() => {
                fireEvent.pointerLeave(itemAt(rows, 1).closest('ol') ?? document.body);
            });

            // Assert
            expect(marker(container).className).not.toContain(styles.markerOn);
            expect(itemAt(rows, 1).className).not.toContain(styles.rowActive);
        });

        it('should show the preview card for a hovered row', () => {
            // Arrange
            setup([FINE_POINTER_QUERY]);

            const rows = screen.getAllByRole('listitem');

            // Act
            hover(itemAt(rows, 0));

            // Assert
            expect(screen.getByText(`~/work/${itemAt(projectsIndex, 0).id}`)).toBeInTheDocument();
        });
    });

    describe('touch', () => {
        it('should not render the preview card without a fine pointer', () => {
            // Arrange
            setup();

            const rows = screen.getAllByRole('listitem');

            // Act
            fireEvent.pointerOver(itemAt(rows, 0));

            // Assert
            expect(screen.queryByText(`~/work/${itemAt(projectsIndex, 0).id}`)).toBeNull();
        });
    });
});
