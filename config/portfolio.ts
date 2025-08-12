/**
 * Portfolio project configuration and data.
 * Self-contained module for all portfolio-related data and utilities.
 */

export interface PortfolioProject {
    id: string;
    title: string;
    description: string;
    technologies: string[];
    caseStudyUrl?: string;
}

/**
 * Portfolio projects data.
 */
export const portfolio: PortfolioProject[] = [
    {
        id: 'ecommerce-platform',
        title: 'E-Commerce Platform',
        description: 'Led a team of 8 developers to build a scalable e-commerce platform handling 100k+ daily transactions.',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    },
    {
        id: 'ai-analytics-dashboard',
        title: 'AI-Powered Analytics Dashboard',
        description: 'Built an intelligent analytics platform that reduced manual reporting time by 80% for a Fortune 500 company.',
        technologies: ['Python', 'TensorFlow', 'React', 'Azure'],
    },
    {
        id: 'healthcare-management',
        title: 'Healthcare Management System',
        description: 'Designed and implemented a HIPAA-compliant patient management system for a network of medical practices.',
        technologies: ['C#/.NET', 'Angular', 'SQL Server', 'HIPAA'],
    },
];
