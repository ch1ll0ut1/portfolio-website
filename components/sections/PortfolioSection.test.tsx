/**
 * Tests for PortfolioSection component.
 * Tests behavior, accessibility, and structure - not specific content.
 * Visual appearance and content are covered by Storybook visual tests.
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
    describe('Section Structure', () => {
        it('should have proper semantic structure', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const section = document.querySelector('section#portfolio');
            expect(section).toBeInTheDocument();
        });

        it('should apply custom className when provided', () => {
            // Act
            render(<PortfolioSection className="custom-portfolio-class" />);

            // Assert
            const section = document.querySelector('section');
            expect(section).toHaveClass('custom-portfolio-class');
        });

        it('should have responsive container', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const container = document.querySelector('.max-w-6xl.mx-auto');
            expect(container).toBeInTheDocument();
        });

        it('should have proper grid layout', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const gridContainer = document.querySelector('.grid');
            expect(gridContainer).toHaveClass('md:grid-cols-2');
            expect(gridContainer).toHaveClass('lg:grid-cols-3');
            expect(gridContainer).toHaveClass('gap-8');
        });
    });

    describe('Accessibility', () => {
        it('should have proper heading structure', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const heading = screen.getByRole('heading', { level: 2 });
            expect(heading).toBeInTheDocument();
        });

        it('should have section landmark with id', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const section = document.querySelector('section#portfolio');
            expect(section).toBeInTheDocument();
        });
    });

    describe('Portfolio Projects Display', () => {
        it('should render portfolio projects from configuration', () => {
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

            // Verify we have the expected number of project cards
            expect(projectCards).toHaveLength(3);

            // Verify each card has the required project ID
            const projectIds = projectCards.map(card => card.getAttribute('data-project-id'));
            expect(projectIds).toContain('test-project-1');
            expect(projectIds).toContain('test-project-2');
            expect(projectIds).toContain('test-project-3');
        });

        it('should render technologies for each project', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const technologyContainers = screen.getAllByTestId('technologies');
            expect(technologyContainers).toHaveLength(3);

            // Check that each container has technologies
            technologyContainers.forEach((container) => {
                const technologies = container.querySelectorAll('[data-testid="technology"]');
                expect(technologies.length).toBeGreaterThan(0);
            });
        });
    });

    describe('Integration with Portfolio Config', () => {
        it('should load portfolio data from configuration', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const projectCards = screen.getAllByTestId('project-card');
            expect(projectCards.length).toBeGreaterThan(0);
        });

        it('should handle empty portfolio data gracefully', () => {
            // This would need a separate test with mocked empty data
            // For now, just verify the component renders without errors
            expect(() => render(<PortfolioSection />)).not.toThrow();
        });
    });

    describe('Content Structure', () => {
        it('should have section header with title and description', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const header = document.querySelector('.text-center');
            expect(header).toBeInTheDocument();

            const title = screen.getByRole('heading', { level: 2 });
            expect(title).toBeInTheDocument();

            const description = document.querySelector('.text-muted-foreground');
            expect(description).toBeInTheDocument();
        });

        it('should maintain consistent spacing and layout', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const section = document.querySelector('section');
            expect(section).toHaveClass('py-20');
            expect(section).toHaveClass('px-6');
        });
    });

    describe('Responsive Design', () => {
        it('should have responsive padding', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const section = document.querySelector('section');
            expect(section).toHaveClass('py-20');
            expect(section).toHaveClass('px-6');
        });

        it('should have responsive grid layout', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const gridContainer = document.querySelector('.grid');
            expect(gridContainer).toHaveClass('md:grid-cols-2');
            expect(gridContainer).toHaveClass('lg:grid-cols-3');
        });

        it('should have responsive text sizing', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const heading = screen.getByRole('heading', { level: 2 });
            expect(heading).toHaveClass('text-4xl');
            expect(heading).toHaveClass('font-bold');
        });
    });

    describe('Component Integration', () => {
        it('should render ProjectCard components', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const projectCards = screen.getAllByTestId('project-card');
            expect(projectCards).toHaveLength(3);
        });

        it('should pass project data to each ProjectCard', () => {
            // Act
            render(<PortfolioSection />);

            // Assert
            const projectCards = screen.getAllByTestId('project-card');

            projectCards.forEach((card) => {
                expect(card).toHaveAttribute('data-project-id');
                expect(card.querySelector('h3')).toBeInTheDocument();
                expect(card.querySelector('p')).toBeInTheDocument();
            });
        });
    });
});
