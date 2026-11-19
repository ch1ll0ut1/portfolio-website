/**
 * What the services pages share with the homepage, read in either language:
 * the engagements' names and audiences, two of the process steps, the case
 * study outcomes and the fit lists. Both `en.ts` and `de.ts` take them from
 * here, so a page cannot drift from the homepage cards it expands on.
 */

import type { Locale } from '@/lib/i18n/locale';
import { caseStudiesFor } from '../caseStudies';
import { type EngagementId, engagementsFor } from '../engagements';
import { fitFor } from '../fit';
import { processStepsFor } from '../processSteps';
import type { ProcessStepId } from '../home/process/types';
import type { OutcomeCopy, ServiceOfferCopy, ServicesPageCopy } from './types';

/** The case studies the proof section summarizes, in order. */
const OUTCOME_CASES = ['eko', 'socialbee', 'edithing'] as const;

/** An engagement's name, subtitle and audience, told in `locale`. */
export const fromEngagement = (locale: Locale, id: EngagementId): Pick<ServiceOfferCopy, 'id' | 'name' | 'subtitle' | 'forWho'> => {
    const engagement = engagementsFor(locale).find(candidate => candidate.id === id);

    if (!engagement) {
        throw new Error(`No engagement "${id}" in config/engagements.ts`);
    }

    return { id, name: engagement.name, subtitle: engagement.subtitle, forWho: engagement.who };
};

/** A homepage process step's description, told in `locale`. */
export const stepDescription = (locale: Locale, id: ProcessStepId) => {
    const step = processStepsFor(locale).find(candidate => candidate.id === id);

    if (!step) {
        throw new Error(`No process step "${id}" in config/processSteps.ts`);
    }

    return step.description;
};

/** The case study outcomes, told in `locale`. */
export const outcomesFor = (locale: Locale): OutcomeCopy[] => OUTCOME_CASES.map((id) => {
    const study = caseStudiesFor(locale).find(candidate => candidate.id === id);

    if (!study) {
        throw new Error(`No case study "${id}" in config/caseStudies.ts`);
    }

    return { caseId: id, client: study.client, outcome: study.result };
});

/** The two fit lists, told in `locale`. */
export const fitListsFor = (locale: Locale): Pick<ServicesPageCopy['fit'], 'goodTitle' | 'good' | 'notTitle' | 'not'> => {
    const [goodFit, notFit] = fitFor(locale).lists;

    return { goodTitle: goodFit.title, good: goodFit.items, notTitle: notFit.title, not: notFit.items };
};
