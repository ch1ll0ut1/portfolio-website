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
        title: 'How to Use AI to Build Apps at 10× Speed',
        excerpt: 'A practical, real-world guide to combining ChatGPT, v0, Claude Code, and Cursor IDE to massively speed up app development.',
        date: '2025-08-14',
        readTime: '10 min read',
        tags: ['AI', 'Productivity', 'Development', 'Cursor', 'Claude Sonnet 4', 'Claude Code', 'v0', 'ChatGPT'],
        slug: 'how-to-use-ai-to-build-apps-10x-speed',
        published: true,
    },
    {
        id: '2',
        title: 'Node.js vs Python: When Framework Magic Stops Feeling Magical',
        excerpt: 'A seasoned TypeScript developer compares Node.js and Python, exploring why explicit, modular code often beats hidden framework magic for long-term maintainability.',
        date: '2025-08-15',
        readTime: '5 min read',
        tags: ['Node.js', 'Python', 'TypeScript', 'FastAPI', 'Django', 'Clean Code', 'Framework Magic', 'Backend Development'],
        slug: 'nodejs-vs-python-framework-magic',
        published: true,
    },
    {
        id: '3',
        title: 'How to Hire Your First Developer (Without Making the Classic Mistakes)',
        excerpt: 'A practical guide for non-technical founders and managers on hiring their first developer the right way — with clear steps, realistic tests, and expert advice.',
        date: '2025-08-16',
        readTime: '8 min read',
        tags: ['Hiring', 'Developers', 'Startup', 'Fractional CTO', 'Consulting', 'Technical Leadership'],
        slug: 'how-to-hire-your-first-developer',
        published: true,
    },
    {
        id: '4',
        title: 'Why Startups Don\'t Need Product Owners',
        excerpt: 'Hiring a Product Owner too early is one of the common mistakes startups and new tech departments make. Here\'s why they don\'t add value in the early stage, and when they actually do.',
        date: '2025-08-16',
        readTime: '9 min read',
        tags: ['Product Management', 'Tech Leadership', 'Startups', 'Hiring'],
        slug: 'why-startups-dont-need-product-owners',
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
