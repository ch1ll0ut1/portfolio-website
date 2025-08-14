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
    published: boolean;
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
        published: false,
    },
    {
        id: '2',
        title: 'The CTO\'s Guide to AI Implementation: Beyond the Hype',
        excerpt: 'Most AI initiatives fail not because of technology limitations, but due to poor strategic planning. Here\'s how to identify real AI opportunities and execute them successfully.',
        date: '2024-01-08',
        readTime: '12 min read',
        tags: ['AI', 'Strategy', 'Leadership'],
        slug: 'cto-guide-ai-implementation',
        published: false,
    },
    {
        id: '3',
        title: 'From Developer to Tech Lead: The Skills They Don\'t Teach You',
        excerpt: 'Technical expertise got you promoted, but leadership requires a completely different skill set. Here\'s what I wish I knew when I made the transition.',
        date: '2024-01-01',
        readTime: '6 min read',
        tags: ['Leadership', 'Career', 'Management'],
        slug: 'developer-to-tech-lead',
        published: false,
    },
    {
        id: '4',
        title: 'Ship 10x Faster: A Practical System for AI-Accelerated Development',
        excerpt: 'A pragmatic system to ship faster using v0 for UI bootstrapping, Claude Sonnet 4 for planning and coding, Cursor as your IDE, and ChatGPT for content—plus pitfalls, costs, and a repeatable loop.',
        date: '2025-08-14',
        readTime: '10 min read',
        tags: ['AI', 'Productivity', 'Development', 'Cursor', 'Claude Sonnet 4', 'Claude Code', 'v0', 'ChatGPT'],
        slug: 'ship-10x-faster-practical-ai-dev-system',
        published: false,
    },
    {
        id: '5',
        title: 'How to Use AI to Build Apps at 10× Speed',
        excerpt: 'A practical, real-world guide to combining ChatGPT, v0, Claude Code, and Cursor IDE to massively speed up app development.',
        date: '2025-08-14',
        readTime: '10 min read',
        tags: ['AI', 'Productivity', 'Development', 'Cursor', 'Claude Sonnet 4', 'Claude Code', 'v0', 'ChatGPT'],
        slug: 'how-to-use-ai-to-build-apps-10x-speed',
        published: true,
    },
];

/**
 * Blog posts sorted by date (newest first).
 * In production, only published posts are shown. In development, all posts are visible.
 */
export const blogPosts: BlogPost[] = sortByDate(
    process.env.NODE_ENV === 'production'
        ? rawBlogPosts.filter(post => post.published)
        : rawBlogPosts,
);
