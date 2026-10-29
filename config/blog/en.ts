/**
 * The blog in English: each post's title and excerpt, and the words of the
 * reading pages, share cards, feed and structured data.
 */

import type { BlogCopy } from './types';

export const blogEn: BlogCopy = {
    posts: {
        'how-to-use-ai-to-build-apps-10x-speed': {
            title: 'How to Use AI to Build Apps at 10× Speed',
            excerpt: 'My real-world workflow for combining ChatGPT, v0, Claude Code and Cursor to build apps far faster, and how to keep the AI on track when it goes wrong.',
        },
        'nodejs-vs-python-framework-magic': {
            title: 'Node.js vs Python: The Cost of Framework Magic',
            excerpt: 'A TypeScript developer compares Node.js and Python, and why explicit, modular code often beats hidden framework magic for long-term maintainability.',
        },
        'how-to-hire-your-first-developer': {
            title: 'How to Hire Your First Developer',
            excerpt: 'A practical guide for non-technical founders and managers on hiring their first developer the right way — with clear steps, realistic tests, and expert advice.',
        },
        'why-startups-dont-need-product-owners': {
            title: 'Why Startups Don\'t Need Product Owners',
            excerpt: 'Hiring a Product Owner too early is a common mistake for startups and new tech teams. Why they add little value early on, and when they actually do.',
        },
        'how-to-build-a-startup-dev-team-for-real-world-success': {
            title: 'How to Build a Startup Dev Team That Works',
            excerpt: 'Smartest isn\'t always best. Learn how to hire developers for a startup by balancing archetypes, technical skills, and soft skills for real-world success.',
        },
        'startup-burnout-trap': {
            title: 'The Burnout Trap: How Overwork Kills Startups',
            excerpt: '13-hour days don’t make startups faster. They cause burnout, tech debt and wasted talent, and no number of extra developers can fix a bad culture.',
        },
        '10-ai-workflows-every-developer-should-know-2025': {
            title: '10 AI Workflows Every Developer Should Know',
            excerpt: 'AI is no longer just autocomplete. These 10 workflows, from planning and UI bootstrapping to tests, reviews and deployment, help developers ship much faster.',
        },
        'why-good-software-engineering-is-expensive': {
            title: 'Why Good Software Engineering Is Expensive',
            excerpt: 'AI can generate code, but it can’t replace engineering judgment. Good software is expensive because bad software costs more later: bugs, rewrites and debt.',
        },
    },
    // The tags are English already.
    tags: {},
    indexMeta: {
        title: 'Blog — Software engineering, tech leadership, and AI',
        description: 'Writing on software engineering, technical leadership, hiring, and building software with AI, from years of shipping products and leading teams.',
    },
    indexHeading: {
        kicker: 'Writing',
        title: 'Insights on software development and tech leadership',
        highlight: 'tech leadership',
        lede: years => `Practical advice from ${years} years of building software, leading teams, and helping businesses navigate their technology challenges.`,
    },
    indexCardAlt: (title, name) => `${title}, writing by ${name}`,
    featured: 'Featured',
    readTime: minutes => `${minutes} min read`,
    updated: 'Updated',
    breadcrumbs: {
        label: 'Breadcrumb',
        home: 'Home',
        writing: 'Writing',
    },
    pager: {
        label: 'More articles',
        newer: 'Newer',
        older: 'Older',
        all: 'All articles',
    },
    related: 'Related posts',
    author: {
        label: 'About the author',
        headshotAlt: 'Stefan Knoch',
        kicker: 'Written by',
        bio: {
            beforeYear: 'Software architect & tech lead since',
            afterYear: '. I build new apps, fix broken ones and lead developers for startups and small businesses, working remotely from Bangkok in English and',
            german: 'Deutsch',
            end: '.',
        },
        actions: {
            services: 'How I can help',
            contact: 'Get in touch',
        },
    },
    notFound: {
        title: 'Post not found',
        description: 'That article does not exist, or its link has changed.',
        body: 'That article does not exist, or its link has changed since it was shared.',
        action: 'All articles',
    },
    cardKicker: 'blog',
    feed: {
        title: name => `${name} — Writing`,
        description: 'Writing on software engineering, technical leadership, hiring, and building software with AI.',
        language: 'en-us',
    },
    schemaName: name => `${name} Blog`,
};
