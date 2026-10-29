/**
 * The shape of the process section's words: the four-step engagement model
 * with its terminal transcripts, the working principles, the feature cycle
 * inside the "Build" step, and who the work suits.
 */

import type { TerminalSpan } from '../../processSteps';

export type ProcessStepId = 'talk' | 'map' | 'build' | 'handover';

export type PrincipleId = 'vision-first' | 'two-way-collaboration' | 'refinement';

export type FeatureCycleStepId
    = | 'vision-goal'
      | 'feature-definition'
      | 'technical-feasibility'
      | 'ux-workflow'
      | 'first-implementation'
      | 'review-feedback'
      | 'iteration-refinement'
      | 'testing-stabilization'
      | 'deployment-next';

export type FitListId = 'good-fit' | 'not-a-fit';

export interface ProcessStepCopy {
    title: string;
    description: string;
    /**
     * The first line is the command and types character by character. Every
     * later line is output: it reveals whole, after a short gap.
     */
    transcript: TerminalSpan[][];
}

export interface PrincipleCopy {
    /** Short label above the heading. */
    label: string;
    heading: string;
    paragraphs: [string, string];
}

export interface TitledCopy {
    title: string;
    description: string;
}

export interface ProcessCopy {
    /** The stepper's heading, and the section's name. */
    title: string;
    steps: Record<ProcessStepId, ProcessStepCopy>;
    principles: {
        label: string;
        items: Record<PrincipleId, PrincipleCopy>;
    };
    featureCycle: {
        label: string;
        heading: string;
        /** Ties the nine-step cycle to the "Build" step it runs inside. */
        bridge: string;
        intro: string;
        steps: Record<FeatureCycleStepId, TitledCopy>;
    };
    fit: {
        label: string;
        heading: string;
        intro: string;
        lists: Record<FitListId, { title: string; items: string[] }>;
    };
}
