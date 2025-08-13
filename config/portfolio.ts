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
    year?: string;
}

/**
 * Portfolio projects data.
 */
export const portfolio: PortfolioProject[] = [
    {
        id: 'edithing',
        title: 'Edithing - Government Rich Text Editor',
        description: 'Open-source web rich text editor for laws and bills of the Iceland Parliament. Lead Developer/Architect for government project with collaborative features and document management.',
        technologies: ['TypeScript', 'React', 'Slate.js', 'Node.js', 'MySQL', 'Zustand'],
        year: '2023 - Present',
    },
    {
        id: 'social-bee',
        title: 'Social-Bee.de - Immigrant Support Platform',
        description: 'Web platform for immigrants in Germany to find resources, courses, and information about German bureaucracy. Designed product features, architected technical infrastructure, and built complete tech department from ground up.',
        technologies: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS'],
        year: '2022 - 2023',
    },
    {
        id: 'directmail',
        title: 'DirectMail - Email Content Editor',
        description: 'Rich text web editor for structured layout text content for emails. Used by 1000s of users for streamlined email content creation with advanced layout management.',
        technologies: ['TypeScript', 'React', 'Slate.js'],
        year: '2021 - 2022',
    },
    {
        id: 'bluereceipt',
        title: 'BlueReceipt - SMS Marketing Platform',
        description: 'SMS marketing platform for Shopify brands. Built complete solution from ground up with innovative data layer architecture, custom ORM, and comprehensive automation pipeline.',
        technologies: ['React', 'MySQL', 'GraphQL', 'Node.js', 'TypeScript', 'AWS', 'CDK', 'ECS'],
        year: '2020 - 2021',
    },
    {
        id: 'slimwiki',
        title: 'Slimwiki - Knowledge Base Platform',
        description: 'Innovative knowledge base platform with collaborative editing, real-time communication, and offline-first architecture with intelligent syncing.',
        technologies: ['TypeScript', 'React', 'Node.js', 'Redux', 'Slate.js', 'PostgreSQL', 'AWS'],
        year: '2017 - 2018',
    },
    {
        id: 'indycloud',
        title: 'Indycloud.de - Enterprise Workflow Platform',
        description: 'Enterprise business workflow and process visualization platform. Innovated game map-like functionality for navigating resource tables with interactive data visualization.',
        technologies: ['React.js', 'TypeScript', 'Node.js', 'Express'],
        year: '2013 - 2015',
    },
    {
        id: 'hotel-visual-cms',
        title: 'Hotel Visual CMS - 2D Walkthrough',
        description: 'Innovative 2D visual walkthrough CMS for hotels with immersive room-to-room navigation and seamless fullscreen transitions with door-click mechanics.',
        technologies: ['PHP', 'MySQL', 'HTML', 'CSS', 'jQuery'],
        year: '2013 - 2015',
    },
    {
        id: 'doctor-discovery',
        title: 'Doctor Discovery Platform',
        description: 'Social platform and search engine for finding doctors abroad for plastic surgery. Built complete platform as sole developer with high-performance search capabilities.',
        technologies: ['MeteorJS', 'JavaScript', 'MongoDB'],
        year: '2013 - 2015',
    },
    {
        id: 'eko-messaging',
        title: 'Eko - Employee Communication Platform',
        description: 'Mobile-first employee platform with real-time messaging system. Achieved 100% performance improvement through system refactoring and API optimization.',
        technologies: ['TypeScript', 'React', 'Node.js', 'MongoDB', 'Redis', 'Elasticsearch', 'Docker', 'AWS'],
        year: '2015 - 2017',
    },
];
