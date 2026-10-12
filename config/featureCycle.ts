/**
 * The nine-step feature cycle that runs inside the stepper's "Build" step.
 *
 * Copy is lifted verbatim from the unshipped `/how-i-work` page (see
 * `docs/how-i-work-content.md`, section 3). `bridge` is the one line of new
 * copy: without it the four-step engagement model and this nine-step cycle read
 * as two competing processes rather than one nested inside the other.
 */

export interface FeatureCycleStep {
    id: string;
    title: string;
    description: string;
}

export interface FeatureCycleContent {
    label: string;
    heading: string;
    bridge: string;
    intro: string;
    steps: FeatureCycleStep[];
}

export const featureCycleContent: FeatureCycleContent = {
    label: 'Product cycles',
    heading: 'Feature-by-feature product cycles.',
    bridge: 'Build is the step that takes the most time. Inside it, every feature runs the same nine-step cycle.',
    intro: 'Each important feature moves through a small product cycle: goal, workflow, technical decisions, first implementation, review, refinement, testing, and release.',
    steps: [
        {
            id: 'vision-goal',
            title: 'Vision & goal',
            description: 'Clarify who the software is for, what problem it solves, and what a successful first version should achieve.',
        },
        {
            id: 'feature-definition',
            title: 'Feature definition',
            description: 'Turn the broad goal into a focused feature with clear user value and practical boundaries.',
        },
        {
            id: 'technical-feasibility',
            title: 'Technical feasibility',
            description: 'Check the architecture, data, integrations, risks, and constraints before implementation starts.',
        },
        {
            id: 'ux-workflow',
            title: 'UX and workflow decisions',
            description: 'Shape how the feature should feel for real users and how it fits into the wider product.',
        },
        {
            id: 'first-implementation',
            title: 'First implementation',
            description: 'Build a working version that is real enough to review, test, and improve.',
        },
        {
            id: 'review-feedback',
            title: 'Review and feedback',
            description: 'Use the first version to find gaps, sharpen details, and decide what needs adjustment.',
        },
        {
            id: 'iteration-refinement',
            title: 'Iteration and refinement',
            description: 'Polish the workflow, reduce friction, simplify where possible, and strengthen the experience.',
        },
        {
            id: 'testing-stabilization',
            title: 'Testing and stabilization',
            description: 'Check the behavior that matters most and make the feature reliable before release.',
        },
        {
            id: 'deployment-next',
            title: 'Deployment or next feature',
            description: 'Ship the stable slice or move into the next feature cycle with the lessons learned.',
        },
    ],
};
