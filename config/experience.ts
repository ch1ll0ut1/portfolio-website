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
            skills: ['JavaScript/TypeScript', 'React/Next.js', 'Node.js', 'Python', 'Java', 'C#/.NET'],
        },
        {
            name: 'Cloud & DevOps',
            skills: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
        },
        {
            name: 'Databases',
            skills: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL'],
        },
    ],
    leadershipItems: [
        {
            title: '15+ Years Experience',
            description: 'Full-stack development and technical leadership',
        },
        {
            title: 'Team Leadership',
            description: 'Led teams of 5-20 developers and designers',
        },
        {
            title: 'Project Management',
            description: 'Agile, Scrum, and custom delivery methodologies',
        },
        {
            title: 'Strategic Planning',
            description: 'Technology roadmaps and digital transformation',
        },
    ],
};
