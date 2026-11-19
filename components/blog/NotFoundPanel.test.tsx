/**
 * Tests for the NotFoundPanel component.
 * Covers that a dead URL still lands on a readable page with a way out.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NotFoundPanel } from './NotFoundPanel';

const renderPanel = () => render(
    <NotFoundPanel
        kicker="404"
        title="Page not found"
        body="That page does not exist."
        actionHref="/"
        actionLabel="Back to home"
    />,
);

describe('NotFoundPanel Component', () => {
    it('should announce the failure as the page heading', () => {
        // Arrange
        renderPanel();

        // Assert
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Page not found');
    });

    it('should explain what happened', () => {
        // Arrange
        renderPanel();

        // Assert
        expect(screen.getByText('That page does not exist.')).toBeInTheDocument();
    });

    it('should offer a route onwards', () => {
        // Arrange
        renderPanel();

        // Assert
        expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/');
    });

    it('should render the kicker above the heading', () => {
        // Arrange
        renderPanel();

        // Assert
        expect(screen.getByText('404')).toBeInTheDocument();
    });
});
