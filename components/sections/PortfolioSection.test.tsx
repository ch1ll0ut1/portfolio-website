/**
 * Tests for PortfolioSection component.
 * Tests behavior, accessibility, and structure without content-specific assertions.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PortfolioSection } from './PortfolioSection';

// Mock the portfolio configuration with minimal test data
vi.mock('@/config/portfolio', () => ({
    portfolio: [
        {
            id: 'test-project-1',
            title: 'Test Project',
            description: 'Test description',
            technologies: ['Test Tech'],
            caseStudyUrl: 'https://example.com',
        },
    ],
}));

// Mock ProjectCard component
vi.mock('@/components/cards/ProjectCard', () => ({
    ProjectCard: ({ project }: { project: any }) => (
        <div data-testid="project-card" data-project-id={project.id}>
            {project.title}
        </div>
    ),
}));

describe('PortfolioSection Component', () => {
    it('should render section element with proper structure', () => {
        render(<PortfolioSection />);

        const section = document.querySelector('#portfolio');
        expect(section).toBeInTheDocument();
        expect(section?.tagName).toBe('SECTION');
    });

    it('should have responsive layout structure', () => {
        render(<PortfolioSection />);

        const container = document.querySelector('.max-w-6xl.mx-auto');
        const grid = document.querySelector('.grid');

        expect(container).toBeInTheDocument();
        expect(grid).toBeInTheDocument();
    });

    it('should handle custom className prop', () => {
        render(<PortfolioSection className="custom-class" />);

        const section = document.querySelector('#portfolio');
        expect(section).toHaveClass('custom-class');
    });

    it('should use proper heading hierarchy', () => {
        render(<PortfolioSection />);

        const heading = screen.getByRole('heading', { level: 2 });
        expect(heading).toBeInTheDocument();
        expect(heading.tagName).toBe('H2');
    });

    it('should render ProjectCard components from configuration', () => {
        render(<PortfolioSection />);

        const projectCards = screen.getAllByTestId('project-card');
        expect(projectCards.length).toBeGreaterThan(0);
    });

    it('should render dynamic content from configuration', () => {
        render(<PortfolioSection />);

        // Should adapt to configuration data
        const projectCards = screen.getAllByTestId('project-card');
        expect(projectCards.length).toBeGreaterThan(0);
    });
});
