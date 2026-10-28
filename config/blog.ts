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
    /** The last meaningful content change, when there was one after `date`. */
    updated?: string;
    tags: string[];
    slug: string;
    published: boolean;
    /** Highlighted in the homepage's writing section. */
    featured?: boolean;
}

/**
 * A post as the reading pages list it: its read time is counted from the
 * markdown at build time (`lib/content/blogPosts.ts`), never written by hand.
 */
export interface ListedPost extends BlogPost {
    readTime: string;
}

/**
 * Raw blog posts data.
 */
const rawBlogPosts: BlogPost[] = [
    {
        id: '1',
        title: 'How to Use AI to Build Apps at 10× Speed',
        excerpt: 'My real-world workflow for combining ChatGPT, v0, Claude Code and Cursor to build apps far faster, and how to keep the AI on track when it goes wrong.',
        date: '2025-08-14',
        tags: ['AI', 'Productivity', 'Development', 'Cursor', 'Claude Code', 'v0', 'ChatGPT'],
        slug: 'how-to-use-ai-to-build-apps-10x-speed',
        published: true,
    },
    {
        id: '2',
        title: 'Node.js vs Python: The Cost of Framework Magic',
        excerpt: 'A TypeScript developer compares Node.js and Python, and why explicit, modular code often beats hidden framework magic for long-term maintainability.',
        date: '2025-08-15',
        updated: '2026-10-13',
        tags: ['Node.js', 'Python', 'TypeScript', 'FastAPI', 'Django', 'Clean Code', 'Framework Magic', 'Backend Development'],
        slug: 'nodejs-vs-python-framework-magic',
        published: true,
    },
    {
        id: '3',
        title: 'How to Hire Your First Developer',
        excerpt: 'A practical guide for non-technical founders and managers on hiring their first developer the right way — with clear steps, realistic tests, and expert advice.',
        date: '2025-08-16',
        tags: ['Hiring', 'Developers', 'Startups', 'Fractional CTO', 'Consulting', 'Tech Leadership'],
        slug: 'how-to-hire-your-first-developer',
        published: true,
        featured: true,
    },
    {
        id: '4',
        title: 'Why Startups Don\'t Need Product Owners',
        excerpt: 'Hiring a Product Owner too early is a common mistake for startups and new tech teams. Why they add little value early on, and when they actually do.',
        date: '2025-08-16',
        updated: '2026-10-13',
        tags: ['Product Management', 'Tech Leadership', 'Startups', 'Hiring'],
        slug: 'why-startups-dont-need-product-owners',
        published: true,
    },
    {
        id: '5',
        title: 'How to Build a Startup Dev Team That Works',
        excerpt: 'Smartest isn\'t always best. Learn how to hire developers for a startup by balancing archetypes, technical skills, and soft skills for real-world success.',
        date: '2025-08-19',
        tags: ['Startups', 'Team Building', 'Hiring', 'Tech Leadership', 'Software Teams'],
        slug: 'how-to-build-a-startup-dev-team-for-real-world-success',
        published: true,
    },
    {
        id: '6',
        title: 'The Burnout Trap: How Overwork Kills Startups',
        excerpt: '13-hour days don’t make startups faster. They cause burnout, tech debt and wasted talent, and no number of extra developers can fix a bad culture.',
        date: '2025-08-20',
        updated: '2026-10-13',
        tags: ['Startups', 'Tech Leadership', 'Burnout', 'Engineering Culture', 'Hiring'],
        slug: 'startup-burnout-trap',
        published: true,
    },
    {
        id: '8',
        title: '10 AI Workflows Every Developer Should Know',
        excerpt: 'AI is no longer just autocomplete. These 10 workflows, from planning and UI bootstrapping to tests, reviews and deployment, help developers ship much faster.',
        date: '2025-08-26',
        updated: '2026-10-13',
        tags: ['AI', 'Developer Productivity', 'Workflows', 'Cursor', 'Claude Code', 'ChatGPT', 'Automation'],
        slug: '10-ai-workflows-every-developer-should-know-2025',
        published: true,
    },
    {
        id: '9',
        title: 'Why Good Software Engineering Is Expensive',
        excerpt: 'AI can generate code, but it can’t replace engineering judgment. Good software is expensive because bad software costs more later: bugs, rewrites and debt.',
        date: '2026-05-15',
        tags: ['Software Engineering', 'AI', 'Tech Leadership', 'UX', 'Startups', 'Product Development', 'Vibe Coding', 'Technical Debt', 'Engineering Culture'],
        slug: 'why-good-software-engineering-is-expensive',
        published: true,
        featured: true,
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

/** When a post last changed: its update date, or its publish date if it has none. */
export const lastModified = (post: BlogPost) => post.updated ?? post.date;

/** The writing index's heading, shared by the page and its share card. */
export const blogIndexHeading = {
    kicker: 'Writing',
    title: 'Insights on software development and tech leadership',
    /** The phrase the share card draws on the selection highlight. */
    highlight: 'tech leadership',
    lede: (years: number) => `Practical advice from ${years} years of building software, leading teams, and helping businesses navigate their technology challenges.`,
};
