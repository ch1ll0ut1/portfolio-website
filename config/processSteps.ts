/**
 * The four-step engagement model behind the pinned process stepper.
 *
 * Each step carries the terminal transcript that types itself when the step
 * becomes active. The transcript is data rather than markup so the typing
 * engine can stay framework-agnostic and the copy stays in one place.
 */

export type TerminalTone = 'prompt' | 'dim' | 'ok' | 'warn';

export interface TerminalSpan {
    text: string;
    /** Omitted for plain foreground text. */
    tone?: TerminalTone;
}

export interface ProcessStep {
    id: string;
    title: string;
    description: string;
    /**
     * The first line is the command and types character by character. Every
     * later line is output: it reveals whole, after a short gap.
     */
    transcript: TerminalSpan[][];
}

/** Shown in the terminal's title bar. */
export const terminalPath = '~/your-product';

export const processTitle = 'How a project runs';

export const processSteps: ProcessStep[] = [
    {
        id: 'talk',
        title: 'Talk',
        description: 'Thirty minutes on the problem, the constraints and what done looks like. Free, and no deck needed.',
        transcript: [
            [{ text: '$', tone: 'prompt' }, { text: ' book --call 30m' }],
            [{ text: 'agenda', tone: 'dim' }, { text: '  problem · constraints · definition of done' }],
            [{ text: '✓', tone: 'ok' }, { text: ' call booked, no prep required' }],
        ],
    },
    {
        id: 'map',
        title: 'Map',
        description: 'I read the code or the idea and write a short plan: architecture, risks, milestones and cost. You decide with real numbers.',
        transcript: [
            [{ text: '$', tone: 'prompt' }, { text: ' claude /audit ./repo' }],
            [{ text: 'reading', tone: 'dim' }, { text: ' source, schema, infra, CI' }],
            [{ text: '→', tone: 'ok' }, { text: ' architecture.md' }],
            [{ text: '→', tone: 'ok' }, { text: ' risks.md        ' }, { text: '7 items, 2 critical', tone: 'warn' }],
            [{ text: '→', tone: 'ok' }, { text: ' plan.md         milestones + cost' }],
            [{ text: '✓', tone: 'ok' }, { text: ' plan ready for review' }],
        ],
    },
    {
        id: 'build',
        title: 'Build',
        description: 'Working increments in production every week. I write the code myself and run agent pipelines for research, tests and review.',
        transcript: [
            [{ text: '$', tone: 'prompt' }, { text: ' claude /ship feature/onboarding' }],
            [{ text: 'agents', tone: 'dim' }],
            [{ text: '  research   ' }, { text: '✓', tone: 'ok' }],
            [{ text: '  implement  ' }, { text: '✓', tone: 'ok' }],
            [{ text: '  tests      ' }, { text: '✓', tone: 'ok' }, { text: '  142 passed' }],
            [{ text: '  review     ' }, { text: '✓', tone: 'ok' }, { text: '  reviewed by Stefan' }],
            [{ text: '✓', tone: 'ok' }, { text: ' deployed to production' }],
        ],
    },
    {
        id: 'handover',
        title: 'Hand over',
        description: 'Docs, tests, CI/CD and onboarding for your team, so the product keeps running without me.',
        transcript: [
            [{ text: '$', tone: 'prompt' }, { text: ' handover --team' }],
            [{ text: '✓', tone: 'ok' }, { text: ' docs/handbook.md' }],
            [{ text: '✓', tone: 'ok' }, { text: ' CI green on main' }],
            [{ text: '✓', tone: 'ok' }, { text: ' runbooks + monitoring' }],
            [{ text: '✓', tone: 'ok' }, { text: ' team onboarded' }],
            [{ text: 'status', tone: 'dim' }, { text: '  runs without me' }],
        ],
    },
];
