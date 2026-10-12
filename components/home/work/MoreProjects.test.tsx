/**
 * Tests for the project index.
 *
 * The behaviour that matters: every project is readable, the list works from a
 * keyboard exactly as it does from a cursor, and the cursor-only preview stays
 * out of the way of keyboard users and touch devices.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
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

const focus = (row: HTMLElement) => {
    act(() => {
        row.focus();
    });
};

const blur = (row: HTMLElement) => {
    act(() => {
        row.blur();
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
        it('should make every row reachable from the keyboard', () => {
            // Act
            setup();

            // Assert
            screen.getAllByRole('listitem').forEach((row) => {
                expect(row).toHaveAttribute('tabindex', '0');
            });
        });

        it('should move the marker to the focused row', () => {
            // Arrange
            const { container } = setup();
            const rows = screen.getAllByRole('listitem');

            stubOffsets(rows);

            // Act
            focus(rows[2]);

            // Assert
            expect(marker(container).className).toContain(styles.markerOn);
            expect(marker(container).style.transform).toContain('140px');

            // Act
            focus(rows[4]);

            // Assert
            expect(marker(container).style.transform).toContain('280px');
        });

        it('should mark the focused row and dim the rest', () => {
            // Arrange
            setup();

            const rows = screen.getAllByRole('listitem');

            // Act
            focus(rows[1]);

            // Assert
            expect(rows[1].className).toContain(styles.rowActive);
            expect(rows[0].className).not.toContain(styles.rowActive);
            expect(rows[1].closest('ol')?.className).toContain(styles.listHot);
        });

        it('should clear the active row when focus leaves the list', () => {
            // Arrange
            const { container } = setup();
            const rows = screen.getAllByRole('listitem');

            focus(rows[1]);

            // Act
            blur(rows[1]);

            // Assert
            expect(marker(container).className).not.toContain(styles.markerOn);
            expect(rows[1].className).not.toContain(styles.rowActive);
        });
    });

    describe('fine pointer', () => {
        it('should treat a hovered row exactly like a focused one', () => {
            // Arrange
            const { container } = setup([FINE_POINTER_QUERY]);
            const rows = screen.getAllByRole('listitem');

            stubOffsets(rows);
            focus(rows[3]);

            const fromFocus = marker(container).style.transform;

            blur(rows[3]);

            // Act
            fireEvent.pointerOver(rows[3]);

            // Assert
            expect(marker(container).style.transform).toBe(fromFocus);
            expect(marker(container).className).toContain(styles.markerOn);
            expect(rows[3].className).toContain(styles.rowActive);
        });

        it('should show the preview card for a hovered row', () => {
            // Arrange
            setup([FINE_POINTER_QUERY]);

            const rows = screen.getAllByRole('listitem');

            // Act
            fireEvent.pointerOver(rows[0]);

            // Assert
            expect(screen.getByText(`~/work/${projectsIndex[0].id}`)).toBeInTheDocument();
        });

        it('should not show the preview card for a keyboard-focused row', () => {
            // Arrange
            const { container } = setup([FINE_POINTER_QUERY]);
            const rows = screen.getAllByRole('listitem');

            // Act
            focus(rows[0]);

            // Assert
            expect(marker(container).className).toContain(styles.markerOn);
            expect(screen.queryByText(`~/work/${projectsIndex[0].id}`)).toBeNull();
        });
    });

    describe('touch', () => {
        it('should not render the preview card without a fine pointer', () => {
            // Arrange
            setup();

            const rows = screen.getAllByRole('listitem');

            // Act
            fireEvent.pointerOver(rows[0]);

            // Assert
            expect(screen.queryByText(`~/work/${projectsIndex[0].id}`)).toBeNull();
        });

        it('should still activate rows from the keyboard without a fine pointer', () => {
            // Arrange
            const { container } = setup();
            const rows = screen.getAllByRole('listitem');

            // Act
            focus(rows[2]);

            // Assert
            expect(marker(container).className).toContain(styles.markerOn);
        });
    });
});
