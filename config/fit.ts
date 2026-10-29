/**
 * Who the engagement suits and who it does not.
 *
 * Copy is lifted, lightly edited, from the unshipped `/how-i-work` page (see
 * `docs/how-i-work-content.md`, section 6), and lives in
 * `config/home/process/`. `tone` picks the list marker: a caret for a fit, a
 * struck hairline for a mismatch.
 */

import type { Locale } from '@/lib/i18n/locale';
import { processCopy } from './home/process';
import type { FitListId } from './home/process/types';

export type FitTone = 'fit' | 'unfit';

export interface FitList {
    id: FitListId;
    title: string;
    tone: FitTone;
    items: string[];
}

export interface FitContent {
    label: string;
    heading: string;
    intro: string;
    lists: [FitList, FitList];
}

/** Who it suits and who it does not, told in `locale`. */
export const fitFor = (locale: Locale): FitContent => {
    const { lists, ...head } = processCopy[locale].fit;

    return {
        ...head,
        lists: [
            { id: 'good-fit', title: lists['good-fit'].title, tone: 'fit', items: lists['good-fit'].items },
            { id: 'not-a-fit', title: lists['not-a-fit'].title, tone: 'unfit', items: lists['not-a-fit'].items },
        ],
    };
};

/** The lists in English, which the English services page reads. */
export const fitContent = fitFor('en');
