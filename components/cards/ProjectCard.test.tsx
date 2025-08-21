/**
 * Tests for ProjectCard component.
 * Tests behavior, accessibility, and structure without content-specific assertions.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectCard } from './ProjectCard';

const mockProject = {
    id: 'test-project',
    title: 'Test Project',
    description: 'Test description',
    technologies: ['React', 'TypeScript'],
    caseStudyUrl: 'https://example.com',
};

describe('ProjectCard Component', () => {
    it('should render project information', () => {
        render(<ProjectCard project={mockProject} />);

        expect(screen.getByText('Test Project')).toBeInTheDocument();
        expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('should render technology badges', () => {
        render(<ProjectCard project={mockProject} />);

        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });

    it('should render case study button when provided', () => {
        render(<ProjectCard project={mockProject} />);

        const link = screen.getByRole('link');
        expect(link).toBeInTheDocument();
        expect(link).toHaveTextContent('View Case Study');
    });

    it('should not render case study button when not provided', () => {
        const projectWithoutCase = { ...mockProject, caseStudyUrl: undefined };
        render(<ProjectCard project={projectWithoutCase} />);

        const links = screen.queryAllByRole('link');
        expect(links).toHaveLength(0);
    });

    it('should handle custom className prop', () => {
        const { container } = render(<ProjectCard project={mockProject} className="custom-class" />);

        expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should render all provided technologies', () => {
        const projectWithManyTechs = {
            ...mockProject,
            technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
        };
        render(<ProjectCard project={projectWithManyTechs} />);

        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
        expect(screen.getByText('Node.js')).toBeInTheDocument();
        expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
    });

    it('should have accessible card structure', () => {
        render(<ProjectCard project={mockProject} />);

        // Should have proper card structure
        const card = document.querySelector('[data-slot="card"]');
        expect(card).toBeInTheDocument();

        // Should have card title
        const title = document.querySelector('[data-slot="card-title"]');
        expect(title).toBeInTheDocument();
    });
});
