/**
 * Tests for ExperienceSection component.
 * Tests behavior, accessibility, and structure without content-specific assertions.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExperienceSection } from './ExperienceSection';

// Mock the experience configuration with varied data for testing
vi.mock('@/config/experience', () => ({
    experience: {
        technicalSkills: [
            {
                name: 'Category A',
                skills: ['Skill 1', 'Skill 2', 'Skill 3'],
            },
            {
                name: 'Category B',
                skills: ['Skill A', 'Skill B'],
            },
        ],
        leadershipItems: [
            {
                title: 'Leadership Item 1',
                description: 'Description for first leadership item',
            },
            {
                title: 'Leadership Item 2',
                description: 'Description for second leadership item',
            },
        ],
    },
}));

// Mock Badge component
vi.mock('@/components/ui/Badge', () => ({
    Badge: ({ children, variant }: { children: React.ReactNode; variant?: string }) => (
        <span data-testid="badge" data-variant={variant}>
            {children}
        </span>
    ),
}));

describe('ExperienceSection Component', () => {
    describe('Component Structure', () => {
        it('should render correctly with experience data', () => {
            // Act
            render(<ExperienceSection />);

            // Assert - Check that component renders without errors
            const section = document.querySelector('section');
            expect(section).toBeInTheDocument();
        });

        it('should render all skill categories from configuration', () => {
            // Act
            render(<ExperienceSection />);

            // Assert - Should render the correct number of skill categories
            const categoryHeadings = screen.getAllByRole('heading', { level: 4 });
            // 2 skill categories + 2 leadership items = 4 h4 headings
            expect(categoryHeadings).toHaveLength(4);
        });

        it('should render all skills as badges', () => {
            // Act
            render(<ExperienceSection />);

            // Assert - Should render 5 badges total (3 + 2 skills)
            const badges = screen.getAllByTestId('badge');
            expect(badges).toHaveLength(5);
        });

        it('should render all leadership items', () => {
            // Act
            render(<ExperienceSection />);

            // Assert - Should render 2 leadership items with bullet points
            const bulletPoints = document.querySelectorAll('.w-2.h-2.bg-action.rounded-full.mt-2');
            expect(bulletPoints).toHaveLength(2);
        });
    });

    describe('Styling and Layout', () => {
        it('should have correct section styling', () => {
            // Act
            render(<ExperienceSection />);

            // Assert
            const section = document.querySelector('#experience');
            expect(section).toHaveClass('py-20');
            expect(section).toHaveClass('px-6');
            expect(section).toHaveClass('bg-white');
        });

        it('should apply custom className when provided', () => {
            // Act
            render(<ExperienceSection className="custom-experience-class" />);

            // Assert
            const section = document.querySelector('#experience');
            expect(section).toHaveClass('custom-experience-class');
        });

        it('should have correct container styling', () => {
            // Act
            render(<ExperienceSection />);

            // Assert
            const container = document.querySelector('.max-w-6xl.mx-auto');
            expect(container).toBeInTheDocument();
        });

        it('should have correct grid layout for sections', () => {
            // Act
            render(<ExperienceSection />);

            // Assert
            const grid = document.querySelector('.grid.md\\:grid-cols-2.gap-12');
            expect(grid).toBeInTheDocument();
        });

        it('should have correct main title styling', () => {
            // Act
            render(<ExperienceSection />);

            // Assert
            const mainTitle = screen.getByRole('heading', { level: 2 });
            expect(mainTitle).toHaveClass('text-4xl');
            expect(mainTitle).toHaveClass('font-bold');
            expect(mainTitle).toHaveClass('text-primary');
            expect(mainTitle).toHaveClass('mb-12');
            expect(mainTitle).toHaveClass('text-center');
        });

        it('should have correct subsection title styling', () => {
            // Act
            render(<ExperienceSection />);

            // Assert
            const subsectionTitles = screen.getAllByRole('heading', { level: 3 });

            subsectionTitles.forEach((title) => {
                expect(title).toHaveClass('text-2xl');
                expect(title).toHaveClass('font-semibold');
                expect(title).toHaveClass('text-primary');
                expect(title).toHaveClass('mb-6');
            });
        });
    });

    describe('Semantic Structure', () => {
        it('should use proper heading hierarchy', () => {
            // Act
            render(<ExperienceSection />);

            // Assert
            const h2Headings = screen.getAllByRole('heading', { level: 2 });
            const h3Headings = screen.getAllByRole('heading', { level: 3 });
            const h4Headings = screen.getAllByRole('heading', { level: 4 });

            expect(h2Headings).toHaveLength(1); // Main section title
            expect(h3Headings).toHaveLength(2); // Technical Skills and Leadership sections
            expect(h4Headings).toHaveLength(4); // 2 skill categories + 2 leadership items
        });

        it('should have correct section element with id', () => {
            // Act
            render(<ExperienceSection />);

            // Assert
            const section = document.querySelector('section#experience');
            expect(section).toBeInTheDocument();
            expect(section).toHaveAttribute('id', 'experience');
        });

        it('should use section element as the root container', () => {
            // Act
            render(<ExperienceSection />);

            // Assert
            const section = document.querySelector('section#experience');
            expect(section?.tagName).toBe('SECTION');
        });

        it('should have proper heading structure for data-driven content', () => {
            // Act
            render(<ExperienceSection />);

            // Assert
            const allHeadings = screen.getAllByRole('heading');
            expect(allHeadings).toHaveLength(7); // 1 h2 + 2 h3 + 4 h4

            // Verify heading hierarchy is maintained
            const headingLevels = allHeadings.map(heading =>
                parseInt(heading.tagName.charAt(1)),
            );
            expect(headingLevels).toEqual([2, 3, 4, 4, 3, 4, 4]);
        });
    });

    describe('Accessibility', () => {
        it('should have accessible heading structure', () => {
            // Act
            render(<ExperienceSection />);

            // Assert
            const headings = screen.getAllByRole('heading');
            expect(headings).toHaveLength(7); // 1 h2, 2 h3, 4 h4

            // Verify no heading levels are skipped
            const headingLevels = headings.map(h => parseInt(h.tagName.charAt(1)));
            const uniqueLevels = [...new Set(headingLevels)].sort();
            expect(uniqueLevels).toEqual([2, 3, 4]);
        });

        it('should have descriptive section identifier', () => {
            // Act
            render(<ExperienceSection />);

            // Assert
            const section = document.querySelector('section#experience');
            expect(section).toBeInTheDocument();
            expect(section).toHaveAttribute('id', 'experience');
        });

        it('should be navigable by screen readers', () => {
            // Act
            render(<ExperienceSection />);

            // Assert
            const region = document.querySelector('section#experience');
            expect(region).toBeInTheDocument();
            expect(region).toHaveAttribute('id', 'experience');
        });

        it('should use secondary variant for skill badges', () => {
            // Act
            render(<ExperienceSection />);

            // Assert
            const badges = screen.getAllByTestId('badge');
            badges.forEach((badge) => {
                expect(badge).toHaveAttribute('data-variant', 'secondary');
            });
        });

        it('should have visual indicators for leadership items', () => {
            // Act
            render(<ExperienceSection />);

            // Assert
            const bulletPoints = document.querySelectorAll('.w-2.h-2.bg-action.rounded-full.mt-2');
            expect(bulletPoints).toHaveLength(2); // One for each leadership item
        });

        it('should have proper spacing for readability', () => {
            // Act
            render(<ExperienceSection />);

            // Assert
            const spacedContainers = document.querySelectorAll('.space-y-4');
            expect(spacedContainers.length).toBeGreaterThan(0);
        });

        it('should maintain responsive design structure', () => {
            // Act
            render(<ExperienceSection />);

            // Assert
            const responsiveGrid = document.querySelector('.md\\:grid-cols-2');
            expect(responsiveGrid).toBeInTheDocument();
        });
    });

    describe('Integration with Child Components', () => {
        it('should render Badge components for all skills', () => {
            // Act
            render(<ExperienceSection />);

            // Assert
            const badges = screen.getAllByTestId('badge');
            expect(badges).toHaveLength(5); // 3 + 2 skills from mock data
        });

        it('should pass correct props to Badge components', () => {
            // Act
            render(<ExperienceSection />);

            // Assert
            const badges = screen.getAllByTestId('badge');
            badges.forEach((badge) => {
                expect(badge).toHaveAttribute('data-variant', 'secondary');
            });
        });

        it('should render skill categories with proper flex layout', () => {
            // Act
            render(<ExperienceSection />);

            // Assert
            const skillContainers = document.querySelectorAll('.flex.flex-wrap.gap-2');
            expect(skillContainers).toHaveLength(2); // One for each skill category
        });

        it('should render leadership items with proper visual structure', () => {
            // Act
            render(<ExperienceSection />);

            // Assert
            const leadershipItems = document.querySelectorAll('.flex.items-start.gap-3');
            expect(leadershipItems).toHaveLength(2); // One for each leadership item
        });

        it('should render all configured skills dynamically', () => {
            // Act
            render(<ExperienceSection />);

            // Assert - Total skills should match mock configuration
            const badges = screen.getAllByTestId('badge');
            expect(badges.length).toBe(5); // Matches total skills in mock
        });
    });

    describe('Edge Cases and Props Handling', () => {
        it('should render with minimal props', () => {
            // Act
            render(<ExperienceSection />);

            // Assert - Component should render without any required props
            const section = document.querySelector('#experience');
            expect(section).toBeInTheDocument();
        });

        it('should handle className prop correctly', () => {
            // Act
            const customClass = 'test-custom-class';
            render(<ExperienceSection className={customClass} />);

            // Assert
            const section = document.querySelector('#experience');
            expect(section).toHaveClass(customClass);
        });

        it('should maintain data structure integrity', () => {
            // Act
            render(<ExperienceSection />);

            // Assert - Skills should be properly grouped by category
            const categoryHeadings = screen.getAllByRole('heading', { level: 4 });
            const skillCategories = categoryHeadings.slice(0, 2); // First 2 are skill categories
            const leadershipItems = categoryHeadings.slice(2); // Last 2 are leadership items

            expect(skillCategories).toHaveLength(2);
            expect(leadershipItems).toHaveLength(2);
        });

        it('should handle dynamic data rendering', () => {
            // Act
            render(<ExperienceSection />);

            // Assert - Component should adapt to different data sizes
            const badges = screen.getAllByTestId('badge');
            const bulletPoints = document.querySelectorAll('.w-2.h-2.bg-action.rounded-full.mt-2');

            // Should render correct number of elements based on data
            expect(badges.length).toBeGreaterThan(0);
            expect(bulletPoints.length).toBeGreaterThan(0);
        });

        it('should maintain consistent layout structure', () => {
            // Act
            render(<ExperienceSection />);

            // Assert - Layout containers should be present regardless of content
            const mainContainer = document.querySelector('.max-w-6xl.mx-auto');
            const gridContainer = document.querySelector('.grid.md\\:grid-cols-2.gap-12');

            expect(mainContainer).toBeInTheDocument();
            expect(gridContainer).toBeInTheDocument();
        });
    });
});
