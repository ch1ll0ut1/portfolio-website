/**
 * The "More projects" index under the case studies.
 *
 * Deliberately terse: one line each, newest first. The stack array is rendered
 * joined in the row and split back into tags by the cursor preview card.
 */

export interface IndexedProject {
    /** Slug used for keys and the preview card's fake path. */
    id: string;
    /** Year or range, as shown. "Now" for current work. */
    year: string;
    name: string;
    /** One sentence on what it is. */
    description: string;
    stack: string[];
}

export const projectsIndex: IndexedProject[] = [
    {
        id: 'command-code',
        year: 'Now',
        name: 'Command&Code',
        description: 'Desktop app that adds a visual orchestration layer on top of Claude Code. In development.',
        stack: ['TypeScript', 'agentic LLM workflows'],
    },
    {
        id: 'fokus-nachhilfe',
        year: '2025–',
        name: 'Fokus-Nachhilfe.ch',
        description: 'Sole engineer on a Swiss tutoring company’s new customer platform.',
        stack: ['Next.js', 'Supabase', 'HubSpot', 'Vercel'],
    },
    {
        id: 'directmail',
        year: '2021–22',
        name: 'DirectMail',
        description: 'Rich text editor for structured email content, used by thousands.',
        stack: ['React', 'Slate.js'],
    },
    {
        id: 'slimwiki',
        year: '2017–18',
        name: 'Slimwiki',
        description: 'Collaborative knowledge base with real-time editing and offline-first sync.',
        stack: ['React', 'Koa', 'PostgreSQL', 'AWS'],
    },
    {
        id: 'indycloud',
        year: '2013–15',
        name: 'Indycloud',
        description: 'Zoomable maps of how enterprise data tables relate. Led development with a team of two.',
        stack: ['React', 'Node.js', 'Koa'],
    },
    {
        id: 'hotel-visual-cms',
        year: '2013–15',
        name: 'Hotel Visual CMS',
        description: 'Room-to-room walkthrough that feels 3D, made only of 2D transforms.',
        stack: ['JavaScript', 'CSS'],
    },
    {
        id: 'doctor-discovery',
        year: '2013–15',
        name: 'Doctor discovery',
        description: 'Search engine for finding doctors abroad, built as sole developer.',
        stack: ['MeteorJS', 'MongoDB'],
    },
];
