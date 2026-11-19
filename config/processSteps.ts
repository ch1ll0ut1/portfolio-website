/**
 * The four-step engagement model behind the pinned process stepper.
 *
 * Each step carries the terminal transcript that types itself when the step
 * becomes active. The transcript is data rather than markup so the typing
 * engine can stay framework-agnostic; it is words too, so it lives with the
 * rest of the process section's copy in `config/home/process/`.
 */

import type { Locale } from '@/lib/i18n/locale';
import { processCopy } from './home/process';
import type { ProcessStepCopy, ProcessStepId } from './home/process/types';

export type TerminalTone = 'prompt' | 'dim' | 'ok' | 'warn';

export interface TerminalSpan {
    text: string;
    /** Omitted for plain foreground text. */
    tone?: TerminalTone;
}

export interface ProcessStep extends ProcessStepCopy {
    id: ProcessStepId;
}

const stepIds: ProcessStepId[] = ['talk', 'map', 'build', 'handover'];

/** The steps in order, told in `locale`. */
export const processStepsFor = (locale: Locale): ProcessStep[] => stepIds.map(id => ({
    id,
    ...processCopy[locale].steps[id],
}));

/** The steps in English, which the English services page reads. */
export const processSteps = processStepsFor('en');
