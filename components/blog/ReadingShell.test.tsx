/**
 * Tests for the ReadingShell component.
 * Covers the landmark it owns and the header/footer slots the real site chrome
 * is dropped into.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReadingShell } from './ReadingShell';

describe('ReadingShell Component', () => {
    it('should render its children inside the main landmark', () => {
        // Arrange
        render(
            <ReadingShell>
                <p>Page content</p>
            </ReadingShell>,
        );

        // Assert
        const main = screen.getByRole('main');
        expect(main).toHaveAttribute('id', 'main');
        expect(main).toHaveTextContent('Page content');
    });

    it('should render the header and footer slots around the content', () => {
        // Arrange
        render(
            <ReadingShell
                header={<nav aria-label="Site">Nav</nav>}
                footer={<footer>Footer</footer>}
            >
                <p>Page content</p>
            </ReadingShell>,
        );

        // Assert
        expect(screen.getByRole('navigation', { name: 'Site' })).toBeInTheDocument();
        expect(screen.getByRole('contentinfo')).toHaveTextContent('Footer');
    });

    it('should read without site chrome so the slots stay optional', () => {
        // Arrange
        render(
            <ReadingShell>
                <p>Page content</p>
            </ReadingShell>,
        );

        // Assert
        expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
        expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
    });
});
