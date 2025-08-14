/**
 * Tests for ExperienceSection component.
 * Tests behavior, accessibility, and structure without content-specific assertions.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExperienceSection } from './ExperienceSection';

// Mock the experience configuration with minimal test data
vi.mock('@/config/experience', () => ({
    experience: {
        technicalSkills: [
            {
                name: 'Test Category',
                skills: ['Test Skill'],
            },
        ],
        leadershipItems: [
            {
                title: 'Test Leadership',
                description: 'Test description',
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
    it('should render section element with proper structure', () => {
        render(<ExperienceSection />);

        const section = document.querySelector('#experience');
        expect(section).toBeInTheDocument();
        expect(section?.tagName).toBe('SECTION');
    });

    it('should have responsive layout structure', () => {
        render(<ExperienceSection />);

        const container = document.querySelector('.max-w-6xl.mx-auto');
        const grid = document.querySelector('.grid.md\\:grid-cols-2.gap-12');

        expect(container).toBeInTheDocument();
        expect(grid).toBeInTheDocument();
    });

    it('should handle custom className prop', () => {
        render(<ExperienceSection className="custom-class" />);

        const section = document.querySelector('#experience');
        expect(section).toHaveClass('custom-class');
    });

    it('should use proper heading hierarchy', () => {
        render(<ExperienceSection />);

        const h2Headings = screen.getAllByRole('heading', { level: 2 });
        const h3Headings = screen.getAllByRole('heading', { level: 3 });
        const h4Headings = screen.getAllByRole('heading', { level: 4 });

        // Should have main section title
        expect(h2Headings.length).toBeGreaterThan(0);
        // Should have subsection titles
        expect(h3Headings.length).toBeGreaterThan(0);
        // Should have category/item titles
        expect(h4Headings.length).toBeGreaterThan(0);

        // Verify heading levels are sequential (no levels skipped)
        const headings = screen.getAllByRole('heading');
        const headingLevels = headings.map(h => parseInt(h.tagName.charAt(1)));
        const uniqueLevels = [...new Set(headingLevels)].sort();
        expect(uniqueLevels).toEqual([2, 3, 4]);
    });

    it('should render Badge components with correct props', () => {
        render(<ExperienceSection />);

        const badges = screen.getAllByTestId('badge');
        expect(badges.length).toBeGreaterThan(0);
        badges.forEach((badge) => {
            expect(badge).toHaveAttribute('data-variant', 'secondary');
        });
    });

    it('should render dynamic content from configuration', () => {
        render(<ExperienceSection />);

        // Should adapt to configuration data
        const badges = screen.getAllByTestId('badge');
        const bulletPoints = document.querySelectorAll('.bg-action.rounded-full');

        expect(badges.length).toBeGreaterThan(0);
        expect(bulletPoints.length).toBeGreaterThan(0);
    });
});
