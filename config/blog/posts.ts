/**
 * The facts of every post, the same in every language: id, dates, tags, slug
 * and flags. Titles and excerpts are words, so they live in each language's
 * `BlogCopy.posts` (./en.ts) and are merged in by `blogPostsFor`.
 */

import type { BlogPostData, BlogSlug } from './types';

/** An entry is keyed by a known slug, so every language has to give it words. */
type PostEntry = Omit<BlogPostData, 'slug'> & { slug: BlogSlug };

export const rawBlogPosts: PostEntry[] = [
    {
        id: '1',
        date: '2025-08-14',
        tags: ['AI', 'Productivity', 'Development', 'Cursor', 'Claude Code', 'v0', 'ChatGPT'],
        slug: 'how-to-use-ai-to-build-apps-10x-speed',
        published: true,
    },
    {
        id: '2',
        date: '2025-08-15',
        updated: '2026-10-13',
        tags: ['Node.js', 'Python', 'TypeScript', 'FastAPI', 'Django', 'Clean Code', 'Framework Magic', 'Backend Development'],
        slug: 'nodejs-vs-python-framework-magic',
        published: true,
    },
    {
        id: '3',
        date: '2025-08-16',
        tags: ['Hiring', 'Developers', 'Startups', 'Fractional CTO', 'Consulting', 'Tech Leadership'],
        slug: 'how-to-hire-your-first-developer',
        published: true,
        featured: true,
    },
    {
        id: '4',
        date: '2025-08-16',
        updated: '2026-10-13',
        tags: ['Product Management', 'Tech Leadership', 'Startups', 'Hiring'],
        slug: 'why-startups-dont-need-product-owners',
        published: true,
    },
    {
        id: '5',
        date: '2025-08-19',
        tags: ['Startups', 'Team Building', 'Hiring', 'Tech Leadership', 'Software Teams'],
        slug: 'how-to-build-a-startup-dev-team-for-real-world-success',
        published: true,
    },
    {
        id: '6',
        date: '2025-08-20',
        updated: '2026-10-13',
        tags: ['Startups', 'Tech Leadership', 'Burnout', 'Engineering Culture', 'Hiring'],
        slug: 'startup-burnout-trap',
        published: true,
    },
    {
        id: '8',
        date: '2025-08-26',
        updated: '2026-10-13',
        tags: ['AI', 'Developer Productivity', 'Workflows', 'Cursor', 'Claude Code', 'ChatGPT', 'Automation'],
        slug: '10-ai-workflows-every-developer-should-know-2025',
        published: true,
    },
    {
        id: '9',
        date: '2026-05-15',
        tags: ['Software Engineering', 'AI', 'Tech Leadership', 'UX', 'Startups', 'Product Development', 'Vibe Coding', 'Technical Debt', 'Engineering Culture'],
        slug: 'why-good-software-engineering-is-expensive',
        published: true,
        featured: true,
    },
];
