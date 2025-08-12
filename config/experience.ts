/**
 * Experience and skills configuration and data.
 * Self-contained module for all experience-related data and utilities.
 */

export interface SkillCategory {
    name: string;
    skills: string[];
}

export interface ExperienceItem {
    title: string;
    description: string;
}

export interface ExperienceData {
    technicalSkills: SkillCategory[];
    leadershipItems: ExperienceItem[];
}

/**
 * Experience and skills data.
 */
export const experience: ExperienceData = {
    technicalSkills: [
        {
            name: 'Languages & Frameworks',
            skills: ['TypeScript', 'JavaScript', 'React', 'Node.js', 'GraphQL', 'Next.js', 'HTML5', 'CSS', 'SASS'],
        },
        {
            name: 'Cloud & DevOps',
            skills: ['AWS (EC2, S3, CDK, ECS)', 'Docker', 'CircleCi', 'Git', 'Nginx', 'Apache', 'Ubuntu', 'Debian'],
        },
        {
            name: 'Databases',
            skills: ['MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'PostgreSQL', 'InfluxDB'],
        },
        {
            name: 'Tools & Libraries',
            skills: ['Slate.js', 'Redux', 'Zustand', 'Vitest', 'Jest', 'Parcel', 'Webpack', 'Babel', 'StyledComponents', 'TailwindCSS', 'MaterialUI', 'Socket.io', 'MeteorJS', 'Express.js', 'Koa', 'TypedORM', 'Sequilize'],
        },
        {
            name: 'Project Management',
            skills: ['Agile', 'Scrum', 'Kanban', 'Jira', 'Trello'],
        },
    ],
    leadershipItems: [
        {
            title: '15+ Years Experience',
            description: 'Full-stack development and technical leadership across multiple industries',
        },
        {
            title: 'Team Leadership',
            description: 'Led teams of 4-12 developers, mentoring and coaching junior developers',
        },
        {
            title: 'Startup Experience',
            description: 'CTO roles, co-founder experience, and startup accelerator participation',
        },
        {
            title: 'Technical Architecture',
            description: 'Built systems from ground up, designed scalable architectures, and implemented automation pipelines',
        },
        {
            title: 'Project Management',
            description: 'Agile methodologies, process improvement, and cross-functional team coordination',
        },
        {
            title: 'Government & Enterprise',
            description: 'Worked with government projects, healthcare compliance (HIPAA), and enterprise solutions',
        },
    ],
};
