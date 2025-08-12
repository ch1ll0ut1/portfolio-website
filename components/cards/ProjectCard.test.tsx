/**
 * Tests for ProjectCard component.
 * Tests behavior and public API, focusing on project data display and card functionality.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectCard } from './ProjectCard';
import type { PortfolioProject } from '@/config/portfolio';

// Mock UI components
vi.mock('@/components/ui/Card', () => ({
    Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div data-slot="card" className={className}>{children}</div>
    ),
    CardHeader: ({ children }: { children: React.ReactNode }) => (
        <div data-slot="card-header">{children}</div>
    ),
    CardTitle: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <h3 data-slot="card-title" className={className}>{children}</h3>
    ),
    CardDescription: ({ children }: { children: React.ReactNode }) => (
        <p data-slot="card-description">{children}</p>
    ),
    CardContent: ({ children }: { children: React.ReactNode }) => (
        <div data-slot="card-content">{children}</div>
    ),
}));

vi.mock('@/components/ui/Badge', () => ({
    Badge: ({ children, variant }: { children: React.ReactNode; variant?: string }) => (
        <span data-testid="badge" data-variant={variant}>{children}</span>
    ),
}));

vi.mock('@/components/ui/Button', () => ({
    Button: ({ children, variant, size, className }: {
        children: React.ReactNode;
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
    description: 'A comprehensive e-commerce solution built with modern technologies for scalable online retail.',
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
    describe('Content Display', () => {
        it('should display project title', () => {
            // Act
            render(<ProjectCard project={mockProject} />);

            // Assert
            expect(screen.getByText('Test E-Commerce Platform')).toBeInTheDocument();
        });

        it('should display project description', () => {
            // Act
            render(<ProjectCard project={mockProject} />);

            // Assert
            expect(screen.getByText('A comprehensive e-commerce solution built with modern technologies for scalable online retail.')).toBeInTheDocument();
        });

        it('should display all project technologies as badges', () => {
            // Act
            render(<ProjectCard project={mockProject} />);

            // Assert
            expect(screen.getByText('React')).toBeInTheDocument();
            expect(screen.getByText('Node.js')).toBeInTheDocument();
            expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
            expect(screen.getByText('AWS')).toBeInTheDocument();
        });

        it('should display CTA button with correct text', () => {
            // Act
            render(<ProjectCard project={mockProject} />);

            // Assert
            expect(screen.getByText('View Case Study')).toBeInTheDocument();
        });

        it('should display external link icon', () => {
            // Act
            render(<ProjectCard project={mockProject} />);

            // Assert
            expect(screen.getByTestId('external-link-icon')).toBeInTheDocument();
        });
    });

    describe('Styling and Layout', () => {
        it('should have correct card styling classes', () => {
            // Act
            render(<ProjectCard project={mockProject} />);

            // Assert
            const card = document.querySelector('[data-slot="card"]');
            expect(card).toHaveClass('border-0');
            expect(card).toHaveClass('shadow-lg');
            expect(card).toHaveClass('hover:shadow-xl');
            expect(card).toHaveClass('transition-shadow');
        });

        it('should apply custom className when provided', () => {
            // Act
            render(<ProjectCard project={mockProject} className="custom-project-class" />);

            // Assert
            const card = document.querySelector('[data-slot="card"]');
            expect(card).toHaveClass('custom-project-class');
        });

        it('should have correct title styling', () => {
            // Act
            render(<ProjectCard project={mockProject} />);

            // Assert
            const title = document.querySelector('[data-slot="card-title"]');
            expect(title).toHaveClass('text-xl');
        });

        it('should have correct button styling', () => {
            // Act
            render(<ProjectCard project={mockProject} />);

            // Assert
            const button = screen.getByTestId('project-button');
            expect(button).toHaveAttribute('data-variant', 'outline');
            expect(button).toHaveAttribute('data-size', 'sm');
            expect(button).toHaveClass('w-full');
            expect(button).toHaveClass('bg-transparent');
        });

        it('should have correct icon styling', () => {
            // Act
            render(<ProjectCard project={mockProject} />);

            // Assert
            const icon = screen.getByTestId('external-link-icon');
            expect(icon).toHaveClass('ml-2');
            expect(icon).toHaveClass('h-4');
            expect(icon).toHaveClass('w-4');
        });
    });

    describe('Semantic Structure', () => {
        it('should use proper heading for project title', () => {
            // Act
            render(<ProjectCard project={mockProject} />);

            // Assert
            const title = document.querySelector('[data-slot="card-title"]');
            expect(title?.tagName.toLowerCase()).toBe('h3');
            expect(title).toHaveTextContent('Test E-Commerce Platform');
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
            expect(card).toContainElement(header);
            expect(card).toContainElement(content);
        });
    });

    describe('Accessibility', () => {
        it('should have proper heading structure', () => {
            // Act
            render(<ProjectCard project={mockProject} />);

            // Assert
            const title = screen.getByRole('heading', { level: 3 });
            expect(title).toHaveTextContent('Test E-Commerce Platform');
        });

        it('should have accessible button', () => {
            // Act
            render(<ProjectCard project={mockProject} />);

            // Assert
            const button = screen.getByRole('button', { name: /View Case Study/ });
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

        it('should use secondary variant for technology badges', () => {
            // Act
            render(<ProjectCard project={mockProject} />);

            // Assert
            const badges = screen.getAllByTestId('badge');
            badges.forEach((badge) => {
                expect(badge).toHaveAttribute('data-variant', 'secondary');
            });
        });

        it('should have proper spacing for technologies', () => {
            // Act
            render(<ProjectCard project={mockProject} />);

            // Assert
            const technologiesContainer = document.querySelector('.flex.flex-wrap.gap-2.mb-4');
            expect(technologiesContainer).toBeInTheDocument();
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
            expect(screen.getByText('React')).toBeInTheDocument();
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
        it('should render CTA button with correct text', () => {
            // Act
            render(<ProjectCard project={mockProject} />);

            // Assert
            const button = screen.getByRole('button');
            expect(button).toHaveTextContent('View Case Study');
        });

        it('should include external link icon in button', () => {
            // Act
            render(<ProjectCard project={mockProject} />);

            // Assert
            const button = screen.getByRole('button');
            const icon = screen.getByTestId('external-link-icon');
            expect(button).toContainElement(icon);
        });

        it('should have correct button styling properties', () => {
            // Act
            render(<ProjectCard project={mockProject} />);

            // Assert
            const button = screen.getByTestId('project-button');
            expect(button).toHaveAttribute('data-variant', 'outline');
            expect(button).toHaveAttribute('data-size', 'sm');
            expect(button).toHaveClass('w-full');
            expect(button).toHaveClass('bg-transparent');
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

        it('should pass correct props to Badge components', () => {
            // Act
            render(<ProjectCard project={mockProject} />);

            // Assert
            const badges = screen.getAllByTestId('badge');
            badges.forEach((badge) => {
                expect(badge).toHaveAttribute('data-variant', 'secondary');
            });
        });

        it('should pass correct props to Button component', () => {
            // Act
            render(<ProjectCard project={mockProject} />);

            // Assert
            const button = screen.getByTestId('project-button');
            expect(button).toHaveAttribute('data-variant', 'outline');
            expect(button).toHaveAttribute('data-size', 'sm');
        });
    });

    describe('Edge Cases and Props Handling', () => {
        it('should handle project without caseStudyUrl', () => {
            // Act
            render(<ProjectCard project={mockProjectWithoutCaseStudy} />);

            // Assert
            expect(screen.getByText('Test Analytics Dashboard')).toBeInTheDocument();
            expect(screen.getByText('View Case Study')).toBeInTheDocument(); // Button still shows
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

            // Technologies container should still exist
            const technologiesContainer = document.querySelector('.flex.flex-wrap.gap-2.mb-4');
            expect(technologiesContainer).toBeInTheDocument();
        });

        it('should handle very long project title', () => {
            // Arrange
            const longTitleProject: PortfolioProject = {
                ...mockProject,
                title: 'This is a very long project title that might wrap to multiple lines and test layout handling',
            };

            // Act
            render(<ProjectCard project={longTitleProject} />);

            // Assert
            expect(screen.getByText('This is a very long project title that might wrap to multiple lines and test layout handling')).toBeInTheDocument();
        });

        it('should handle very long description', () => {
            // Arrange
            const longDescProject: PortfolioProject = {
                ...mockProject,
                description: 'This is a very long project description that contains many details about the project implementation, technologies used, challenges faced, and solutions implemented to test how the card handles extensive content.',
            };

            // Act
            render(<ProjectCard project={longDescProject} />);

            // Assert
            expect(screen.getByText(/This is a very long project description that contains many details/)).toBeInTheDocument();
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
    });
});
