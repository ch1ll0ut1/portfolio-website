/**
 * The nine-step feature cycle that runs inside the stepper's "Build" step.
 *
 * Copy is lifted, lightly edited, from the unshipped `/how-i-work` page (see
 * `docs/how-i-work-content.md`, section 3), and lives in
 * `config/home/process/`. `bridge` is the one line of new copy: without it the
 * four-step engagement model and this nine-step cycle read as two competing
 * processes rather than one nested inside the other.
 */

import type { Locale } from '@/lib/i18n/locale';
import { processCopy } from './home/process';
import type { FeatureCycleStepId } from './home/process/types';

export interface FeatureCycleStep {
    id: FeatureCycleStepId;
    title: string;
    description: string;
}

export interface FeatureCycleContent {
    label: string;
    heading: string;
    bridge: string;
    steps: FeatureCycleStep[];
}

const stepIds: FeatureCycleStepId[] = [
    'vision-goal',
    'feature-definition',
    'technical-feasibility',
    'ux-workflow',
    'first-implementation',
    'review-feedback',
    'iteration-refinement',
    'testing-stabilization',
    'deployment-next',
];

/** The cycle in order, told in `locale`. */
export const featureCycleFor = (locale: Locale): FeatureCycleContent => {
    const { steps, ...head } = processCopy[locale].featureCycle;

    return {
        ...head,
        steps: stepIds.map(id => ({ id, ...steps[id] })),
    };
};
