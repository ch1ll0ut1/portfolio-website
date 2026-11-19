import type { ProcessCopy } from './types';

export const processEn: ProcessCopy = {
    title: 'How a project runs',
    steps: {
        talk: {
            title: 'Talk',
            description: 'Thirty minutes on the problem, the constraints, and what done looks like. Free, and no deck needed.',
            transcript: [
                [{ text: '$', tone: 'prompt' }, { text: ' book --call 30m' }],
                [{ text: 'agenda', tone: 'dim' }, { text: '  problem · constraints · definition of done' }],
                [{ text: '✓', tone: 'ok' }, { text: ' call booked, no prep required' }],
            ],
        },
        map: {
            title: 'Map',
            description: 'I read the code or the idea and write a short plan: architecture, risks, milestones, and cost. You decide with real numbers.',
            transcript: [
                [{ text: '$', tone: 'prompt' }, { text: ' claude /audit ./repo' }],
                [{ text: 'reading', tone: 'dim' }, { text: ' source, schema, infra, CI' }],
                [{ text: '→', tone: 'ok' }, { text: ' architecture.md' }],
                [{ text: '→', tone: 'ok' }, { text: ' risks.md        ' }, { text: '7 items, 2 critical', tone: 'warn' }],
                [{ text: '→', tone: 'ok' }, { text: ' plan.md         milestones + cost' }],
                [{ text: '✓', tone: 'ok' }, { text: ' plan ready for review' }],
            ],
        },
        build: {
            title: 'Build',
            description: 'A working piece of the product, live every week. I write the code myself; AI tools help with research, tests, and review, and nothing ships until I have checked it.',
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
        handover: {
            title: 'Hand over',
            description: 'Documentation, tests, automatic deploys, and a walkthrough for your team, so the product keeps running without me.',
            transcript: [
                [{ text: '$', tone: 'prompt' }, { text: ' handover --team' }],
                [{ text: '✓', tone: 'ok' }, { text: ' docs/handbook.md' }],
                [{ text: '✓', tone: 'ok' }, { text: ' CI green on main' }],
                [{ text: '✓', tone: 'ok' }, { text: ' runbooks + monitoring' }],
                [{ text: '✓', tone: 'ok' }, { text: ' team onboarded' }],
                [{ text: 'status', tone: 'dim' }, { text: '  runs without me' }],
            ],
        },
    },
    principles: {
        label: 'Working principles',
        items: {
            'vision-first': {
                label: 'Vision first',
                heading: 'Start with the product truth',
                paragraphs: [
                    'A good project does not start with a 100-page specification. It starts with a clear understanding of who the software is for, what problem it solves, and what a successful first version should achieve.',
                    'From there, I help shape the smaller decisions with you: challenging assumptions, simplifying where possible, and translating the business vision into technical and product decisions.',
                ],
            },
            'two-way-collaboration': {
                label: 'Two-way collaboration',
                heading: 'Keep business, UX, and engineering in the same room',
                paragraphs: [
                    'The client brings business knowledge, user understanding, and product goals. I bring technical judgment, architecture, UX thinking, implementation experience, and the responsibility to say when something does not make sense.',
                    'That matters most when designers, stakeholders, or other developers are involved. Design decisions affect implementation. Technical constraints affect user experience. Business goals affect architecture.',
                ],
            },
            'refinement': {
                label: 'Refinement',
                heading: 'Treat iteration as part of the craft',
                paragraphs: [
                    'A first implementation makes the idea real enough to review. From there, I refine the workflows with you, polish the details, fix the edge cases, and keep going until the experience feels right.',
                    'This is not failure. This is how good products are shaped.',
                ],
            },
        },
    },
    featureCycle: {
        label: 'Product cycles',
        heading: 'Feature-by-feature product cycles.',
        bridge: 'Build is the step that takes the most time. Inside it, every feature runs the same nine-step cycle.',
        steps: {
            'vision-goal': {
                title: 'Vision & goal',
                description: 'Clarify who the software is for, what problem it solves, and what a successful first version should achieve.',
            },
            'feature-definition': {
                title: 'Feature definition',
                description: 'Turn the broad goal into a focused feature with clear user value and practical boundaries.',
            },
            'technical-feasibility': {
                title: 'Technical feasibility',
                description: 'Check the architecture, data, integrations, risks, and constraints before implementation starts.',
            },
            'ux-workflow': {
                title: 'UX and workflow decisions',
                description: 'Shape how the feature should feel for real users and how it fits into the wider product.',
            },
            'first-implementation': {
                title: 'First implementation',
                description: 'Build a working version that is real enough to review, test, and improve.',
            },
            'review-feedback': {
                title: 'Review and feedback',
                description: 'Use the first version to find gaps, sharpen details, and decide what needs adjustment.',
            },
            'iteration-refinement': {
                title: 'Iteration and refinement',
                description: 'Polish the workflow, reduce friction, simplify where possible, and strengthen the experience.',
            },
            'testing-stabilization': {
                title: 'Testing and stabilization',
                description: 'Check the behavior that matters most and make the feature reliable before release.',
            },
            'deployment-next': {
                title: 'Deployment or next feature',
                description: 'Ship the stable slice or move into the next feature cycle with the lessons learned.',
            },
        },
    },
    more: {
        text: 'The principles I work by, the cycle each feature runs through, and who I work best with are on the services page.',
        link: 'How I work',
    },
    fit: {
        lists: {
            'good-fit': {
                title: 'Who I work best with',
                items: [
                    'Founders who care about building a real product, not just a demo',
                    'Businesses that need reliable custom software',
                    'Teams that value UX and maintainability',
                    'Clients who want technical guidance, not just code output',
                    'Startups that need senior product engineering judgment',
                    'Companies with broken or unfinished software that needs rescue or restructuring',
                ],
            },
            'not-a-fit': {
                title: 'What is not a good fit',
                items: [
                    'Projects where the cheapest possible implementation is the main goal',
                    'Clients who expect AI to replace engineering judgment',
                    'Unrealistic deadlines that require sacrificing quality',
                    'Micromanaged work where technical decisions are forced without discussion',
                    'Projects where maintainability, UX, and long-term reliability do not matter',
                ],
            },
        },
    },
};
