/**
 * Blog configuration and metadata management.
 * Self-contained module for all blog-related configuration.
 */

import { sortByDate } from '@/lib/date';

export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    tags: string[];
    slug: string;
}

/**
 * Raw blog posts data.
 */
const rawBlogPosts: BlogPost[] = [
    {
        id: '1',
        title: 'Building Scalable React Applications: Lessons from 15 Years of Development',
        excerpt: 'After leading dozens of React projects, I\'ve learned what separates maintainable applications from technical debt nightmares. Here are the architectural patterns that actually work in production.',
        date: '2024-01-15',
        readTime: '8 min read',
        tags: ['React', 'Architecture', 'Best Practices'],
        slug: 'scalable-react-applications',
    },
    {
        id: '2',
        title: 'The CTO\'s Guide to AI Implementation: Beyond the Hype',
        excerpt: 'Most AI initiatives fail not because of technology limitations, but due to poor strategic planning. Here\'s how to identify real AI opportunities and execute them successfully.',
        date: '2024-01-08',
        readTime: '12 min read',
        tags: ['AI', 'Strategy', 'Leadership'],
        slug: 'cto-guide-ai-implementation',
    },
    {
        id: '3',
        title: 'From Developer to Tech Lead: The Skills They Don\'t Teach You',
        excerpt: 'Technical expertise got you promoted, but leadership requires a completely different skill set. Here\'s what I wish I knew when I made the transition.',
        date: '2024-01-01',
        readTime: '6 min read',
        tags: ['Leadership', 'Career', 'Management'],
        slug: 'developer-to-tech-lead',
    },
];

/**
 * Blog posts sorted by date (newest first).
 */
export const blogPosts: BlogPost[] = sortByDate([...rawBlogPosts]);
