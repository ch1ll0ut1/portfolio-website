/**
 * Portfolio section component displaying project showcase.
 * Uses ProjectCard components and portfolio configuration for data.
 */

import React, { FC } from 'react';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { portfolio } from '@/config/portfolio';

interface Props {
    className?: string;
}

/**
 * Portfolio section displaying all projects in a grid layout.
 * Loads project data from configuration and renders using ProjectCard components.
 */
export const PortfolioSection: FC<Props> = ({ className = '' }) => {
    return (
        <section id="portfolio" className={`py-20 px-6 bg-white ${className}`}>
            <div className="max-w-6xl mx-auto">
                <SectionHeader />
                <ProjectsGrid projects={portfolio} />
            </div>
        </section>
    );
};

/**
 * Section header with title and description.
 */
const SectionHeader: FC = () => {
    return (
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">Portfolio</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                A selection of projects that showcase my expertise in full-stack development, team leadership, and technology strategy.
            </p>
        </div>
    );
};

interface ProjectsGridProps {
    projects: typeof portfolio;
}

/**
 * Grid layout for project cards with responsive columns.
 */
const ProjectsGrid: FC<ProjectsGridProps> = ({ projects }) => {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map(project => (
                <ProjectCard
                    key={project.id}
                    project={project}
                />
            ))}
        </div>
    );
};
