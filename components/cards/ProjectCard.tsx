/**
 * Project card component for displaying portfolio projects.
 * Self-contained component with project data and presentation logic.
 */

import React, { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ExternalLink } from 'lucide-react';
import { PortfolioProject } from '@/config/portfolio';

interface Props {
    project: PortfolioProject;
    className?: string;
}

/**
 * Displays a portfolio project with title, description, technologies, and CTA.
 * Uses consistent card styling with action color branding.
 */
export const ProjectCard: FC<Props> = ({ project, className = '' }) => {
    return (
        <Card className={`border-0 shadow-lg hover:shadow-xl transition-shadow ${className}`}>
            <CardHeader>
                <CardTitle className="text-xl">{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ProjectTechnologies technologies={project.technologies} />
                <ProjectCta project={project} />
            </CardContent>
        </Card>
    );
};

/**
 * Displays project technologies as badges.
 */
const ProjectTechnologies: FC<{ technologies: string[] }> = ({ technologies }) => {
    return (
        <div className="flex flex-wrap gap-2 mb-4">
            {technologies.map(tech => (
                <Badge key={tech} variant="secondary">
                    {tech}
                </Badge>
            ))}
        </div>
    );
};

/**
 * Project call-to-action button.
 */
const ProjectCta: FC<{ project: PortfolioProject }> = ({ project }) => {
    if (!project.caseStudyUrl) {
        return null;
    }

    return (
        <Button variant="outline" size="sm" className="w-full bg-transparent">
            View Case Study
            <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
    );
};
