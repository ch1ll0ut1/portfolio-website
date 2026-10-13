/**
 * Tests for the ReadingShell component.
 * Covers the landmark it owns, and that it adds no chrome of its own: the nav
 * and footer come from the root layout.
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

    it('should leave the site chrome to the root layout', () => {
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
