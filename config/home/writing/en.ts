import type { WritingCopy } from './types';

export const writingEn: WritingCopy = {
    heading: {
        title: 'Writing and current work',
        lede: 'I write about building software with AI, and about the teams and decisions behind it.',
    },
    highlights: {
        'why-good-software-engineering-is-expensive': {
            kind: 'Essay',
            description: 'AI gets you the first 80% in an hour. The last 20% (edge cases, data consistency, security) is where software gets expensive, and why cheap code gets built twice.',
        },
        'how-to-hire-your-first-developer': {
            kind: 'Guide',
            description: 'For non-technical founders: test real skills instead of resumes, start with a paid trial project, and bring in a tech lead to help you judge.',
        },
    },
    defaultKind: 'Article',
    allArticles: 'All articles on the blog',
    buildingNow: {
        label: 'Building now',
        title: 'Command&Code',
        description: 'A desktop app that puts a visual orchestration layer on top of Claude Code: a workflow rail, approval gates on every artifact, and autonomy modes you set per step.',
    },
    pipeline: {
        nodes: {
            spec: 'spec.md',
            research: 'research',
            gate: 'review gate',
            implement: 'implement',
        },
        status: {
            ready: 'ready',
            writingSpec: 'writing spec.md',
            researching: 'research agents running',
            waiting: 'review gate: waiting',
            approved: 'approved',
            implementing: 'implementing',
            done: 'done, next task',
        },
    },
};
