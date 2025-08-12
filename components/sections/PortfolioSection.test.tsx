/**
 * Tests for PortfolioSection component.
 * Tests behavior and public API, focusing on portfolio display and ProjectCard integration.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PortfolioSection } from './PortfolioSection';

// Mock the portfolio configuration
vi.mock('@/config/portfolio', () => ({
    portfolio: [
        {
            id: 'test-project-1',
            title: 'Test E-Commerce Platform',
            description: 'A comprehensive e-commerce solution built with modern technologies.',
            technologies: ['React', 'Node.js', 'PostgreSQL'],
            caseStudyUrl: 'https://example.com/case-study-1',
        },
        {
            id: 'test-project-2',
            title: 'Test Analytics Dashboard',
            description: 'An intelligent analytics platform for business insights.',
            technologies: ['Python', 'TensorFlow', 'Azure'],
            caseStudyUrl: 'https://example.com/case-study-2',
        },
        {
            id: 'test-project-3',
            title: 'Test Healthcare System',
            description: 'A HIPAA-compliant healthcare management solution.',
            technologies: ['C#/.NET', 'Angular', 'SQL Server'],
        },
    ],
}));

// Mock ProjectCard component
vi.mock('@/components/cards/ProjectCard', () => ({
    ProjectCard: ({ project }: { project: any }) => (
        <div data-testid="project-card" data-project-id={project.id}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div data-testid="technologies">
                {project.technologies.map((tech: string) => (
                    <span key={tech} data-testid="technology">{tech}</span>
                ))}
            </div>
        </div>
    ),
}));

describe('PortfolioSection Component', () => {
    describe('Content Display', () => {
        it('should display the main section title', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            expect(screen.getByText('Portfolio')).toBeInTheDocument();
        });

        it('should display the section description', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            expect(screen.getByText(/A selection of projects that showcase my expertise/)).toBeInTheDocument();
        });

        it('should display all project titles', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            expect(screen.getByText('Test E-Commerce Platform')).toBeInTheDocument();
            expect(screen.getByText('Test Analytics Dashboard')).toBeInTheDocument();
            expect(screen.getByText('Test Healthcare System')).toBeInTheDocument();
        });

        it('should display all project descriptions', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            expect(screen.getByText('A comprehensive e-commerce solution built with modern technologies.')).toBeInTheDocument();
            expect(screen.getByText('An intelligent analytics platform for business insights.')).toBeInTheDocument();
            expect(screen.getByText('A HIPAA-compliant healthcare management solution.')).toBeInTheDocument();
        });

        it('should display project technologies', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            expect(screen.getByText('React')).toBeInTheDocument();
            expect(screen.getByText('Node.js')).toBeInTheDocument();
            expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
            expect(screen.getByText('Python')).toBeInTheDocument();
            expect(screen.getByText('TensorFlow')).toBeInTheDocument();
            expect(screen.getByText('Azure')).toBeInTheDocument();
        });
    });

    describe('Styling and Layout', () => {
        it('should have correct section styling', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const section = document.querySelector('#portfolio');
            expect(section).toHaveClass('py-20');
            expect(section).toHaveClass('px-6');
            expect(section).toHaveClass('bg-white');
        });

        it('should apply custom className when provided', () => {
            // Act
            render(<PortfolioSection className="custom-portfolio-class" />);

            // Assert
            const section = document.querySelector('#portfolio');
            expect(section).toHaveClass('custom-portfolio-class');
        });

        it('should have correct container styling', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const container = document.querySelector('.max-w-6xl.mx-auto');
            expect(container).toBeInTheDocument();
        });

        it('should have correct grid layout for projects', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const grid = document.querySelector('.grid.md\\:grid-cols-2.lg\\:grid-cols-3.gap-8');
            expect(grid).toBeInTheDocument();
        });

        it('should have correct section header styling', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const headerContainer = document.querySelector('.text-center.mb-12');
            expect(headerContainer).toBeInTheDocument();
        });

        it('should have correct title styling', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const title = screen.getByText('Portfolio');
            expect(title).toHaveClass('text-4xl');
            expect(title).toHaveClass('font-bold');
            expect(title).toHaveClass('text-primary');
            expect(title).toHaveClass('mb-4');
        });

        it('should have correct description styling', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const description = screen.getByText(/A selection of projects that showcase my expertise/);
            expect(description).toHaveClass('text-xl');
            expect(description).toHaveClass('text-muted-foreground');
            expect(description).toHaveClass('max-w-3xl');
            expect(description).toHaveClass('mx-auto');
        });
    });

    describe('Semantic Structure', () => {
        it('should use proper heading hierarchy', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            expect(screen.getByRole('heading', { level: 2, name: 'Portfolio' })).toBeInTheDocument();
        });

        it('should have correct section element with id', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const section = document.querySelector('section#portfolio');
            expect(section).toBeInTheDocument();
            expect(section).toHaveAttribute('id', 'portfolio');
        });

        it('should have proper semantic structure for section header', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const title = screen.getByRole('heading', { level: 2 });
            const description = screen.getByText(/A selection of projects that showcase my expertise/);

            expect(title).toBeInTheDocument();
            expect(description.tagName.toLowerCase()).toBe('p');
        });
    });

    describe('Accessibility', () => {
        it('should have accessible heading structure', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const headings = screen.getAllByRole('heading');
            expect(headings.length).toBeGreaterThanOrEqual(1); // At least the main heading
        });

        it('should have descriptive section identifier', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const section = document.querySelector('section#portfolio');
            expect(section).toBeInTheDocument();
            expect(section).toHaveAttribute('id', 'portfolio');
        });

        it('should have proper description text structure', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const description = screen.getByText(/A selection of projects that showcase my expertise/);
            expect(description.tagName.toLowerCase()).toBe('p');
        });
    });

    describe('Integration with ProjectCard Components', () => {
        it('should render ProjectCard components for each project', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const projectCards = screen.getAllByTestId('project-card');
            expect(projectCards).toHaveLength(3);
        });

        it('should pass correct project data to ProjectCard components', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const projectCards = screen.getAllByTestId('project-card');

            expect(projectCards[0]).toHaveAttribute('data-project-id', 'test-project-1');
            expect(projectCards[1]).toHaveAttribute('data-project-id', 'test-project-2');
            expect(projectCards[2]).toHaveAttribute('data-project-id', 'test-project-3');
        });

        it('should pass complete project objects to ProjectCard components', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            // Verify that project data is passed correctly by checking rendered content
            expect(screen.getByText('Test E-Commerce Platform')).toBeInTheDocument();
            expect(screen.getByText('Test Analytics Dashboard')).toBeInTheDocument();
            expect(screen.getByText('Test Healthcare System')).toBeInTheDocument();
        });

        it('should render projects in correct order', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const projectCards = screen.getAllByTestId('project-card');
            expect(projectCards[0]).toHaveAttribute('data-project-id', 'test-project-1');
            expect(projectCards[1]).toHaveAttribute('data-project-id', 'test-project-2');
            expect(projectCards[2]).toHaveAttribute('data-project-id', 'test-project-3');
        });
    });

    describe('Project Grid Layout', () => {
        it('should have responsive grid layout', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const grid = document.querySelector('.grid');
            expect(grid).toHaveClass('md:grid-cols-2');
            expect(grid).toHaveClass('lg:grid-cols-3');
            expect(grid).toHaveClass('gap-8');
        });

        it('should contain all project cards within grid', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const grid = document.querySelector('.grid.md\\:grid-cols-2.lg\\:grid-cols-3.gap-8');
            const projectCards = screen.getAllByTestId('project-card');

            expect(grid).toBeInTheDocument();
            expect(projectCards).toHaveLength(3);
            // All project cards should be descendants of the grid
            projectCards.forEach((card) => {
                expect(grid).toContainElement(card);
            });
        });
    });

    describe('Edge Cases and Data Handling', () => {
        it('should handle projects with different technology arrays', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const technologyContainers = screen.getAllByTestId('technologies');
            expect(technologyContainers).toHaveLength(3);

            // Check that each project has its technologies rendered
            const technologies = screen.getAllByTestId('technology');
            expect(technologies.length).toBeGreaterThan(0);
        });

        it('should handle projects with and without case study URLs', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            // All projects should render regardless of having caseStudyUrl
            const projectCards = screen.getAllByTestId('project-card');
            expect(projectCards).toHaveLength(3);
        });

        it('should maintain unique keys for project mapping', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const projectCards = screen.getAllByTestId('project-card');
            const projectIds = projectCards.map(card => card.getAttribute('data-project-id'));
            const uniqueIds = [...new Set(projectIds)];

            expect(uniqueIds).toHaveLength(projectIds.length); // No duplicate IDs
        });
    });

    describe('Section Header Component', () => {
        it('should render section header with correct structure', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const headerDiv = document.querySelector('.text-center.mb-12');
            const title = screen.getByText('Portfolio');
            const description = screen.getByText(/A selection of projects that showcase my expertise/);

            expect(headerDiv).toBeInTheDocument();
            expect(headerDiv).toContainElement(title);
            expect(headerDiv).toContainElement(description);
        });

        it('should have proper spacing between title and description', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const title = screen.getByText('Portfolio');
            expect(title).toHaveClass('mb-4');
        });
    });
});
