/**
 * Tests for ProjectCard component.
 * Tests behavior, accessibility, and edge cases - not content or styling.
 * Visual appearance is covered by Storybook visual tests.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { PortfolioProject } from '@/config/portfolio';
import { ReactNode } from 'react';
import { ProjectCard } from './ProjectCard';

// Mock UI components
vi.mock('@/components/ui/Card', () => ({
    Card: ({ children, className }: { children: ReactNode; className?: string }) => (
        <div data-slot="card" className={className}>{children}</div>
    ),
    CardHeader: ({ children }: { children: ReactNode }) => (
        <div data-slot="card-header">{children}</div>
    ),
    CardTitle: ({ children, className }: { children: ReactNode; className?: string }) => (
        <h3 data-slot="card-title" className={className}>{children}</h3>
    ),
    CardDescription: ({ children }: { children: ReactNode }) => (
        <p data-slot="card-description">{children}</p>
    ),
    CardContent: ({ children }: { children: ReactNode }) => (
        <div data-slot="card-content">{children}</div>
    ),
}));

vi.mock('@/components/ui/Badge', () => ({
    Badge: ({ children, variant }: { children: ReactNode; variant?: string }) => (
        <span data-testid="badge" data-variant={variant}>{children}</span>
    ),
}));

vi.mock('@/components/ui/Button', () => ({
    Button: ({ children, variant, size, className }: {
        children: ReactNode;
        variant?: string;
        size?: string;
        className?: string;
    }) => (
        <button
            data-testid="project-button"
            data-variant={variant}
            data-size={size}
            className={className}
        >
            {children}
        </button>
    ),
}));

// Mock Lucide icon
vi.mock('lucide-react', () => ({
    ExternalLink: ({ className }: { className?: string }) => (
        <svg data-testid="external-link-icon" className={className}>
            <title>External Link</title>
        </svg>
    ),
}));

const mockProject: PortfolioProject = {
    id: 'test-project',
    title: 'Test E-Commerce Platform',
    description: 'A comprehensive e-commerce solution built with modern technologies.',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    caseStudyUrl: 'https://example.com/case-study',
};

const mockProjectWithoutCaseStudy: PortfolioProject = {
    id: 'test-project-no-url',
    title: 'Test Analytics Dashboard',
    description: 'An intelligent analytics platform for business insights.',
    technologies: ['Python', 'TensorFlow'],
};

describe('ProjectCard Component', () => {
    describe('Semantic Structure', () => {
        it('should use proper heading for project title', () => {
            // Act
            render(<ProjectCard project={mockProject} />);

            // Assert
            const title = document.querySelector('[data-slot="card-title"]');
            expect(title?.tagName.toLowerCase()).toBe('h3');
        });

        it('should use paragraph for project description', () => {
            // Act
            render(<ProjectCard project={mockProject} />);

            // Assert
            const description = document.querySelector('[data-slot="card-description"]');
            expect(description?.tagName.toLowerCase()).toBe('p');
        });

        it('should have proper card structure', () => {
            // Act
            render(<ProjectCard project={mockProject} />);

            // Assert
            const card = document.querySelector('[data-slot="card"]');
            const header = document.querySelector('[data-slot="card-header"]');
            const content = document.querySelector('[data-slot="card-content"]');

            expect(card).toBeInTheDocument();
            expect(header).toBeInTheDocument();
            expect(content).toBeInTheDocument();
            expect(card).toContainElement(header as HTMLElement);
            expect(card).toContainElement(content as HTMLElement);
        });
    });

    describe('Accessibility', () => {
        it('should have proper heading structure', () => {
            // Act
            render(<ProjectCard project={mockProject} />);

            // Assert
            const title = screen.getByRole('heading', { level: 3 });
            expect(title).toBeInTheDocument();
        });

        it('should have accessible button', () => {
            // Act
            render(<ProjectCard project={mockProject} />);

            // Assert
            const button = screen.getByRole('button');
            expect(button).toBeInTheDocument();
        });

        it('should have descriptive icon', () => {
            // Act
            render(<ProjectCard project={mockProject} />);

            // Assert
            const icon = screen.getByTestId('external-link-icon');
            expect(icon).toBeInTheDocument();
            // Icon should have a title for screen readers
            expect(screen.getByTitle('External Link')).toBeInTheDocument();
        });
    });

    describe('Technologies Display', () => {
        it('should render all technologies as badges', () => {
            // Act
            render(<ProjectCard project={mockProject} />);

            // Assert
            const badges = screen.getAllByTestId('badge');
            expect(badges).toHaveLength(4);
        });

        it('should handle single technology', () => {
            // Arrange
            const singleTechProject: PortfolioProject = {
                ...mockProject,
                technologies: ['React'],
            };

            // Act
            render(<ProjectCard project={singleTechProject} />);

            // Assert
            const badges = screen.getAllByTestId('badge');
            expect(badges).toHaveLength(1);
        });

        it('should handle many technologies', () => {
            // Arrange
            const manyTechProject: PortfolioProject = {
                ...mockProject,
                technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'TypeScript', 'Docker', 'Kubernetes'],
            };

            // Act
            render(<ProjectCard project={manyTechProject} />);

            // Assert
            const badges = screen.getAllByTestId('badge');
            expect(badges).toHaveLength(7);
        });
    });

    describe('CTA Button Functionality', () => {
        it('should render CTA button', () => {
            // Act
            render(<ProjectCard project={mockProject} />);

            // Assert
            const button = screen.getByRole('button');
            expect(button).toBeInTheDocument();
        });

        it('should include external link icon in button', () => {
            // Act
            render(<ProjectCard project={mockProject} />);

            // Assert
            const button = screen.getByRole('button');
            const icon = screen.getByTestId('external-link-icon');
            expect(button).toContainElement(icon);
        });
    });

    describe('Integration with Child Components', () => {
        it('should render Card components correctly', () => {
            // Act
            render(<ProjectCard project={mockProject} />);

            // Assert
            expect(document.querySelector('[data-slot="card"]')).toBeInTheDocument();
            expect(document.querySelector('[data-slot="card-header"]')).toBeInTheDocument();
            expect(document.querySelector('[data-slot="card-content"]')).toBeInTheDocument();
            expect(document.querySelector('[data-slot="card-title"]')).toBeInTheDocument();
            expect(document.querySelector('[data-slot="card-description"]')).toBeInTheDocument();
        });
    });

    describe('Edge Cases and Props Handling', () => {
        it('should handle project without caseStudyUrl', () => {
            // Act & Assert - should render without errors
            expect(() => render(<ProjectCard project={mockProjectWithoutCaseStudy} />)).not.toThrow();

            // Should still render the card structure
            const card = document.querySelector('[data-slot="card"]');
            expect(card).toBeInTheDocument();
        });

        it('should handle empty technologies array', () => {
            // Arrange
            const noTechProject: PortfolioProject = {
                ...mockProject,
                technologies: [],
            };

            // Act
            render(<ProjectCard project={noTechProject} />);

            // Assert
            const badges = screen.queryAllByTestId('badge');
            expect(badges).toHaveLength(0);
        });

        it('should handle very long project title', () => {
            // Arrange
            const longTitleProject: PortfolioProject = {
                ...mockProject,
                title: 'This is a very long project title that might wrap to multiple lines and test layout handling',
            };

            // Act & Assert
            expect(() => render(<ProjectCard project={longTitleProject} />)).not.toThrow();
        });

        it('should handle very long description', () => {
            // Arrange
            const longDescProject: PortfolioProject = {
                ...mockProject,
                description: 'This is a very long project description that contains many details about the project implementation, technologies used, challenges faced, and solutions implemented to test how the card handles extensive content.',
            };

            // Act & Assert
            expect(() => render(<ProjectCard project={longDescProject} />)).not.toThrow();
        });

        it('should maintain unique keys for technology mapping', () => {
            // Act
            render(<ProjectCard project={mockProject} />);

            // Assert
            const badges = screen.getAllByTestId('badge');
            const badgeTexts = badges.map(badge => badge.textContent);
            const uniqueTexts = [...new Set(badgeTexts)];

            expect(uniqueTexts).toHaveLength(badgeTexts.length); // No duplicates
        });

        it('should handle custom className prop', () => {
            // Act
            render(<ProjectCard project={mockProject} className="custom-project-class" />);

            // Assert
            const card = document.querySelector('[data-slot="card"]');
            expect(card).toHaveClass('custom-project-class');
        });
    });
});
