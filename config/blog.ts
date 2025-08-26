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
    {
        id: '5',
        title: 'How to Build a Startup Dev Team for Real-World Success',
        excerpt: 'Smartest isn\'t always best. Learn how to hire developers for a startup by balancing archetypes, technical skills, and soft skills for real-world success.',
        date: '2025-08-19',
        readTime: '11 min read',
        tags: ['Startups', 'Team Building', 'Hiring Developers', 'Leadership', 'Software Teams'],
        slug: 'how-to-build-a-startup-dev-team-for-real-world-success',
        published: true,
    },
    {
        id: '6',
        title: 'The Burnout Trap: Why Overworking Founders Destroy Their Own Startups',
        excerpt: 'Why 13-hour days don’t make startups faster — they cause burnout, tech debt, and wasted talent. Here’s what overwork really signals, who it attracts, and why even 100 developers can’t save a bad culture.',
        date: '2025-08-20',
        readTime: '12 min read',
        tags: ['Startups', 'Tech Leadership', 'Burnout', 'Engineering Culture', 'Hiring'],
        slug: 'startup-burnout-trap',
        published: true,
    },
    {
        id: '7',
        title: 'How to Start with Crypto Trading (For Complete Beginners)',
        excerpt: 'A step-by-step beginner’s guide to trading crypto safely: from choosing exchanges and risk management to diversification, mental discipline, and simple trading strategies.',
        date: '2025-08-24',
        readTime: '14 min read',
        tags: ['Crypto', 'Trading', 'Risk Management', 'Investing', 'Beginners'],
        slug: 'how-to-start-with-crypto-trading-for-complete-beginners',
        published: true,
    },
    {
        id: '8',
        title: '10 AI Workflows Every Developer Should Know in 2025',
        excerpt: 'AI is no longer just autocomplete — it’s a workflow accelerator. These 10 AI workflows will make developers in 2025 work at 3–10× speed.',
        date: '2025-08-26',
        readTime: '12 min read',
        tags: ['AI', 'Developer Productivity', 'Workflows', 'Cursor', 'Claude Code', 'ChatGPT', 'Automation'],
        slug: '10-ai-workflows-every-developer-should-know-2025',
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
